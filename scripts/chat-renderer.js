// chat-renderer.js : 채팅 메시지 렌더링 담당

class ChatRenderer {
  constructor(chatMessagesElement) {
    this.chatMessages = chatMessagesElement;
    this.currentBotMessage = null;
    this.currentMarkdownText = '';
  }

  renderMarkdown(text) {
    return marked.parse(text);
  }

  addUserMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-wrapper', 'user-wrapper');

    const profileImg = document.createElement('img');
    profileImg.src = '/assets/icons/user_profile.png';
    profileImg.alt = 'User Profile';
    profileImg.classList.add('profile-img');

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    const formattedMessage = message.replace(/\n/g, '<br>');
    messageElement.innerHTML = `<span>${formattedMessage}</span>`;

    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(profileImg);

    this.chatMessages.appendChild(messageContainer);
    this.scrollToBottom();
  }

  addBotMessage(message, isStreaming) {
    // 응답 시작 전에는 메시지 초기화
    if (!isStreaming) {
      this.resetCurrentMessage();
      return;
    }

    if (!this.currentBotMessage) {
      // 메시지 처음 생성 시
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

    this.currentMarkdownText += message;
    this.currentBotMessage.innerHTML = this.renderMarkdown(this.currentMarkdownText);
    this.scrollToBottom();
  }

  addBotMessageInitial(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-wrapper', 'bot-wrapper');

    const profileImg = document.createElement('img');
    profileImg.src = '/assets/icons/bot_profile.png';
    profileImg.alt = 'Bot Profile';
    profileImg.classList.add('profile-img');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message');

    const markdownDiv = document.createElement('div');
    markdownDiv.classList.add('markdown-content');
    markdownDiv.innerHTML = this.renderMarkdown(message);

    messageDiv.appendChild(markdownDiv);
    messageContainer.appendChild(profileImg);
    messageContainer.appendChild(messageDiv);
    this.chatMessages.appendChild(messageContainer);
    this.scrollToBottom();
  }

  addLoadingMessage() {
    this.removeLoadingMessage(); // 중복 방지

    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('message-wrapper', 'bot-wrapper', 'loading');
    loadingContainer.setAttribute('id', 'bot-loading');

    const profileImg = document.createElement('img');
    profileImg.src = '/assets/icons/bot_profile.png';
    profileImg.alt = 'Bot Profile';
    profileImg.classList.add('profile-img');

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');
    messageElement.innerHTML = '<span>답변을 생성 중입니다...</span>';

    loadingContainer.appendChild(profileImg);
    loadingContainer.appendChild(messageElement);
    this.chatMessages.appendChild(loadingContainer);
    this.scrollToBottom();
  }

  removeLoadingMessage() {
    const existing = document.getElementById('bot-loading');
    if (existing) {
      existing.remove();
    }
  }

  resetCurrentMessage() {
    this.currentBotMessage = null;
    this.currentMarkdownText = '';
    this.removeLoadingMessage(); // 스피너 제거도 포함
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
}

export default ChatRenderer;
