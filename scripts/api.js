// API 기본 설정 (config.js에서 설정한 axios 인스턴스 사용)
const axiosInstance = window.axiosInstance;

// 회원가입 요청
export async function signup(userData) {
    try {
        const response = await axiosInstance.post("/accounts/signup/", userData);
        return response.data;
    } catch (error) {
        console.error("회원가입 실패:", error.response?.data || error.message);
        throw error;  // 전체 에러 객체 그대로
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
window.logout = async function () {
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
};

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
        const transformedData = {
            ...updatedData,
            interests_ids: updatedData.interests,  // ID 배열
            education_level_id: updatedData.education_level,  // ID 값 전송
            current_status_id: updatedData.current_status,  // ID 값 전송
            location_id: updatedData.location  // ID 값 전송
        };

        const response = await axiosInstance.put("/accounts/profile/", transformedData);
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

// 회원 탈퇴 요청 (DELETE /api/v1/accounts/delete/)
export async function deleteAccount() {
    try {
        const response = await axiosInstance.delete("/accounts/delete/");
        
        // 탈퇴 성공 시 로컬 스토리지 초기화
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        return { message: "회원 탈퇴가 완료되었습니다." };
    } catch (error) {
        console.error("회원 탈퇴 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "회원 탈퇴 실패. 다시 시도하세요.");
    }
}

// 카카오 로그인 요청 (POST /accounts/kakao-login/)
export async function kakaoLogin(kakaoAccessToken) {
    try {
        const response = await axiosInstance.post("/accounts/kakao-login/", {
            access_token: kakaoAccessToken,
        });

        const { access, refresh, user } = response.data;

        // JWT 토큰 저장
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user_email", user.email);

        return user; // 로그인한 사용자 정보 반환
    } catch (error) {
        console.error("카카오 로그인 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "카카오 로그인 실패. 다시 시도하세요.");
    }
}

// 구글 로그인 요청 (POST /accounts/google-login/)
export async function googleLogin(googleIdToken) {
    try {
        const response = await axiosInstance.post("/accounts/google-login/", {
            id_token: googleIdToken,
        });

        const { access, refresh, user } = response.data;

        // JWT 토큰 저장
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user_email", user.email);

        return user; // 로그인한 사용자 정보 반환
    } catch (error) {
        console.error("구글 로그인 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "구글 로그인 실패. 다시 시도하세요.");
    }
}
