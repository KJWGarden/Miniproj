// utils/endpointTester.ts
export const testEndpoints = async () => {
  const baseUrl = "http://54.196.253.81:8000";
  const endpoints = [
    "/api/users/signup",
    "/api/users/login",
    "/users/signup",
    "/users/login",
    "/users/register",
    "/users/create",
    "/users/add",
    "/auth/register",
    "/auth/login",
    "/signup",
    "/login",
    "/register",
    "/api/auth/register",
    "/api/auth/login",
    "/api/signup",
    "/api/login",
    "/api/register",
  ];

  console.log("=== 엔드포인트 테스트 시작 ===");

  for (const endpoint of endpoints) {
    try {
      console.log(`테스트 중: ${baseUrl}${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: "data",
        }),
      });

      console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);

      if (response.status !== 404) {
        const responseText = await response.text();
        console.log(`응답 내용: ${responseText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error}`);
    }
  }

  console.log("=== 엔드포인트 테스트 완료 ===");
};
