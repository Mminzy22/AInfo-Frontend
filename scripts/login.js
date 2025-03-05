import { login } from "./api.js"; // API 요청 함수 불러오기

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const resultMessage = document.getElementById("message-container");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 폼 제출 방지

        // 입력된 값 가져오기
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const credentials = { email, password };

        try {
            // 로그인 API 호출
            const response = await login(credentials);

            // JWT 토큰 저장 (로컬 스토리지)
            localStorage.setItem("access_token", response.access);
            localStorage.setItem("refresh_token", response.refresh);

            alert("로그인 성공! 메인 페이지로 이동합니다.");

            // 2초 후 메인 페이지로 이동
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 2000);

        } catch (error) {
            console.error("로그인 실패:", error);
            showMessage(error.error || "로그인 중 오류가 발생했습니다.", "error");
        }
    });

    /**
     * 메시지 표시 함수
     * @param {string} message - 표시할 메시지
     * @param {string} type - "success" | "error"
     */
    function showMessage(message, type) {
        resultMessage.innerHTML = `<p class="message ${type}">${message}</p>`;
        resultMessage.style.display = "block";
    }
});
