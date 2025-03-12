document.addEventListener('DOMContentLoaded', function () {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  let socket = null;
  let currentBotMessage = null; // 현재 생성된 챗봇 메시지를 저장하는 변수
  let currentMarkdownText = ''; // 마크다운 형식의 텍스트를 저장하는 변수

  function connectWebSocket() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('토큰 없음, WebSocket 연결 불가');
      alert('로그인이 필요합니다.');

      localStorage.setItem('redirect_after_login', window.location.href);

      window.location.href = 'login.html';
      return;
    }

    const wsUrl = `wss://ainfo.ai.kr/ws/chat/?token=${token}`;
    socket = new WebSocket(wsUrl);

    // WebSocket 연결이 열리면 처리
    socket.onopen = function () {
      console.log('WebSocket 연결이 열렸습니다.');
    };
        
    socket.onmessage = function (event) {
      console.log('서버로부터 받은 데이터:', event.data); // 서버에서 받은 원시 데이터 확인
        
      try {
        const data = JSON.parse(event.data); // 서버로부터 받은 응답을 처리합니다.
        console.log('파싱된 응답 데이터:', data); // 파싱된 응답 확인
                
        if (data.response) {
          addBotMessage(data.response, data.is_streaming); // 챗봇의 응답을 스트리망 상태에 따라 처리
        }
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
        addBotMessage('응답을 처리하는 중 오류가 발생했습니다.', false);
      }
    };
        
    // WebSocket 연결이 닫히면 처리
    socket.onclose = function () {
      console.log('WebSocket 연결이 종료되었습니다.');
    };
    
    // WebSocket 오류가 발생하면 처리
    socket.onerror = function (error) {
      console.error('WebSocket 오류:', error);
      addBotMessage('서버와의 연결에 오류가 발생했습니다.');
    };
  }

  function renderMarkdown(text) {
    return marked.parse(text);
  }

  // 사용자 메시지 추가
  function addUserMessage(message) {
    // 컨테이너 생성 (메시지 + 프로필 이미지)
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-wrapper', 'user-wrapper');

    // 사용자 프로필 이미지
    const profileImg = document.createElement('img');
    profileImg.src = '/assets/icons/user_profile.png'; // 사용자 프로필 이미지 경로
    profileImg.alt = 'User Profile';
    profileImg.classList.add('profile-img');

    // 메시지 요소
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.innerHTML = `<span>${message}</span>`;

    // 요소 배치 (메시지 왼쪽 + 프로필 오른쪽)
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(profileImg);

    // 채팅창에 추가
    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // AI 응답 추가 (스트리밍 상황 추가)
  function addBotMessage(message, isStreaming) {
    if (!currentBotMessage) {
      // 컨테이너 생성 (메시지 + 프로필 이미지)
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('message-wrapper', 'bot-wrapper');

      // AI 프로필 이미지
      const profileImg = document.createElement('img');
      profileImg.src = '/assets/icons/bot_profile.png'; // AI 프로필 이미지 경로
      profileImg.alt = 'Bot Profile';
      profileImg.classList.add('profile-img');

      // 메시지 요소
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', 'bot-message');
      messageDiv.innerHTML = '<div class="markdown-content"></div>'; // 마크다운 텍스트 보여주기 위한 영역

      currentBotMessage = messageDiv.querySelector('.markdown-content');  

      // 요소 배치 (프로필 왼쪽 + 메시지 오른쪽)
      messageContainer.appendChild(profileImg);
      messageContainer.appendChild(messageDiv);

      // 채팅창에 추가
      chatMessages.appendChild(messageContainer);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    if (currentBotMessage) {
      // 스트리밍 데이터를 이어 붙이기
      currentMarkdownText += message;
            
      // 마크다운을 HTML로 변환
      currentBotMessage.innerHTML = renderMarkdown(currentMarkdownText);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
        
    // 스트리밍 끝나면 변수 초기화
    if (!isStreaming) {
      currentBotMessage = null;
      currentMarkdownText = '';
    }
  }

  // 메시지 전송 핸들러
  async function sendMessage() {
    const message = userInput.value.trim();    // 사용자 입력값을 가져오고 앞뒤 공백을 제거
    if (!message) return;    // 입력값이 없으면 함수를 종료

    addUserMessage(message);  // 사용자 메시지를 화면에 표시
    userInput.value = '';    // 입력 필드를 비운다

    // 사용자 새로운 질문을 입력하면 변수 초기화
    currentBotMessage = null; 
    currentMarkdownText = '';

    // WebSocket을 통해 메시지를 서버로 전송
    const messageData = JSON.stringify({ message: message });
    socket.send(messageData); // 서버로 메시지를 전송
  }

  connectWebSocket();

  sendButton.addEventListener('click', sendMessage);    // 전송 버튼을 클릭하면 `sendMessage` 함수를 실행
  userInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') sendMessage();    // Enter 키를 누르면 `sendMessage` 함수를 실행
  });
});
