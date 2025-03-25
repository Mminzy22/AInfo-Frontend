// websocket-service.js : WebSocket 연결 및 통신 관리
class WebSocketService {
    constructor(messageHandler) {
      this.socket = null; // WebSocket 인스턴스 저장용
      this.messageHandler = messageHandler; // 메시지 처리 콜백 함수
    }
  
    connect() {
      const token = localStorage.getItem('access_token'); // 로컬스토리지에서 토큰 가져오기
      if (!token) {
        console.error('토큰 없음, WebSocket 연결 불가');
        alert('로그인이 필요합니다.');
        localStorage.setItem('redirect_after_login', window.location.href); // 로그인 후 돌아올 위치 저장
        window.location.href = 'login.html'; // 로그인 페이지로 이동
        return;
      }
  
      const wsUrl = `wss://ainfo.ai.kr/ws/chat/?token=${token}`; // WebSocket URL 생성
      this.socket = new WebSocket(wsUrl); // WebSocket 연결 생성
  
      this.socket.onopen = () => {
        console.log('WebSocket 연결이 열렸습니다.');
      };
  
      this.socket.onmessage = (event) => {
        console.log('서버로부터 받은 데이터:', event.data);
  
        try {
          const data = JSON.parse(event.data); // JSON 파싱
          console.log('파싱된 응답 데이터:', data);
  
          if (data.response) {
            this.messageHandler(data.response, data.is_streaming); // 콜백 함수로 메시지 전달
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
      };
    }
  
    sendMessage(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const messageData = JSON.stringify({ message: message }); // 메시지를 JSON으로 변환
        this.socket.send(messageData); // 서버로 메시지 전송
        return true;
      }
      return false; // 연결이 안 되어 있으면 false 반환
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close(); // WebSocket 연결 종료
      }
    }
  }
  
  export default WebSocketService;
  