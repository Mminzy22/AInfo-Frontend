window.appConfig = {
  API_BASE_URL: 'https://ainfo.ai.kr/api/v1',
  KAKAO_JS_KEY: '9adff27836e6c6b06d0d8d0be162499c',
  GOOGLE_CLIENT_ID: '122302989616-m25io7i9vm55ko2h5nkkvs2caavbq4rt.apps.googleusercontent.com',
  WSURL: 'wss://ainfo.ai.kr/ws/chat/',
  STOREID: 'store-de12e4d1-883c-4468-8c01-f083e8e555e7',
  CHANNELKEY_KAKAO: 'channel-key-ebb0bd3c-8d87-40c2-afe1-5bf0f441234b',
  CHANNELKEY_TOSS: 'channel-key-870ddbf1-a4cf-416b-9b22-262f16815807',
  CHANNELKEY_KG: 'channel-key-6096dc3a-9a51-4590-8d5b-6f7028b327b7',
};

window.axiosInstance = axios.create({
  baseURL: window.appConfig.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
