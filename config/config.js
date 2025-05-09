window.appConfig = {
  API_BASE_URL: '${process.env.API_BASE_URL}',
  KAKAO_JS_KEY: '${process.env.KAKAO_JS_KEY}',
  GOOGLE_CLIENT_ID: '${process.env.GOOGLE_CLIENT_ID}',
  WSURL: '${process.env.WSURL}',
  STOREID: '${process.env.STOREID}',
  CHANNELKEY_KAKAO: '${process.env.CHANNELKEY_KAKAO}',
  CHANNELKEY_TOSS: '${process.env.CHANNELKEY_TOSS}',
  CHANNELKEY_KG: '${process.env.CHANNELKEY_KG}',
};
  
window.axiosInstance = axios.create({
  baseURL: window.appConfig.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
