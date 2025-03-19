import { login, kakaoLogin, googleLogin, resetPassword } from './api.js'; // 일반 로그인 + 카카오 로그인

// 카카오 SDK 초기화 (config.js에서 KAKAO_JS_KEY를 전역으로 제공 중)
Kakao.init(window.appConfig.KAKAO_JS_KEY);

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const resultMessage = document.getElementById('message-container');
  const kakaoLoginBtn = document.getElementById('kakao-login-btn');
  const googleLoginDiv = document.getElementById('google-login-btn');

  // 1. 이메일/비밀번호 로그인
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const credentials = { email, password };

    try {
      // 로그인 API 호출
      const response = await login(credentials);

      // JWT 토큰 저장 (로컬 스토리지)
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);

      alert('로그인 성공!');

      const redirectUrl = localStorage.getItem('redirect_after_login') || '/index.html';
      localStorage.removeItem('redirect_after_login');

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    } catch (error) {
      console.error('로그인 실패:', error.message);
      showMessage(error.message || '로그인 중 오류가 발생했습니다.', 'error');
    }
  });

  // 2. 카카오 로그인 버튼 클릭
  kakaoLoginBtn.addEventListener('click', () => {
    Kakao.Auth.login({
      throughTalk: false,            // 카카오톡 앱이 아닌 브라우저에서 로그인
      persistAccessToken: false,     // 기존 access_token을 무시하고 새 로그인 강제
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

  // 공통 메시지 출력 함수
  function showMessage(message, type) {
    const className = type === 'error' ? 'error-message' : 'success-message';
    resultMessage.innerHTML = `<p class="${className}">${message}</p>`;
    resultMessage.style.display = 'block';
  }
});


// 비밀번호 찾기 링크 클릭 시 모달 열기
document.getElementById('find-password').addEventListener('click', function(e) {
  e.preventDefault(); // 기본 링크 동작 방지
  document.getElementById('password-reset-modal').style.display = 'flex'; // 모달 열기
});

// 모달 닫기
document.getElementById('modal-close').addEventListener('click', function() {
  document.getElementById('password-reset-modal').style.display = 'none'; // 모달 닫기
});

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(e) {
  if (e.target == document.getElementById('password-reset-modal')) {
    document.getElementById('password-reset-modal').style.display = 'none'; // 모달 닫기
  }
});

// 비밀번호 찾기 폼 제출 시 처리 (백엔드로 요청 보내기)
document.getElementById('password-reset-form').addEventListener('submit', async function(e) {
  e.preventDefault();  // 기본 폼 제출 동작 방지

  const email = document.getElementById('reset-email').value;
  
  // 이메일이 비어있지 않은지 확인
  if (!email) {
    alert('이메일을 입력해 주세요.');
    return;
  }

  try {
    // 백엔드로 비밀번호 리셋 요청 보내기
    const response = await resetPassword(email);
    
    // 성공 시
    console.log('서버 응답:', response);
    alert(response.message);
    document.getElementById('password-reset-modal').style.display = 'none'; // 모달 닫기
  } catch (error) {
    // 에러 시
    console.error('서버 오류:', error.message);
    alert(error.message);
  }
});
