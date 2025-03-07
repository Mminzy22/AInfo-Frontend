document.addEventListener("DOMContentLoaded", function () {
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    // WebSocket 연결
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

    // WebSocket 연결이 열리면 처리
    socket.onopen = function () {
        console.log("WebSocket 연결이 열렸습니다.");
    };

    socket.onmessage = function (event) {
        console.log("서버로부터 받은 데이터:", event.data); // 서버에서 받은 원시 데이터 확인
    
        try {
            const data = JSON.parse(event.data); // 서버로부터 받은 응답을 처리합니다.
            console.log("파싱된 응답 데이터:", data); // 파싱된 응답 확인
    
            if (data.response) {
                addBotMessage(data.response); // 챗봇의 응답을 화면에 표시합니다.
            } else {
                addBotMessage("응답 형식에 오류가 있습니다.");
            }
        } catch (error) {
            console.error("JSON 파싱 오류:", error);
            addBotMessage("응답을 처리하는 중 오류가 발생했습니다.");
        }
    };

    // 사용자 메시지 추가
    function addUserMessage(message) {
        // 컨테이너 생성 (메시지 + 프로필 이미지)
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-wrapper", "user-wrapper");

        // 사용자 프로필 이미지
        const profileImg = document.createElement("img");
        profileImg.src = "/assets/icons/user_profile.png"; // 사용자 프로필 이미지 경로
        profileImg.alt = "User Profile";
        profileImg.classList.add("profile-img");

        // 메시지 요소
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "user-message");
        messageElement.innerHTML = `<span>${message}</span>`;
        // messageElement.innerHTML = marked(message);

        // 요소 배치 (메시지 왼쪽 + 프로필 오른쪽)
        messageContainer.appendChild(messageElement);
        messageContainer.appendChild(profileImg);

        // 채팅창에 추가
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // AI 응답 추가
    function addBotMessage(message) {
        // 컨테이너 생성 (메시지 + 프로필 이미지)
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-wrapper", "bot-wrapper");

        // AI 프로필 이미지
        const profileImg = document.createElement("img");
        profileImg.src = "/assets/icons/bot_profile.png"; // AI 프로필 이미지 경로
        profileImg.alt = "Bot Profile";
        profileImg.classList.add("profile-img");

        // 메시지 요소
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "bot-message");
        messageElement.innerHTML = `<span>${message}</span>`;

        // 요소 배치 (프로필 왼쪽 + 메시지 오른쪽)
        messageContainer.appendChild(profileImg);
        messageContainer.appendChild(messageElement);

        // 채팅창에 추가
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 메시지 전송 핸들러
    async function sendMessage() {
        const message = userInput.value.trim();    // 사용자 입력값을 가져오고 앞뒤 공백을 제거
        if (!message) return;    // 입력값이 없으면 함수를 종료

        addUserMessage(message);  // 사용자 메시지를 화면에 표시
        userInput.value = "";    // 입력 필드를 비운다

        // WebSocket을 통해 메시지를 서버로 전송
        const messageData = JSON.stringify({ message: message });
        socket.send(messageData); // 서버로 메시지를 전송
    }

    sendButton.addEventListener("click", sendMessage);    // 전송 버튼을 클릭하면 `sendMessage` 함수를 실행
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();    // Enter 키를 누르면 `sendMessage` 함수를 실행
    });
    // WebSocket 연결이 닫히면 처리
    socket.onclose = function () {
        console.log("WebSocket 연결이 종료되었습니다.");
    };

    // WebSocket 오류가 발생하면 처리
    socket.onerror = function (error) {
        console.error("WebSocket 오류:", error);
        addBotMessage("서버와의 연결에 오류가 발생했습니다.");
    };
});
