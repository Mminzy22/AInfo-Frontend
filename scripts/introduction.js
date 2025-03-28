// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  console.log('AInfo 소개 페이지가 로드되었습니다.');

  // 애니메이션 효과 추가
  animateOnScroll();

  // 이미지 로드 오류 처리
  handleImageErrors();

  // 소스 카드 호버 효과
  initSourceCards();
});

// 스크롤 애니메이션
function animateOnScroll() {
  const storyCards = document.querySelectorAll('.story-card');
  const featureItems = document.querySelectorAll('.feature-item');
  const teamMembers = document.querySelectorAll('.team-member');

  // 관찰자 옵션
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  // 요소가 화면에 나타날 때 애니메이션 적용
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // 초기 스타일 설정 및 관찰자 등록
  storyCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });

  featureItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  teamMembers.forEach((member, index) => {
    member.style.opacity = '0';
    member.style.transform = 'translateY(30px)';
    member.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(member);
  });
}

// 이미지 로드 오류 처리
function handleImageErrors() {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    img.onerror = function () {
      // 이미지 로드 실패 시 기본 이미지로 대체
      this.src = '/placeholder.svg?height=200&width=200';
      console.log(`이미지 로드 실패: ${this.alt}`);
    };
  });
}

// 소스 카드 호버 효과
function initSourceCards() {
  const sourceCards = document.querySelectorAll('.source-card');

  sourceCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      const overlay = this.querySelector('.source-overlay');
      overlay.style.transform = 'translateY(0)';
    });

    card.addEventListener('mouseleave', function () {
      const overlay = this.querySelector('.source-overlay');
      overlay.style.transform = 'translateY(100%)';
    });
  });
}

