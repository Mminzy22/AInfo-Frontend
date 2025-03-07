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
        profileImg.src = "/assets/images/user_profile.png"; // 사용자 프로필 이미지 경로
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
        profileImg.src = "/assets/images/bot_profile.png"; // AI 프로필 이미지 경로
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
        const message = userInput.value.trim();
        if (!message) return;

        addUserMessage(message);
        userInput.value = "";

        try {
            const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            addBotMessage(data.reply);
        } catch (error) {
            addBotMessage("오류가 발생했습니다. 다시 시도해주세요.");
        }
    }

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });
});
