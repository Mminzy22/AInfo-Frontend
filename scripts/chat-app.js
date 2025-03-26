// chat-app.js : 메인 애플리케이션 로직 및 모듈 간 통합

import WebSocketService from './websocket-service.js';
import ChatRenderer from './chat-renderer.js';
import { renameChatRoom, createChatRoom, getChatRoomList } from './api.js';
import { loadChatRooms, initSidebar } from './chat-sidebar.js';

class ChatApp {
  constructor() {
    this.chatMessages = document.getElementById('chat-messages');
    this.userInput = document.getElementById('user-input');
    this.sendButton = document.getElementById('send-button');

    this.renderer = new ChatRenderer(this.chatMessages);

    this.websocketService = null;
    this.currentRoomId = null;
    this.isFirstResponseHandled = false;
    this.firstUserMessage = null;
    this.pendingMessage = null;

    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.userInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') this.sendMessage();
    });
  }

  async sendMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;

    this.renderer.addUserMessage(message);
    this.renderer.addLoadingMessage();
    this.userInput.value = '';
    // this.renderer.resetCurrentMessage();

    // 메시지 상태만 초기화하고 스피너는 유지
    this.renderer.currentBotMessage = null;
    this.renderer.currentMarkdownText = '';
    // 아직 연결되지 않았을 때
    if (!this.websocketService) {
      this.firstUserMessage = message;
      this.pendingMessage = message;

      let room = null;

      if (this.currentRoomId) {
        // 정확한 room 객체를 가져온다
        const allRooms = await getChatRoomList();
        room = allRooms.find(r => r.id === this.currentRoomId);
      } else {
        room = await createChatRoom();
        this.currentRoomId = room.id;
      }

      if (!room) {
        alert('채팅방 정보를 불러올 수 없습니다.');
        return;
      }

      await this.init(room);
      await loadChatRooms();
      return;
    }

    this.websocketService.sendMessage(message);
  }

  async init(room) {
    this.currentRoomId = room.id;
    this.isFirstResponseHandled = false;
    this.firstUserMessage = this.pendingMessage;

    this.websocketService = new WebSocketService(
      async (message, isStreaming) => {
        // 스트리밍 시작 시 로딩 메시지 제거
        if (isStreaming && !this.renderer.currentBotMessage) {
          this.renderer.removeLoadingMessage();
        }
        
        this.renderer.addBotMessage(message, isStreaming);

        if (!isStreaming && !this.isFirstResponseHandled) {
          this.isFirstResponseHandled = true;

          if (room.title === '새 채팅') {
            try {
              if (this.firstUserMessage && this.firstUserMessage.trim()) {
                await renameChatRoom(room.id, this.firstUserMessage);
                await loadChatRooms();
              }
            } catch (err) {
              console.error('채팅방 제목 자동 변경 실패:', err);
            }
          }
        }
      }
    );

    await this.websocketService.connect(room.id);

    if (this.pendingMessage) {
      this.websocketService.sendMessage(this.pendingMessage);
      this.pendingMessage = null;
    }
  }

  reset() {
    if (this.websocketService) {
      this.websocketService.disconnect();
      this.websocketService = null;
    }
    this.renderer.resetCurrentMessage();
    this.isFirstResponseHandled = false;
    this.firstUserMessage = null;
    this.pendingMessage = null;
    this.currentRoomId = null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    alert('로그인이 필요합니다.');
    localStorage.setItem('redirect_after_login', window.location.href);
    window.location.href = 'login.html';
    return;
  }
  await initSidebar();
  window.chatApp = new ChatApp();

  const room = await createChatRoom();
  window.chatApp.currentRoomId = room.id;

  // 안내 메시지
  window.chatApp.renderer.addBotMessageInitial('안녕하세요! 무엇을 도와드릴까요?');
});

export default ChatApp;
