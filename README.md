
## 📝 프로젝트 개요

AInfo는 맞춤형 공공서비스 추천 AI 챗봇입니다. Django Rest Framework(DRF)를 기반으로 API를 제공하며, AI 모델과 연동하여 실시간으로 사용자의 질의에 응답합니다.

### 📆 개발 기간: 2025년 2월 27일 ~ 2025년 3월 31일

### 🍟 팀원:

- **양주영(팀장)**
    - API 및 PDF 데이터의 ChromaDB 인덱싱 및 저장 로직 구현
    - 고급 검색을 위한 리트리버(Retriever) 시스템 구현
- **박민지(부팀장)**
    - JWT 기반 회원 기능 (가입, 로그인, 프로필)
    - 백엔드 EC2 배포, 프론트 S3 + CloudFront 배포
    - HTTPS 적용 (Route53 + ACM)
- **유종열(서기)**
    - WebSocket 기반 챗봇 구현
    - 도커를 활용한 애플리케이션 및 레디스 컨테이너화
    - 챗봇UI 및 프론트엔드 개발
- **채희경(서기)**
    - LLM 및 Prompt 작성
    - LangChain을 활용한 로직 구현
- **정지웅(총무)**
    - WebSocket 기반 챗봇 구현
    - WebSocket에서 JWT 인증 미들웨어 적용
    - 챗봇 메시지 스트리밍 기능 추가

### 🔗연결 Backend repo: [AInfo-Backend](https://github.com/Mminzy22/AInfo-Backend)

---

## 🛠️기술 스택

- **프론트엔드:** HTML, CSS, JavaScript
- **API 통신:** Axios
- **실시간 웹소켓:** WebSocket
- **배포:** AWS S3 + CloudFront

---

## 📂 프로젝트 구조

```
📂 AInfo-Frontend/ (프론트엔드 레포지토리)
│
├── assets/ → 정적 파일 (이미지, 폰트, 아이콘 등)
│   ├── images/ → 이미지 파일
│   ├── icons/ → SVG, PNG 아이콘
│   └── fonts/ → 웹 폰트 파일
│
├── styles/ → CSS 파일
│   ├── global.css → 전체 스타일
│   ├── header.css → 헤더 관련 스타일
│   ├── footer.css → 푸터 관련 스타일
│   ├── home.css → 홈 페이지 스타일
│   ├── signup.css
│   ├── profile.css
│   ├── profile_edit.css
│   ├── login.css
│   └── chatbot.css → 챗봇 페이지 스타일
│
├── scripts/ → JavaScript 파일
│   ├── main.js → 공통 JS
│   ├── api.js → API 호출 관련 JS
│   ├── chatbot.js → 챗봇 기능 JS
│   ├── components.js
│   ├── signup.js
│   ├── login.js
│   ├── logout.js
│   ├── profile.js
│   ├── profile_edit.js
│   └── utils.js → 유틸리티 함수
│
├── config/ → 설정 관련 파일
│   └── config.js → API URL 등 환경 변수 설정
│
├── pages/ → HTML 페이지 파일
│   ├── chatbot.html → 챗봇 페이지
│   ├── profile.html → 프로필
│   ├── profile_edit.html → 프로필
│   ├── login.html → 로그인 페이지
│   ├── team.html
│   ├── community.html
│   └── signup.html → 회원가입 페이지
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── custom.md
│   │   └── feature_request.md
│   └── workflows/
│       └── ci.yml
│
├── tests/ → 테스트 파일 (필요 시)
│   └── test.js → 기본 테스트 스크립트
│
├── .gitignore → Git에 포함하지 않을 파일
├── index.html → 메인 페이지
└── README.md → 프로젝트 설명
```

---

## 설치 및 실행 방법

### 1. 백엔드 및 프론트엔드 프로젝트 클론

```bash
git clone https://github.com/your-repo/AInfo-Backend.git
cd AInfo-Backend
```

`.env` 파일 작성은 [AInfo-Backend](https://github.com/Mminzy22/AInfo-Backend) 참고

### 2. 백엔드 실행 (Django)

```bash
pip install -r requirements.txt
python manage.py migrate
redis-server
python manage.py runserver
```

백엔드 서버가 정상적으로 실행되었는지 확인합니다 (`http://127.0.0.1:8000`).

### 3. 프론트엔드 프로젝트 클론

```bash
git clone https://github.com/your-repo/AInfo-Frontend.git
cd AInfo-Frontend
```

### 4. 백엔드 API URL 설정 (`config/config.js` 작성)

```jsx
window.appConfig = {
    API_BASE_URL: "http://127.0.0.1:8000/api/v1",  // 기존 API 요청 (JWT 인증 등)
    KAKAO_JS_KEY: "your_key",  // 카카오 JavaScript 키 추가
    GOOGLE_CLIENT_ID: "your_key"  // 구글 Client ID 추가
};

// Axios 전역 설정 (기존 REST API 요청)
window.axiosInstance = axios.create({
    baseURL: window.appConfig.API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});
```

### 5. 로컬 서버 실행 (Live Server 활용)

- **VSCode Live Server 플러그인 사용**

---

## 📄 라이센스

이 프로젝트는 학습 목적으로 제작되었으며, 공개된 코드는 자유롭게 참고할 수 있습니다. 

단, 상업적 사용은 금지됩니다.