import { signup } from "./api.js"; // API 요청 함수 불러오기

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const resultMessage = document.getElementById("message-container");

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 폼 제출 방지

        // 입력된 값 가져오기
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;
        const termsAgree = document.getElementById("terms_agree").checked;
        const marketingAgree = document.getElementById("marketing_agree").checked;

        // 비밀번호 확인 검사
        if (password !== password2) {
            showMessage("비밀번호가 일치하지 않습니다.", "error");
            return;
        }

        const userData = { email, password, terms_agree: termsAgree, marketing_agree: marketingAgree };

        try {
            // 회원가입 API 호출
            await signup(userData);

            showMessage("회원가입 성공! 로그인 페이지로 이동합니다.", "success");

            // 2초 후 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);

        } catch (error) {
            console.error("회원가입 실패:", error);
            showMessage(error.message || "회원가입 중 오류가 발생했습니다.", "error");
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
