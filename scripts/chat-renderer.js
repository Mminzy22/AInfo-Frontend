// chat-renderer.js : 채팅 메시지 렌더링 담당
class ChatRenderer {
  constructor(chatMessagesElement) {
    this.chatMessages = chatMessagesElement; // 채팅 메시지를 담는 DOM 요소
    this.currentBotMessage = null;           // 현재 출력 중인 봇 메시지
    this.currentMarkdownText = '';           // 스트리밍 중 누적된 마크다운 텍스트
  }
  
  // 마크다운 텍스트를 HTML로 변환
  renderMarkdown(text) {
    return marked.parse(text);
  }
  
  // 사용자 메시지 추가
  addUserMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-wrapper', 'user-wrapper');
  
    const profileImg = document.createElement('img');
    profileImg.src = '/assets/icons/user_profile.png';
    profileImg.alt = 'User Profile';
    profileImg.classList.add('profile-img');
  
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.innerHTML = `<span>${message}</span>`;
  
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(profileImg);
  
    this.chatMessages.appendChild(messageContainer);
    this.scrollToBottom(); // 스크롤 아래로 이동
  }
  
  // 봇 메시지 추가 (스트리밍 포함)
  addBotMessage(message, isStreaming) {

    // 로딩 메시지 있으면 먼저 삭제
    const loadingMessageContainer = document.querySelector('.message-wrapper.bot-wrapper.loading');
    if (loadingMessageContainer) {
      loadingMessageContainer.remove();
    }
    // 새 봇 메시지를 처음 렌더링할 때만 DOM 요소 생성
    if (!this.currentBotMessage) {
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('message-wrapper', 'bot-wrapper');
  
      const profileImg = document.createElement('img');
      profileImg.src = '/assets/icons/bot_profile.png';
      profileImg.alt = 'Bot Profile';
      profileImg.classList.add('profile-img');
  
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', 'bot-message');
      messageDiv.innerHTML = '<div class="markdown-content"></div>';
  
      this.currentBotMessage = messageDiv.querySelector('.markdown-content');
  
      messageContainer.appendChild(profileImg);
      messageContainer.appendChild(messageDiv);
  
      this.chatMessages.appendChild(messageContainer);
      this.scrollToBottom();
    }
  
    // 스트리밍 중인 텍스트 누적 및 렌더링
    if (this.currentBotMessage) {
      this.currentMarkdownText += message;
      this.currentBotMessage.innerHTML = this.renderMarkdown(this.currentMarkdownText);
      this.scrollToBottom();
    }
  
    // 스트리밍이 끝났으면 상태 초기화
    if (!isStreaming) {
      this.resetCurrentMessage();
    }
  }
  
  // 봇 메시지 렌더링 상태 초기화
  resetCurrentMessage() {
    this.currentBotMessage = null;
    this.currentMarkdownText = '';
  }
  
  // 채팅창 스크롤을 가장 아래로 내림
  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
  // 로딩메시지
  addLoadingMessage() {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-wrapper', 'bot-wrapper', 'loading');
      
    const profileImg = document.createElement('img');
    profileImg.src = '/assets/icons/bot_profile.png';
    profileImg.alt = 'Bot Profile';
    profileImg.classList.add('profile-img');
      
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message');
    messageDiv.innerHTML = '<div class="markdown-content">답변을 생성 중입니다...</div>';
      
    messageContainer.appendChild(profileImg);
    messageContainer.appendChild(messageDiv);
      
    this.chatMessages.appendChild(messageContainer);
    this.scrollToBottom();
  }
}
  
export default ChatRenderer;
  