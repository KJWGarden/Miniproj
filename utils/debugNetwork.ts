// utils/debugNetwork.ts
import { apiClient } from "./api";

export const debugNetworkRequest = async () => {
  console.log("=== 네트워크 디버깅 시작 ===");

  // 1. 기본 연결 테스트
  console.log("1. 기본 연결 테스트...");
  try {
    const response = await fetch("http://54.196.253.81:8000/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("기본 연결 응답:", response.status, response.statusText);
  } catch (error) {
    console.log("기본 연결 실패:", error);
  }

  // 2. HTTP vs HTTPS 테스트
  console.log("2. HTTP 연결 테스트...");
  try {
    const httpResponse = await fetch("http://54.196.253.81:8000/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      "HTTP 연결 응답:",
      httpResponse.status,
      httpResponse.statusText
    );
  } catch (error) {
    console.log("HTTP 연결 실패:", error);
  }

  // 3. API 클라이언트 테스트
  console.log("3. API 클라이언트 테스트...");
  try {
    const apiResponse = await apiClient.get("/health");
    console.log("API 클라이언트 응답:", apiResponse);
  } catch (error) {
    console.log("API 클라이언트 실패:", error);
  }

  // 4. 네트워크 상태 확인
  console.log("4. 네트워크 상태 확인...");
  console.log("현재 시간:", new Date().toISOString());
  console.log("User Agent:", navigator.userAgent || "React Native");

  console.log("=== 네트워크 디버깅 완료 ===");
};

// 간단한 연결 테스트 함수
export const testSimpleConnection = async () => {
  const urls = [
    "http://54.196.253.81:8000/",
    "http://54.196.253.81:8000/users/signup",
    "http://54.196.253.81:8000/users/login",
    "http://54.196.253.81:8000/health",
  ];

  for (const url of urls) {
    try {
      console.log(`테스트 중: ${url}`);
      const response = await fetch(url, {
        method: "GET",
        timeout: 10000, // 10초 타임아웃
      });
      console.log(`✅ 성공: ${url} - ${response.status}`);
    } catch (error) {
      console.log(`❌ 실패: ${url} - ${error}`);
    }
  }
};
