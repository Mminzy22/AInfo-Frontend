import { signup, kakaoLogin, googleLogin } from './api.js';

// 카카오 SDK 초기화 (config.js에서 KAKAO_JS_KEY를 전역으로 제공 중)
Kakao.init(window.appConfig.KAKAO_JS_KEY);

document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signup-form');
  const resultMessage = document.getElementById('message-container');
  const kakaoLoginBtn = document.getElementById('kakao-login-btn');
  const googleLoginDiv = document.getElementById('google-login-btn');

  // 1. 회원가입 처리
  signupForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const termsAgree = document.getElementById('terms_agree').checked;
    const marketingAgree = document.getElementById('marketing_agree').checked;

    // 비밀번호 확인
    if (password !== password2) {
      showMessage('비밀번호가 일치하지 않습니다.', 'error');
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
      showMessage('회원가입 성공! 로그인 페이지로 이동합니다.', 'success');
      alert('이메일로 전달한 인증링크를 통해 본인확인을 해주세요!');

      // 2초 후 로그인 페이지 이동
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } catch (error) {
      console.error('회원가입 실패:', error);
      const data = error.response?.data;

      if (data && typeof data === 'object') {
        // 모든 필드별 에러를 순회
        for (const field in data) {
          const messages = data[field];
          if (Array.isArray(messages)) {
            // 필드명을 보기 좋게 한글로 변환
            const fieldNameMap = {
              email: '이메일',
              password: '비밀번호',
              name: '이름',
              terms_agree: '약관 동의',
              marketing_agree: '마케팅 동의',
              non_field_errors: '오류',
            };
        
            const label = fieldNameMap[field] || field;
            showMessage(`[${label}] ${messages[0]}`, 'error');
            return;
          }
        }
      }
      showMessage(error.message || '회원가입 중 오류가 발생했습니다.', 'error');
    }
  });

  // 2. 카카오 로그인 처리
  kakaoLoginBtn.addEventListener('click', () => {
    Kakao.Auth.login({
      throughTalk: false,
      persistAccessToken: false,
      success: async function (authObj) {
        const kakaoAccessToken = authObj.access_token;

        try {
          const user = await kakaoLogin(kakaoAccessToken);
          alert(`${user.name || '사용자'}님 환영합니다!`);
          window.location.href = '/index.html';
        } catch (error) {
          console.error('카카오 로그인 실패:', error);
          showMessage(error.message || '카카오 로그인 실패', 'error');
        }
      },
      fail: function (err) {
        console.error('카카오 SDK 인증 실패:', err);
        showMessage('카카오 로그인 인증 중 오류가 발생했습니다.', 'error');
      },
    });
  });


  // 3. 구글 로그인 초기화 및 콜백 처리
  window.onload = function () {
    google.accounts.id.initialize({
      client_id: window.appConfig.GOOGLE_CLIENT_ID,
      callback: async function (response) {
        const idToken = response.credential;

        try {
          const user = await googleLogin(idToken);
          alert(`${user.name || '사용자'}님 환영합니다!`);
          window.location.href = '/index.html';
        } catch (error) {
          console.error('구글 로그인 실패:', error);
          showMessage(error.message || '구글 로그인 실패', 'error');
        }
      },
    });

    // 구글 로그인 버튼 렌더링
    if (googleLoginDiv) {
      google.accounts.id.renderButton(googleLoginDiv, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: googleLoginDiv.offsetWidth,
      });
    }
  };

  // 3. 메시지 출력 함수
  function showMessage(message, type) {
    const className = type === 'error' ? 'error-message' : 'success-message';
    resultMessage.innerHTML = `<p class="${className}">${message}</p>`;
    resultMessage.style.display = 'block';
  }
});

document.addEventListener('DOMContentLoaded', function () {
  function openModal(modalId) {
    let modal = document.getElementById(modalId);
    modal.style.display = 'block';
    modal.querySelector('.modal-content').scrollTop = 0;
  }

  document.getElementById('open-terms-modal').addEventListener('click', function (event) {
    event.preventDefault();
    openModal('terms-modal');
  });

  document.getElementById('open-marketing-modal').addEventListener('click', function (event) {
    event.preventDefault();
    openModal('marketing-modal');
  });

  document.querySelectorAll('.close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      let modalId = this.getAttribute('data-target');
      document.getElementById(modalId).style.display = 'none';
    });
  });

  window.addEventListener('click', function (event) {
    document.querySelectorAll('.modal').forEach(function (modal) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
});