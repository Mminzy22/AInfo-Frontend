import { signup, kakaoLogin } from "./api.js";

// 카카오 SDK 초기화 (config.js에서 KAKAO_JS_KEY를 전역으로 제공 중)
Kakao.init(window.appConfig.KAKAO_JS_KEY);

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const resultMessage = document.getElementById("message-container");
    const kakaoLoginBtn = document.getElementById("kakao-login-btn");

    // 1. 회원가입 처리
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 폼 제출 방지

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;
        const termsAgree = document.getElementById("terms_agree").checked;
        const marketingAgree = document.getElementById("marketing_agree").checked;

        // 비밀번호 확인
        if (password !== password2) {
            showMessage("비밀번호가 일치하지 않습니다.", "error");
            return;
        }

        const userData = {
            email,
            password,
            terms_agree: termsAgree,
            marketing_agree: marketingAgree,
        };

        try {
            // 회원가입 API 호출
            await signup(userData);
            showMessage("회원가입 성공! 로그인 페이지로 이동합니다.", "success");

            // 2초 후 로그인 페이지 이동
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } catch (error) {
            console.error("회원가입 실패:", error);
            showMessage(error.message || "회원가입 중 오류가 발생했습니다.", "error");
        }
    });

    // 2. 카카오 로그인 처리
    kakaoLoginBtn.addEventListener("click", () => {
        Kakao.Auth.login({
            throughTalk: false,
            persistAccessToken: false,
            success: async function (authObj) {
                const kakaoAccessToken = authObj.access_token;

                try {
                    const user = await kakaoLogin(kakaoAccessToken);
                    alert(`${user.name || "사용자"}님 환영합니다!`);
                    window.location.href = "/index.html";
                } catch (error) {
                    console.error("카카오 로그인 실패:", error);
                    showMessage(error.message || "카카오 로그인 실패", "error");
                }
            },
            fail: function (err) {
                console.error("카카오 SDK 인증 실패:", err);
                showMessage("카카오 로그인 인증 중 오류가 발생했습니다.", "error");
            },
        });
    });

    // 3. 메시지 출력 함수
    function showMessage(message, type) {
        resultMessage.innerHTML = `<p class="message ${type}">${message}</p>`;
        resultMessage.style.display = "block";
    }
});
