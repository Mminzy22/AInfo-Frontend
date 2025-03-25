/* global PortOne */  // 
// KG 이니시스
document.getElementById('portone-btn').addEventListener('click', async function() {
  // PortOne이 로드되었는지 확인
  if (typeof PortOne === 'undefined') {
    console.error('PortOne SDK가 로드되지 않았습니다.');
    alert('결제 시스템이 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
    return;
  }

  let storeId = window.appConfig.STOREID;
  let channelKey_kg = window.appConfig.CHANNELKEY_KG;


  function connectPayment() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('토큰 없음, 결제페이지 연결 불가');
      alert('로그인이 필요합니다.');
    
      localStorage.setItem('redirect_after_login', window.location.href);
    
      window.location.href = 'login.html';
      return;
    }
  }
  connectPayment();


  // 결제 요청 정보
  const paymentData = {
    storeId: storeId, // 상점 ID
    channelKey: channelKey_kg, // 채널 키
    paymentId: `pid-${crypto.randomUUID()}`, // 고유 결제 ID
    orderId: `order-${crypto.randomUUID()}`, // 주문 ID
    orderName: 'AInfo 서비스 구독', // 주문 이름
    totalAmount: 1000, // 결제 금액 (1000원)
    currency: 'CURRENCY_KRW', // 통화 (KRW)
    payMethod: 'CARD', // 결제 방법 (간편 결제, 카카오페이)
    customer: {
      email: 'test@test.com',
      phoneNumber: '010-0000-1234',
      fullName: '점미다',
    }
  };


  try {
    // 결제 요청
    const response = await PortOne.requestPayment(paymentData);
    // 결제 성공 시 처리
    if (response && response.paymentId && response.code != 'FAILURE_TYPE_PG') {
      console.log('response:', response);
      alert('결제가 성공적으로 완료되었습니다.');
    } else {
      alert('결제 요청에 실패했습니다. ' + response.message);
      console.log('response:', response);
    }
  } catch (error) {
    console.error('결제 요청 실패:', error);
    alert('결제 실패: ' + error.message);
  }
});