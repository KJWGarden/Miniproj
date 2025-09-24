// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageService {
  // 토큰 저장
  static async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem("authToken", token);
    } catch (error) {
      console.error("토큰 저장 실패:", error);
    }
  }

  // 토큰 가져오기
  static async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("토큰 가져오기 실패:", error);
      return null;
    }
  }

  // 토큰 삭제
  static async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem("authToken");
    } catch (error) {
      console.error("토큰 삭제 실패:", error);
    }
  }

  // 사용자 정보 저장
  static async setUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem("users", JSON.stringify(userData));
    } catch (error) {
      console.error("사용자 정보 저장 실패:", error);
    }
  }

  // 사용자 정보 가져오기
  static async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem("users");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
      return null;
    }
  }

  // 로그아웃 (모든 데이터 삭제)
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(["authToken", "users"]);
    } catch (error) {
      console.error("데이터 삭제 실패:", error);
    }
  }
}
