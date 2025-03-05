// API 기본 설정 (config.js에서 설정한 axios 인스턴스 사용)
const axiosInstance = window.axiosInstance;

// 회원가입 요청
export async function signup(userData) {
    try {
        const response = await axiosInstance.post("/accounts/signup/", userData);
        return response.data;
    } catch (error) {
        console.error("회원가입 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "회원가입 실패. 다시 시도하세요.");
    }
}

// 로그인 요청
export async function login(credentials) {
    try {
        const response = await axiosInstance.post("/accounts/login/", credentials);
        const { access, refresh } = response.data;

        // JWT 토큰을 로컬 스토리지에 저장
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        return response.data;
    } catch (error) {
        console.error("로그인 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "로그인 실패. 다시 시도하세요.");
    }
}

// 로그아웃 요청
export async function logout() {
    try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (!refresh_token) throw new Error("리프레시 토큰이 없습니다.");

        await axiosInstance.post("/accounts/logout/", { refresh_token });

        // 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return { message: "로그아웃되었습니다." };
    } catch (error) {
        console.error("로그아웃 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "로그아웃 실패. 다시 시도하세요.");
    }
}

// 현재 로그인 상태 확인
export function isLoggedIn() {
    return localStorage.getItem("access_token") !== null;
}

// 인증 헤더 자동 추가 (JWT 포함)
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 프로필 조회 (GET /api/v1/accounts/profile/)
export async function getUserProfile() {
    try {
        const response = await axiosInstance.get("/accounts/profile/");
        return response.data;
    } catch (error) {
        console.error("프로필 조회 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "프로필 조회 실패. 다시 시도하세요.");
    }
}

// 프로필 수정 (PUT /api/v1/accounts/profile/)
export async function updateUserProfile(updatedData) {
    try {
        const response = await axiosInstance.put("/accounts/profile/", updatedData);
        return response.data;
    } catch (error) {
        console.error("프로필 수정 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "프로필 수정 실패. 다시 시도하세요.");
    }
}

// 관심 분야 목록 조회 (GET /api/v1/accounts/interests/)
export async function getInterests() {
    try {
        const response = await axiosInstance.get("/accounts/interests/");
        return response.data;
    } catch (error) {
        console.error("관심 분야 목록 조회 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "관심 분야 목록 조회 실패. 다시 시도하세요.");
    }
}

// 최종 학력 목록 조회 (GET /api/v1/accounts/education-levels/)
export async function getEducationLevels() {
    try {
        const response = await axiosInstance.get("/accounts/education-levels/");
        return response.data;
    } catch (error) {
        console.error("최종 학력 목록 조회 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "최종 학력 목록 조회 실패. 다시 시도하세요.");
    }
}

// 현재 상태 목록 조회 (GET /api/v1/accounts/current-statuses/)
export async function getCurrentStatuses() {
    try {
        const response = await axiosInstance.get("/accounts/current-statuses/");
        return response.data;
    } catch (error) {
        console.error("현재 상태 목록 조회 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "현재 상태 목록 조회 실패. 다시 시도하세요.");
    }
}

// 지역 목록 조회 (GET /api/v1/accounts/subregions/)
export async function getSubRegions() {
    try {
        const response = await axiosInstance.get("/accounts/subregions/");
        return response.data;
    } catch (error) {
        console.error("지역 목록 조회 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "지역 목록 조회 실패. 다시 시도하세요.");
    }
}
