document.addEventListener("DOMContentLoaded", function () {
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

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

        try {
            const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

        const data = await response.json();    // JSON 형식으로 응답을 받습니다
        addBotMessage(data.reply);    // 챗봇의 응답을 화면에 표시


        } catch (error) {
            addBotMessage("오류가 발생했습니다. 다시 시도해주세요.");
        }
    }

    sendButton.addEventListener("click", sendMessage);    // 전송 버튼을 클릭하면 `sendMessage` 함수를 실행
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();    // Enter 키를 누르면 `sendMessage` 함수를 실행
    });
});
