// chat-renderer.js : 채팅 메시지 렌더링 담당
import pdfGenerator from './pdf-generator.js';

marked.use({
  renderer: {
    link(href, title, text) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ''}>${text}</a>`;
    }
  },
  breaks: true
});

class ChatRenderer {
  constructor(chatMessagesElement) {
    this.chatMessages = chatMessagesElement;
    this.currentBotMessage = null;
    this.currentMarkdownText = '';
  }

  renderMarkdown(text) {
    return marked.parse(text);
  }

  addSystemMessage(text) {
    const messageEl = document.createElement('div');
    messageEl.className = 'system-message';
    messageEl.textContent = text;
    this.chatMessages.appendChild(messageEl);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
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

    if (isStreaming) {
      this.currentMarkdownText += message;
    } else {
      this.currentMarkdownText = message;
    }
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

  addLoadingMessage(message = '답변을 생성 중입니다...') {
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
    messageElement.innerHTML = `<span>${message}</span>`;

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

  addDownloadButton(messageElement, content, isReport = false) {
    // 이미 다운로드 버튼이 있는지 확인
    if (messageElement.querySelector('.pdf-download-btn')) {
      return;
    }

    const downloadContainer = document.createElement('div');
    downloadContainer.classList.add('download-container');

    const downloadBtn = document.createElement('button');
    downloadBtn.classList.add('pdf-download-btn');
    downloadBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 5px;">
        <path d="M12 16L12 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M9 13L12 16L15 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      ${isReport ? 'PDF 다운로드' : 'PDF로 저장'}
    `;

    downloadBtn.addEventListener('click', async () => {
      try {
        downloadBtn.disabled = true;
        downloadBtn.textContent = '생성 중...';

        // 제목 생성
        const title = isReport ? '보고서' : 'AInfo 챗봇 대화';

        // PDF 생성 및 다운로드
        await pdfGenerator.generatePDF(content, title);
      } catch (error) {
        console.error('PDF 생성 오류:', error);
        alert('PDF 생성 중 오류가 발생했습니다.');
      } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 5px;">
            <path d="M12 16L12 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M9 13L12 16L15 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          ${isReport ? 'PDF 다운로드' : 'PDF로 저장'}
        `;
      }
    });
    downloadContainer.appendChild(downloadBtn);
    messageElement.appendChild(downloadContainer);
  }
}

export default ChatRenderer;
