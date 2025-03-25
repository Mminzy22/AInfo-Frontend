// chat-app.js : 메인 애플리케이션 로직 및 모듈 간 통합

import WebSocketService from './websocket-service.js'; // WebSocket 모듈
import ChatRenderer from './chat-renderer.js';         // 채팅 렌더링 모듈

class ChatApp {
  constructor() {
    // DOM 요소 참조
    this.chatMessages = document.getElementById('chat-messages');
    this.userInput = document.getElementById('user-input');
    this.sendButton = document.getElementById('send-button');

    // 렌더러와 WebSocket 서비스 초기화
    this.renderer = new ChatRenderer(this.chatMessages);
    this.websocketService = new WebSocketService(
      (message, isStreaming) => this.renderer.addBotMessage(message, isStreaming)
    );

    this.init(); // 이벤트 및 WebSocket 연결 초기화
  }

  init() {
    this.websocketService.connect(); // WebSocket 연결 시작

    // 전송 버튼 클릭 시 메시지 전송
    this.sendButton.addEventListener('click', () => this.sendMessage());

    // 엔터 키 입력 시 메시지 전송
    this.userInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') this.sendMessage();
    });
  }

  sendMessage() {
    const message = this.userInput.value.trim();
    if (!message) return; // 빈 메시지는 무시

    this.renderer.addUserMessage(message); // 사용자 메시지 렌더링
    this.renderer.addLoadingMessage();  // 스피너
    this.userInput.value = ''; // 입력창 초기화

    this.renderer.resetCurrentMessage(); // 봇 메시지 상태 초기화
    this.websocketService.sendMessage(message); // 서버로 메시지 전송
  }
}

// DOM 로딩 후 애플리케이션 실행
document.addEventListener('DOMContentLoaded', () => {
  new ChatApp();
});

export default ChatApp;
