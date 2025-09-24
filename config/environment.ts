// config/environment.ts
export const ENV = {
  // 개발 환경
  DEVELOPMENT: {
    API_BASE_URL: "http://localhost:3000/api",
    DEBUG: true,
  },

  // 프로덕션 환경
  PRODUCTION: {
    API_BASE_URL: "https://your-production-api.com/api",
    DEBUG: false,
  },

  // 현재 환경 (개발/프로덕션에 따라 변경)
  CURRENT: {
    API_BASE_URL: __DEV__
      ? "http://localhost:3000/api"
      : "https://your-production-api.com/api",
    DEBUG: __DEV__,
  },
};

export default ENV.CURRENT;
