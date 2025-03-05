import { 
    getUserProfile, 
    updateUserProfile, 
    getInterests, 
    getEducationLevels, 
    getCurrentStatuses, 
    getSubRegions 
} from "./api.js";

document.addEventListener("DOMContentLoaded", async function () {
    const profileForm = document.getElementById("profile-edit-form");
    const messageContainer = document.getElementById("message-container");

    try {
        // 1. 선택 목록(지역, 학력, 관심 분야 등) 먼저 로드
        await populateSelectOptions();

        // 2. 기존 프로필 정보 가져오기 → 필드 채우기
        const userData = await getUserProfile();
        populateProfileFields(userData);
    } catch (error) {
        showMessage("프로필 정보를 불러오는데 실패했습니다.", "error");
    }

    // 3. 폼 제출 시 API 호출 (프로필 수정)
    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = getFormData();
        console.log("프로필 수정 데이터:", formData);

        try {
            await updateUserProfile(formData);
            showMessage("프로필이 성공적으로 업데이트되었습니다.", "success");

            // 저장 성공 후 profile.html로 이동
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1500);
        } catch (error) {
            showMessage("프로필 업데이트 중 오류가 발생했습니다.", "error");
        }
    });

    // 4. "시/도" 선택 시 "시/군/구" 자동 변경
    document.getElementById("region").addEventListener("change", async function () {
        await updateSubRegionOptions();
    });
});

/**
 * 드롭다운 선택지 채우기 (지역, 학력, 상태 등)
 */
async function populateSelectOptions() {
    await loadRegions();
    await loadSubRegions();
    await loadDropdownOptions("current_status", getCurrentStatuses);
    await loadDropdownOptions("education_level", getEducationLevels);
    await loadInterestOptions();
}

/**
 * 프로필 데이터 입력 필드 채우기
 */
function populateProfileFields(user) {
    document.getElementById("email").value = user.email;
    document.getElementById("name").value = user.name || "";
    document.getElementById("birth_date").value = user.birth_date || "";

    // 지역 설정 (시/도 + 시/군/구)
    if (user.location) {
        document.getElementById("region").value = user.location.region.id;
        document.getElementById("subregion").value = user.location.id;
    }

    if (user.current_status) {
        document.getElementById("current_status").value = user.current_status.id;
    }

    if (user.education_level) {
        document.getElementById("education_level").value = user.education_level.id;
    }

    document.getElementById("marketing_agree").checked = user.marketing_agree;

    // 관심 분야 체크박스 설정
    setInterestCheckboxes(user.interests || []);
}

/**
 * 관심 분야 체크박스 목록 로드
 */
async function loadInterestOptions() {
    const interestsContainer = document.getElementById("interests-container");
    interestsContainer.innerHTML = "";

    try {
        const interests = await getInterests();
        interests.forEach(interest => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `interest_${interest.id}`;
            checkbox.name = "interests";
            checkbox.value = interest.id;

            const label = document.createElement("label");
            label.htmlFor = `interest_${interest.id}`;
            label.textContent = interest.name;

            const div = document.createElement("div");
            div.className = "checkbox-item";
            div.appendChild(checkbox);
            div.appendChild(label);

            interestsContainer.appendChild(div);
        });
    } catch (error) {
        showMessage("관심 분야 목록을 불러오는 중 오류가 발생했습니다.", "error");
    }
}

/**
 * 지역(시/도) 목록 로드
 */
async function loadRegions() {
    try {
        const regions = await getSubRegions();
        const regionSelect = document.getElementById("region");
        regionSelect.innerHTML = '<option value="">선택하세요</option>';

        const uniqueRegions = [...new Set(regions.map(region => region.region))];

        uniqueRegions.forEach(region => {
            const option = document.createElement("option");
            option.value = region.id;
            option.textContent = region.name;
            regionSelect.appendChild(option);
        });
    } catch (error) {
        showMessage("지역 목록을 불러오는 중 오류가 발생했습니다.", "error");
    }
}

/**
 * 시/군/구(하위 지역) 목록 로드
 */
async function loadSubRegions() {
    try {
        const subregions = await getSubRegions();
        updateSubRegionOptions(subregions);
    } catch (error) {
        showMessage("시/군/구 목록을 불러오는 중 오류가 발생했습니다.", "error");
    }
}

/**
 * "시/도" 선택 시 "시/군/구" 목록 업데이트
 */
async function updateSubRegionOptions() {
    const regionId = document.getElementById("region").value;
    const subregionSelect = document.getElementById("subregion");
    subregionSelect.innerHTML = '<option value="">선택하세요</option>';

    if (!regionId) return;

    try {
        const subregions = await getSubRegions();
        subregions
            .filter(subregion => subregion.region.id === parseInt(regionId))
            .forEach(subregion => {
                const option = document.createElement("option");
                option.value = subregion.id;
                option.textContent = subregion.name;
                subregionSelect.appendChild(option);
            });
    } catch (error) {
        showMessage("시/군/구 목록을 불러오는 중 오류가 발생했습니다.", "error");
    }
}

/**
 * 공통 함수: 드롭다운 옵션 로드
 */
async function loadDropdownOptions(elementId, apiFunction) {
    try {
        const data = await apiFunction();
        const selectElement = document.getElementById(elementId);
        selectElement.innerHTML = '<option value="">선택하세요</option>';

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            selectElement.appendChild(option);
        });
    } catch (error) {
        showMessage(`${elementId} 데이터를 불러오는 중 오류가 발생했습니다.`, "error");
    }
}

/**
 * 관심 분야 체크박스 설정
 */
function setInterestCheckboxes(selectedInterests) {
    const checkboxes = document.querySelectorAll("#interests-container input[name='interests']");
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectedInterests.some(interest => interest.id == checkbox.value);
    });
}

/**
 * 폼 데이터 가져오기
 */
function getFormData() {
    return {
        name: document.getElementById("name").value,
        birth_date: document.getElementById("birth_date").value,
        location: document.getElementById("subregion").value || null,
        current_status: document.getElementById("current_status").value || null,
        education_level: document.getElementById("education_level").value || null,
        marketing_agree: document.getElementById("marketing_agree").checked,
        interests: Array.from(document.querySelectorAll("#interests-container input[name='interests']:checked")).map(
            checkbox => checkbox.value
        ),
    };
}

/**
 * 메시지 표시
 */
function showMessage(message, type) {
    messageContainer.innerHTML = `<p class="message ${type}">${message}</p>`;
    messageContainer.style.display = "block";
}
