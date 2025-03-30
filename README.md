## 💡 아이디어, 기획

### *“정책은 있는데, 정보는 어디 있나요?”*

> 1만 개가 넘는 지원 정책, 나에게 맞는 정책은 어디에 있을까요?
> 
> 
> 정부와 공공기관은 방대한 지원 정책과 복지 서비스를 제공하고 있지만,
> 
> 정작 필요한 정보를 찾는 과정은 복잡하고 어렵습니다.
> 

### ***“정보를 몰라 기회를 놓치지 않도록.”***

> 공공서비스 정보 탐색의 복잡함을 줄이고, 누구나 필요한 지원을 빠르게 찾을 수 있도록 돕는 AI 챗봇 서비스를 개발했습니다.
> 
- AI 챗봇을 통한 대화형 탐색.
- 나이, 지역, 관심 분야 기반의 맞춤형 추천 및 필터링.
- 유사 정책 비교로 전략적인 선택까지!

**AInfo**는 국민취업지원제도를 몰라 지원 받지 못했던 **우리의 경험**에서 시작했습니다.

우리의 불편이 더 많은 사람에게 **도움이 되는 정보**로 이어지길 바랍니다.

---

## 📝 프로젝트 개요

AInfo는 맞춤형 공공서비스 추천 AI 챗봇입니다. Django Rest Framework(DRF)를 기반으로 API를 제공하며, AI 모델과 연동하여 실시간으로 사용자의 질의에 응답합니다.

---

