import { getUserProfile, deleteAccount } from './api.js';

document.addEventListener('DOMContentLoaded', function () {
  loadUserProfile();

  /**
     * 프로필 정보 가져오기 & 화면에 표시
     */
  async function loadUserProfile() {
    try {
      const userData = await getUserProfile(); // API에서 프로필 데이터 가져오기
      populateProfileData(userData);
    } catch (error) {
      console.error('프로필 로드 오류:', error);
      showMessage('프로필 정보를 불러오는 중 오류가 발생했습니다.', 'error');
    }
  }

  /**
     * 프로필 데이터를 HTML 요소에 채우기
     */
  function populateProfileData(user) {
    setTextContent('email', user.email);
    setTextContent('name', user.name);
    setTextContent('birth_date', user.birth_date ? formatDate(user.birth_date) : '설정되지 않음');

    // ✅ 지역 정보 수정: region은 문자열이므로 그대로 출력
    if (user.location) {
      setTextContent('location', `${user.location.region} ${user.location.name}`);
    } else {
      setTextContent('location', '설정되지 않음');
    }

    setTextContent('current_status', user.current_status ? user.current_status.name : '설정되지 않음');
    setTextContent('education_level', user.education_level ? user.education_level.name : '설정되지 않음');

    setMarketingAgreement(user.marketing_agree);
    displayInterests(user.interests);
  }

  /**
     * 특정 요소에 텍스트 설정
     */
  function setTextContent(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value;
    }
  }

  /**
     * 마케팅 동의 여부 설정
     */
  function setMarketingAgreement(agree) {
    setTextContent('marketing_agree', agree ? '동의함' : '동의하지 않음');
  }

  /**
     * 관심 분야 태그 표시
     */
  function displayInterests(interests) {
    const interestsContainer = document.getElementById('interests');
    interestsContainer.innerHTML = '';

    if (!interests || interests.length === 0) {
      const emptyElement = document.createElement('div');
      emptyElement.textContent = '설정된 관심 분야가 없습니다.';
      emptyElement.classList.add('empty-value');
      interestsContainer.appendChild(emptyElement);
      return;
    }

    interests.forEach(interest => {
      const tagElement = document.createElement('div');
      tagElement.className = 'interest-tag';
      tagElement.textContent = interest.name;
      interestsContainer.appendChild(tagElement);
    });
  }

  /**
     * 날짜 포맷팅 함수 (YYYY-MM-DD → YYYY년 MM월 DD일)
     */
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    } catch (e) {
      return dateString;
    }
  }

  /**
     * 오류 메시지 표시
     */
  function showMessage(message, type) {
    alert(message);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // 회원 탈퇴 모달 관련 요소 가져오기
  const withdrawalModal = document.getElementById('withdrawalModal');
  const withdrawalBtn = document.getElementById('withdrawalBtn');
  const cancelWithdrawal = document.getElementById('cancelWithdrawal');
  const confirmWithdrawal = document.getElementById('confirmWithdrawal');

  // 회원 탈퇴 버튼 클릭 시 모달 표시
  withdrawalBtn.addEventListener('click', () => {
    withdrawalModal.classList.add('show');
  });

  // 취소 버튼 클릭 시 모달 닫기
  cancelWithdrawal.addEventListener('click', () => {
    withdrawalModal.classList.remove('show');
  });

  // 모달 외부 클릭 시 닫기
  withdrawalModal.addEventListener('click', (event) => {
    if (event.target === withdrawalModal) {
      withdrawalModal.classList.remove('show');
    }
  });

  // 회원 탈퇴 확인 버튼 클릭 시 API 호출
  confirmWithdrawal.addEventListener('click', async () => {
    try {
      await deleteAccount();

      alert('회원 탈퇴가 완료되었습니다.');
      window.location.href = '/'; // 메인 페이지로 이동
    } catch (error) {
      console.error('회원 탈퇴 중 오류가 발생했습니다:', error);
      alert('회원 탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      withdrawalModal.classList.remove('show');
    }
  });
});
