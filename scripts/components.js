document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
  });
  
  /**
   * 헤더 동적 생성 (로그인 상태 확인하여 버튼 변경)
   */
  function renderHeader() {
    const isLoggedIn = localStorage.getItem("access_token") !== null;
  
    const headerHTML = `
        <header class="header">
            <div class="header-container">
                <a href="/" class="logo">A</a>
                <nav class="nav">
                    <a href="/pages/chatbot.html" class="nav-link">챗봇</a>
                    <a href="/pages/community.html" class="nav-link">커뮤니티</a>
                    <a href="/pages/team.html" class="nav-link">팀 소개</a>
                    
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
    `;
  
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
  
    // 로그아웃 버튼 이벤트 리스너 추가
    if (isLoggedIn) {
        document.querySelector(".logout-btn").addEventListener("click", handleLogout);
    }
  }
  
  /**
   * 푸터 동적 생성
   */
  function renderFooter() {
    const footerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-section">
                    <a href="/" class="logo">A</a>
                    <div class="social-links">
                        <a href="#" class="social-link">📱</a>
                        <a href="#" class="social-link">📘</a>
                        <a href="#" class="social-link">📺</a>
                        <a href="#" class="social-link">💼</a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h3 class="footer-heading">팀 명 or 챗봇 이름</h3>
                    <p class="footer-text">내일배움캠프 AI 트랙 9기</p>
                    <p class="footer-text">admin@example.com</p>
                </div>
                
                <div class="footer-section">
                    <div class="footer-grid">
                        <div>
                            <h3 class="footer-heading">개인정보처리방침</h3>
                            <p class="footer-text">사이트 이용 약관</p>
                        </div>
                        <div>
                            <h3 class="footer-heading">Resources</h3>
                            <p class="footer-text">Blog</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    `;
  
    document.body.insertAdjacentHTML("beforeend", footerHTML);
  }
  
  /**
   * 로그아웃 처리
   */
  function handleLogout() {
    localStorage.removeItem("access_token");  // 액세스 토큰 삭제
    localStorage.removeItem("refresh_token"); // 리프레시 토큰 삭제
    alert("로그아웃 되었습니다.");
    window.location.href = "/"; // 메인 페이지로 이동
  }