| 📆 개발 기간 | 🙋🏻‍♂️ 팀원 | 📜 SA 문서 |
| --- | --- | --- |
| 25.2.27 ~ 25.3.31 | [양주영](https://github.com/JuyoungYang), [박민지](https://github.com/Mminzy22), [유종열](https://github.com/jongyeol2), [채희경](https://github.com/cheaheekyung), [정지웅](https://github.com/JaceJung-dev) |  [SA 문서 바로가기](https://www.notion.so/Fourtato-19faf76d38e280cd8ebbc140c6588adf?pvs=21) |

---

# 📚 서비스 소개

### 서비스 시연 영상

[영상]

### 서비스 아키텍처

---

### 🍟 팀원:

- **양주영(팀장)**
    - PDF 및 공공 API 데이터를 벡터 DB로 변환하고 저장하는 파이프라인 구축
    - LangChain + ChromaDB 기반 벡터 임베딩 및 컬렉션 구조 설계
    - 멀티 컬렉션 + 메타데이터 필터링이 가능한 커스텀 리트리버 시스템 구현
- **박민지(부팀장)**
    - JWT 기반 회원 기능 (가입, 로그인, 프로필)
    - 백엔드 EC2 배포, 프론트 S3 + CloudFront 배포
    - HTTPS 적용 (Route53 + ACM)
    - 뉴스 기반 검색 LangChain Agent 개발
    - CrewAI 활용한 Multi-Agent 개발
- **유종열(서기)**
    - WebSocket 기반 챗봇 구현
    - 도커를 활용한 애플리케이션 및 레디스 컨테이너화
    - SMTP서버 활용한 본인인증 메일 및 관리자페이지 공지메일 기능 구현
    - 회원 추가기능 구현
    - Celery 활용한 비동기 처리
    - PortOne 활용한 결제 기능 구현
    - Celery-Beat 활용한 VectorDB 데이터 로드 스케쥴링
- **채희경(서기)**
    - 정부 정책 특화 챗봇을 위한 시스템 프롬프트 설계 및 응답 포맷 구성 (MVP모델)
    - 사용자 질문 기반 문서 검색 및 LLM 응답 생성을 위한 LangChain 체인 구성 (MVP모델)
    - WebSocket 및 REST API 기반 챗룸 생성·조회·수정·삭제 기능 구현
    - 백엔드 애플리케이션 자동 배포를 위한 GitHub Actions 기반 CD 파이프라인 작성
    - 채팅방 목록, 메시지 출력 등 챗봇 프론트엔드 기능 개발
- **정지웅(총무)**
    - WebSocket 기반 챗봇 구현
    - WebSocket에서 JWT 인증 미들웨어 적용
    - 챗봇 메시지 스트리밍 기능 추가
    - Redis 세션 저장소, LangChain의 메모리 관리 기능를 활용한 요약 기반의 멀티턴 대화 시스템 구현
    - LangChain, OpenAI 기반 LLM과 규칙 기반 분류를 결합하여 사용자 의도를 분석하는 하이브리드 방식의 입력 분류기 구현
    - 사용자 입력 분류 유형에 따른 맞춤형 agent(RAG agent, 보고서 작성 agent)를 동적으로 호출하는 플로우 설계, 구현 및 RAG agent 구현

---

### 🐣 Release Version : 2.1.2

### 🔗 서비스 접속 : [https://www.ainfo.ai.kr](https://www.ainfo.ai.kr/)

### 🔗 연결 Backend repo: [AInfo-Backend](https://github.com/Mminzy22/AInfo-Backend)

---

## 🛠️ 기술 스택

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
│   ├── introduction.css → 소개 페이지 스타일
│   ├── signup.css
│   ├── profile.css
│   ├── profile_edit.css
│   ├── login.css
│   ├── payment.css
│   └── chatbot.css → 챗봇 페이지 스타일
│
├── scripts/ → JavaScript 파일
│   ├── main.js → 공통 JS
│   ├── api.js → API 호출 관련 JS
│   ├── chat-app.js → 챗봇 메인 애플리케이션 로직 및 모듈 간 통합 JS
│   ├── chat-renderer.js → 채팅 메시지 렌더링 담당 JS
│   ├── chat-sidebar.js → 챗봇 사이드바 담당 JS
│   ├── introduction.js 
│   ├── components.js
│   ├── signup.js
│   ├── login.js
│   ├── logout.js
│   ├── profile.js
│   ├── profile_edit.js
│   ├── payment.js
│   ├── utils.js → 유틸리티 함수
│   └── websocket-service.js → WebSocket 연결 및 통신 관리
│
├── config/ → 설정 관련 파일
│   └── config.js → API URL 등 환경 변수 설정
│
├── pages/ → HTML 페이지 파일
│   ├── chatbot.html → 챗봇 페이지
│   ├── profile.html → 프로필
│   ├── profile_edit.html → 프로필
│   ├── login.html → 로그인 페이지
│   ├── community.html
│   ├── payment.html → 결제 페이지
│   ├── signup.html → 회원가입 페이지
│   └── introduction.html → 소개 페이지
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── custom.md
│   │   └── feature_request.md
│   └── workflows/
│       ├── ci.yml → CI 관련 설정
│ 			└── cd.yml → CD 관련 설정
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
python -m vector_store.load_data
docker run --rm -p 6379:6379 --name redis-server redis
python manage.py runserver
```

백엔드 서버가 정상적으로 실행되었는지 확인합니다 (`http://127.0.0.1:8000`).

### 3. 프론트엔드 프로젝트 클론

```bash
git clone https://github.com/your-repo/AInfo-Frontend.git
cd AInfo-Frontend
```

### 4. 프론트엔드 API URL 설정 (`config/config.js` 작성)

```jsx
window.appConfig = {
    API_BASE_URL: "http://127.0.0.1:8000/api/v1",  // 기존 API 요청 (JWT 인증 등)
    KAKAO_JS_KEY: "your_key",  // 카카오 JavaScript 키 추가
    GOOGLE_CLIENT_ID: "your_key"  // 구글 Client ID 추가
    WSURL: "ws://127.0.0.1:8000/ws/chat/",
    STOREID: 'your_store',
    CHANNELKEY_KAKAO: 'your-channel-key',
    CHANNELKEY_TOSS: 'your-channel-key',
    CHANNELKEY_KG: 'your-channel-key',
};
  
  // Axios 전역 설정 (기존 REST API 요청)
window.axiosInstance = axios.create({
baseURL: window.appConfig.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
```

### 5. 로컬 서버 실행 (Live Server 활용)

- **VSCode Live Server 플러그인 사용**

---

## 📄 라이센스

이 프로젝트는 학습 목적으로 제작되었으며, 공개된 코드는 자유롭게 참고할 수 있습니다. 

단, 상업적 사용은 금지됩니다.
