document.addEventListener("DOMContentLoaded", () => {
    // 챗봇 메시지 자동 타이핑 효과 - 속도 빠르게 조정
    const chatMessages = document.querySelectorAll(".chat-message")
  
    function showMessagesSequentially(index = 0) {
      if (index >= chatMessages.length) return
  
      setTimeout(() => {
        chatMessages[index].style.opacity = "1"
        showMessagesSequentially(index + 1)
      }, 300) // 800ms에서 300ms로 속도 향상
    }
  
    // 초기에 모든 메시지 숨기기
    chatMessages.forEach((message) => {
      message.style.opacity = "0"
      message.style.transition = "opacity 0.3s ease" // 0.5s에서 0.3s로 변경
    })
  
    // 순차적으로 메시지 표시 - 더 빠르게 시작
    setTimeout(() => {
      showMessagesSequentially()
    }, 200) // 500ms에서 200ms로 변경
  
    // 스크롤 애니메이션 (기존 코드 유지)
    const animateElements = document.querySelectorAll(".feature-card, .step-card, .example-card")
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )
  
    animateElements.forEach((element) => {
      observer.observe(element)
    })
  })
  
  