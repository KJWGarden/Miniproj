// utils/testConnection.ts
import { apiClient } from "./api";

export const testServerConnection = async () => {
  try {
    console.log("서버 연결 테스트 시작...");

    // 간단한 헬스 체크 요청
    const response = await apiClient.get("/health");

    if (response.success) {
      console.log("✅ 서버 연결 성공:", response.data);
      return { success: true, message: "서버 연결 성공" };
    } else {
      console.log("❌ 서버 연결 실패:", response.error);
      return { success: false, message: response.error || "서버 연결 실패" };
    }
  } catch (error) {
    console.log("❌ 네트워크 오류:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "네트워크 오류",
    };
  }
};

// 로그인 테스트 함수
export const testLogin = async (email: string, password: string) => {
  try {
    console.log("로그인 테스트 시작...");

    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });

    if (response.success) {
      console.log("✅ 로그인 성공:", response.data);
      return { success: true, data: response.data };
    } else {
      console.log("❌ 로그인 실패:", response.error);
      return { success: false, error: response.error };
    }
  } catch (error) {
    console.log("❌ 로그인 오류:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "로그인 오류",
    };
  }
};

// 회원가입 테스트 함수
export const testRegister = async (userData: any) => {
  try {
    console.log("회원가입 테스트 시작...");

    const response = await apiClient.post("/auth/register", userData);

    if (response.success) {
      console.log("✅ 회원가입 성공:", response.data);
      return { success: true, data: response.data };
    } else {
      console.log("❌ 회원가입 실패:", response.error);
      return { success: false, error: response.error };
    }
  } catch (error) {
    console.log("❌ 회원가입 오류:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "회원가입 오류",
    };
  }
};
