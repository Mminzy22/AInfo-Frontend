// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('AInfo 페이지가 로드되었습니다.');
    
    // 이미지 로드 오류 처리
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.onerror = function() {
        // 이미지 로드 실패 시 기본 이미지로 대체
        this.src = 'placeholder.png';
        console.log(`이미지 로드 실패: ${this.alt}`);
      };
    });
    
    // 추가 기능이 필요한 경우 여기에 구현
  });