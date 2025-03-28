document.addEventListener('DOMContentLoaded', function () {
  renderHeader();
  renderFooter();
});

/**
 * 헤더 동적 생성 (로그인 상태 확인하여 버튼 변경)
 */
function renderHeader() {
  const isLoggedIn = localStorage.getItem('access_token') !== null;

  const headerHTML = `
        <header class="header">
            <div class="header-container">
                <a href="/" class="logo">
                  <img src="/assets/icons/main-logo7.png">
                </a>
                <div class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
              </div>
                <nav class="nav">
                    <a href="/pages/chatbot.html" class="nav-link">챗봇</a>
                    <a href="/pages/introduction.html" class="nav-link">소개</a>  
                    <a href="/pages/payment.html" class="nav-link">충전</a>
                    <div class="auth-links">
                        ${isLoggedIn ? `
                            <a href="/pages/profile.html" class="nav-link profile-btn auth-link-user">프로필</a>
                            <a href="#" class="nav-link logout-btn auth-link-user">로그아웃</a>
                        ` : `
                            <a href="/pages/login.html" class="nav-link login-btn auth-link-guest">로그인</a>
                            <a href="/pages/signup.html" class="nav-link signup-btn auth-link-guest">회원가입</a>
                        `}
                    </div>
                </nav>
            </div>
        </header>
        <div class="menu-overlay"></div>
    `;

  document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

/**
 * 🚀 푸터 동적 생성
 */
function renderFooter() {
  const footerHTML = `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <a href="/" class="logo">
            <img src="/assets/icons/main-logo7.png">
          </a>
          <div class="social-links">
            <a href="https://github.com/Mminzy22/AInfo-Backend" class="social-link" target="_blank" rel="noopener noreferrer">
              <img src="/assets/icons/github-logo.png">
            </a>
            <a href="https://young-hardware-f96.notion.site/19faf76d38e280cd8ebbc140c6588adf" class="social-link" target="_blank" rel="noopener noreferrer">
              <img src="/assets/icons/Notion-logo.png">
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h3 class="footer-heading">AInfo</h3>
          <p class="footer-text">내일배움캠프 AI 트랙 9기</p>
          <p class="footer-text">ainfo.ai.kr@gmail.com</p>
        </div>

        <div class="footer-section">
          <div class="footer-grid">
            <div>
              <h3 class="footer-heading">개인정보처리방침</h3>
              <p class="footer-text"><span class="open-terms" style="cursor:pointer;">사이트 이용 약관</span></p>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- 약관 모달 -->
    <div id="termsModal" class="modal hidden">
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <div class="modal-body">
          <h2>서비스 이용 약관</h2>
          <p>AInfo은(는) 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며 귀하의 개인정보보호에 최선을 다하고 있습니다.</p>
          <p>AInfo는 개인정보보호법에 근거하여 다음과 같은 내용으로 개인정보를 수집 및 처리하고자 합니다.<br>다음의 내용을 자세히 읽어보시고 모든 내용을 이해하신 후에 동의 여부를 결정해주시기 바랍니다.</p>

          <h3>제1조 (개인정보 수집 및 이용 목적)</h3>
          <p>이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며, 목적 이외의 용도로는 사용되지 않습니다.</p>
          <ul><li>본인확인 및 맞춤형 서비스 제공</li></ul>

          <h3>제2조 (개인정보 수집 및 이용 항목)</h3>
          <p>AInfo는 개인정보 수집 목적을 위하여 다음과 같은 정보를 수집합니다.</p>
          <ul><li>성명, 주소, 이메일, 성별, 나이, 생년월일 및 공공서비스 지원조건 관련 개인정보</li></ul>

          <h3>제3조 (개인정보 보유 및 이용 기간)</h3>
          <p>수집한 개인정보는 수집·이용 동의일로부터 <strong>1년간</strong> 보관 및 이용합니다.</p>
          <p>개인정보 보유기간의 경과, 처리목적의 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>

          <h3>제4조 (동의 거부 권리 및 불이익)</h3>
          <p>귀하는 본 안내에 따른 개인정보 수집·이용에 대하여 동의를 거부할 권리가 있습니다.</p>
          <p>다만, 거부 시 <strong>맞춤형 챗봇 서비스 이용 제한</strong>의 불이익이 발생할 수 있습니다.</p>

          <p>본인은 위의 동의서 내용을 충분히 숙지하였으며, 위와 같이 개인정보를 수집·이용하는데 동의합니다.</p>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', footerHTML);
}

/**
 * 로그아웃 버튼 이벤트 리스너 (이벤트 위임 방식)
 */
document.addEventListener('click', async function (event) {
  if (event.target.classList.contains('logout-btn')) {
    event.preventDefault(); // 기본 동작 방지 (페이지 새로고침 막기)
    await handleLogout();
  }
});

/**
 * 로그아웃 처리 (`api.js`의 `logout()` 함수 호출)
 */
async function handleLogout() {
  try {
    if (typeof window.logout === 'function') {
      await window.logout(); // `api.js`의 logout() 호출
      alert('로그아웃 되었습니다.');
      window.location.href = '/'; // 메인 페이지로 이동
    } else {
      console.error('window.logout 함수가 정의되지 않았습니다.');
    }
  } catch (error) {
    alert(error.message || '로그아웃 실패. 다시 시도하세요.'); // 오류 메시지 출력
  }
}

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('open-terms')) {
    document.getElementById('termsModal').classList.remove('hidden');
  }

  if (event.target.classList.contains('close-button') || event.target.id === 'termsModal') {
    document.getElementById('termsModal').classList.add('hidden');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.menu-overlay');

  if (toggle && nav && overlay) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
});