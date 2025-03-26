// websocket-service.js : WebSocket 연결 및 통신 관리
class WebSocketService {
  constructor(messageHandler) {
    this.socket = null;
    this.messageHandler = messageHandler;
  }

  async connect(roomId) {
    console.log('👉 WebSocket connect 호출됨, roomId:', roomId);

    const token = localStorage.getItem('access_token');
    if (this.socket) {
      console.log('🔌 기존 WebSocket 연결 종료');
      this.socket.close();
    }

    if (!token) {
      console.error('토큰 없음, WebSocket 연결 불가');
      alert('로그인이 필요합니다.');
      localStorage.setItem('redirect_after_login', window.location.href);
      window.location.href = 'login.html';
      return;
    }

    const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`;
    // const wsUrl = `wss://ainfo.ai.kr/ws/chat/${roomId}/?token=${token}`;

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('✅ WebSocket 연결됨');
        resolve();
      };

      this.socket.onmessage = (event) => {
        // console.log('서버로부터 받은 데이터:', event.data);

        try {
          const data = JSON.parse(event.data);
          // console.log('파싱된 응답 데이터:', data);

          if (data.response) {
            this.messageHandler(data.response, data.is_streaming);
          }
        } catch (error) {
          console.error('JSON 파싱 오류:', error);
          this.messageHandler('응답을 처리하는 중 오류가 발생했습니다.', false);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket 연결이 종료되었습니다.');
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        this.messageHandler('서버와의 연결에 오류가 발생했습니다.', false);
        reject(error);
      };
    });
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('📤 WebSocket 메시지 전송:', message);
      const messageData = JSON.stringify(message);
      this.socket.send(messageData);
      return true;
    }
    console.warn('WebSocket이 아직 연결되지 않았습니다.');
    return false;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default WebSocketService;
