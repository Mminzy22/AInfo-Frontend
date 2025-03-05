import { getUserProfile } from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
    loadUserProfile();

    /**
     * 프로필 정보 가져오기 & 화면에 표시
     */
    async function loadUserProfile() {
        try {
            const userData = await getUserProfile(); // API에서 프로필 데이터 가져오기
            populateProfileData(userData);
        } catch (error) {
            console.error("프로필 로드 오류:", error);
            showMessage("프로필 정보를 불러오는 중 오류가 발생했습니다.", "error");
        }
    }

    /**
     * 프로필 데이터를 HTML 요소에 채우기
     */
    function populateProfileData(user) {
        setTextContent("email", user.email);
        setTextContent("name", user.name);
        setTextContent("birth_date", user.birth_date ? formatDate(user.birth_date) : "설정되지 않음");

        if (user.location && user.location.region) {
            setTextContent("location", `${user.location.region.name} ${user.location.name}`);
        } else {
            setTextContent("location", "설정되지 않음");
        }

        setTextContent("current_status", user.current_status ? user.current_status.name : "설정되지 않음");
        setTextContent("education_level", user.education_level ? user.education_level.name : "설정되지 않음");

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
        setTextContent("marketing_agree", agree ? "동의함" : "동의하지 않음");
    }

    /**
     * 관심 분야 태그 표시
     */
    function displayInterests(interests) {
        const interestsContainer = document.getElementById("interests");
        interestsContainer.innerHTML = "";

        if (!interests || interests.length === 0) {
            const emptyElement = document.createElement("div");
            emptyElement.textContent = "설정된 관심 분야가 없습니다.";
            emptyElement.classList.add("empty-value");
            interestsContainer.appendChild(emptyElement);
            return;
        }

        interests.forEach(interest => {
            const tagElement = document.createElement("div");
            tagElement.className = "interest-tag";
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
