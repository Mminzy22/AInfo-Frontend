// API 기본 설정 (config.js에서 설정한 axios 인스턴스 사용)
const axiosInstance = window.axiosInstance;

// 회원가입 요청
export async function signup(userData) {
  try {
    const response = await axiosInstance.post('/accounts/signup/', userData);
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error.response?.data || error.message);
    throw error;  // 전체 에러 객체 그대로
  }
}

// 로그인 요청
export async function login(credentials) {
  try {
    const response = await axiosInstance.post('/accounts/login/', credentials);
    const { access, refresh } = response.data;

    // JWT 토큰을 로컬 스토리지에 저장
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || '로그인 실패. 다시 시도하세요.');
  }
}

// 로그아웃 요청
window.logout = async function () {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) throw new Error('리프레시 토큰이 없습니다.');

    await axiosInstance.post('/accounts/logout/', { refresh_token });

    // 로컬 스토리지에서 토큰 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    return { message: '로그아웃되었습니다.' };
  } catch (error) {
    console.error('로그아웃 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '로그아웃 실패. 다시 시도하세요.');
  }
};

// 현재 로그인 상태 확인
export function isLoggedIn() {
  return localStorage.getItem('access_token') !== null;
}

// 인증 헤더 자동 추가 (JWT 포함)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 프로필 조회 (GET /api/v1/accounts/profile/)
export async function getUserProfile() {
  try {
    const response = await axiosInstance.get('/accounts/profile/');
    return response.data;
  } catch (error) {
    console.error('프로필 조회 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '프로필 조회 실패. 다시 시도하세요.');
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

    const response = await axiosInstance.put('/accounts/profile/', transformedData);
    return response.data;
  } catch (error) {
    console.error('프로필 수정 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '프로필 수정 실패. 다시 시도하세요.');
  }
}

// 관심 분야 목록 조회 (GET /api/v1/accounts/interests/)
export async function getInterests() {
  try {
    const response = await axiosInstance.get('/accounts/interests/');
    return response.data;
  } catch (error) {
    console.error('관심 분야 목록 조회 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '관심 분야 목록 조회 실패. 다시 시도하세요.');
  }
}

// 최종 학력 목록 조회 (GET /api/v1/accounts/education-levels/)
export async function getEducationLevels() {
  try {
    const response = await axiosInstance.get('/accounts/education-levels/');
    return response.data;
  } catch (error) {
    console.error('최종 학력 목록 조회 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '최종 학력 목록 조회 실패. 다시 시도하세요.');
  }
}

// 현재 상태 목록 조회 (GET /api/v1/accounts/current-statuses/)
export async function getCurrentStatuses() {
  try {
    const response = await axiosInstance.get('/accounts/current-statuses/');
    return response.data;
  } catch (error) {
    console.error('현재 상태 목록 조회 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '현재 상태 목록 조회 실패. 다시 시도하세요.');
  }
}

// 지역 목록 조회 (GET /api/v1/accounts/subregions/)
export async function getSubRegions() {
  try {
    const response = await axiosInstance.get('/accounts/subregions/');
    return response.data;
  } catch (error) {
    console.error('지역 목록 조회 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '지역 목록 조회 실패. 다시 시도하세요.');
  }
}

// 회원 탈퇴 요청 (DELETE /api/v1/accounts/delete/)
export async function deleteAccount() {
  try {
    const response = await axiosInstance.delete('/accounts/delete/');
        
    // 탈퇴 성공 시 로컬 스토리지 초기화
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    return { message: '회원 탈퇴가 완료되었습니다.' };
  } catch (error) {
    console.error('회원 탈퇴 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '회원 탈퇴 실패. 다시 시도하세요.');
  }
}

// 카카오 로그인 요청 (POST /accounts/kakao-login/)
export async function kakaoLogin(kakaoAccessToken) {
  try {
    const response = await axiosInstance.post('/accounts/kakao-login/', {
      access_token: kakaoAccessToken,
    });

    const { access, refresh, user } = response.data;

    // JWT 토큰 저장
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_email', user.email);

    return user; // 로그인한 사용자 정보 반환
  } catch (error) {
    console.error('카카오 로그인 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '카카오 로그인 실패. 다시 시도하세요.');
  }
}

// 구글 로그인 요청 (POST /accounts/google-login/)
export async function googleLogin(googleIdToken) {
  try {
    const response = await axiosInstance.post('/accounts/google-login/', {
      id_token: googleIdToken,
    });

    const { access, refresh, user } = response.data;

    // JWT 토큰 저장
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_email', user.email);

    return user; // 로그인한 사용자 정보 반환
  } catch (error) {
    console.error('구글 로그인 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '구글 로그인 실패. 다시 시도하세요.');
  }
}

// 새 access 토큰 발급
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // access 토큰이 만료되어 401 에러가 발생한 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry && // 무한루프 방지용 플래그
      localStorage.getItem('refresh_token')
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axiosInstance.post('/accounts/token/refresh/', {
          refresh: localStorage.getItem('refresh_token'),
        });

        const newAccessToken = refreshResponse.data.access;

        // 새 access 토큰 저장
        localStorage.setItem('access_token', newAccessToken);

        // 실패했던 요청에 새 토큰 설정 후 재요청
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh 토큰도 만료되었을 때 → 로그아웃 처리
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/pages/login.html'; // 로그인 페이지로 리디렉션
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// 비밀번호 찾기 요청 (POST /accounts/reset-password/)
export async function resetPassword(email) {
  try {
    const response = await axiosInstance.post('/accounts/reset-password/', { email });
    return response.data;
  } catch (error) {
    console.error('비밀번호 리셋 실패:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || '비밀번호 리셋 실패. 다시 시도하세요.');
  }
}

// 약관 동의 요청
export async function agreeToTerms() {
  try {
    const response = await axiosInstance.post('/accounts/agree-terms/',);

    return response.data;
  } catch (error) {
    console.error('약관 동의 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '약관 동의 실패. 다시 시도하세요.');
  }
}

/////////////////chatbot part
// ============ chatbot API ============

const API_BASE_URL = window.appConfig.API_BASE_URL;

// 채팅방 생성
export async function createChatRoom() {
  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.post(`${API_BASE_URL}/chatbot/room/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('채팅방 생성 실패:', error);
    throw error;
  }
}

// 채팅방 목록 조회
export async function getChatRoomList() {
  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.get(`${API_BASE_URL}/chatbot/room/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('채팅방 목록 조회 실패:', error);
    throw error;
  }
}

// 채팅 로그 조회
export async function getChatLogs(roomId) {
  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.get(`${API_BASE_URL}/chatbot/room/${roomId}/logs/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('채팅 로그 조회 실패:', error);
    throw error;
  }
}

// 채팅방 삭제
export async function deleteChatRoom(roomId) {
  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.delete(`${API_BASE_URL}/chatbot/room/${roomId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('채팅방 삭제 실패:', error);
    throw error;
  }
}

// 채팅방 이름 변경
export async function renameChatRoom(roomId, newTitle) {
  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.patch(`${API_BASE_URL}/chatbot/room/${roomId}/`, {
      title: newTitle,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('채팅방 이름 수정 실패:', error);
    throw error;
  }
}

// 결제 정보를 서버로 전송하는 함수
export async function sendPaymentData(paymentData) {
  try {
    const response = await axiosInstance.post('/payments/pay-verify/', {
      payment_id: paymentData.paymentId,
    });
    return response;
  } catch (error) {
    throw new Error('결제 요청 실패: ' + error.message);
  }
}

// 유저의 크레딧 수를 조회하는 함수
export async function fetchCreditCount() {
  try {
    const response = await axiosInstance.get('/accounts/credit/');
    const credit = Number(response.data.credit); // int 지정
    const formatted = credit.toLocaleString(); // 1,000 단위마다 콤마 찍기
    return formatted; 
  } catch (error) {
    console.error('크레딧 조회 실패:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || '크레딧 조회에 실패했습니다.');
  }
}
