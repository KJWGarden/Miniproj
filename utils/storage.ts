// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserInitialInfo } from "../services/authService";

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
      const token = await AsyncStorage.getItem("authToken");
      return token;
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

  // 사용자 초기 정보 저장
  static async setUserInitialInfo(
    userInitialInfo: UserInitialInfo
  ): Promise<void> {
    try {
      // null이나 undefined 값 체크
      if (!userInitialInfo) {
        console.warn("사용자 초기 정보가 null 또는 undefined입니다.");
        return;
      }

      await AsyncStorage.setItem(
        "userInitialInfo",
        JSON.stringify(userInitialInfo)
      );
    } catch (error) {
      console.error("사용자 초기 정보 저장 실패:", error);
    }
  }

  // 사용자 초기 정보 가져오기
  static async getUserInitialInfo(): Promise<UserInitialInfo | null> {
    try {
      const userInitialInfo = await AsyncStorage.getItem("userInitialInfo");
      return userInitialInfo ? JSON.parse(userInitialInfo) : null;
    } catch (error) {
      console.error("사용자 초기 정보 가져오기 실패:", error);
      return null;
    }
  }

  // 설문 완료 여부 저장
  static async setSurveyCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem("surveyCompleted", JSON.stringify(completed));
    } catch (error) {
      console.error("설문 완료 상태 저장 실패:", error);
    }
  }

  // 설문 완료 여부 확인
  static async getSurveyCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem("surveyCompleted");
      return completed ? JSON.parse(completed) : false;
    } catch (error) {
      console.error("설문 완료 상태 확인 실패:", error);
      return false;
    }
  }

  // 사용자 음식 데이터 저장
  static async setUserEatData(userEatData: any): Promise<void> {
    try {
      await AsyncStorage.setItem("userEatData", JSON.stringify(userEatData));
    } catch (error) {
      console.error("사용자 음식 데이터 저장 실패:", error);
    }
  }

  // 사용자 음식 데이터 가져오기
  static async getUserEatData(): Promise<any | null> {
    try {
      const userEatData = await AsyncStorage.getItem("userEatData");
      return userEatData ? JSON.parse(userEatData) : null;
    } catch (error) {
      console.error("사용자 음식 데이터 가져오기 실패:", error);
      return null;
    }
  }

  // 식단 추천 데이터 저장
  static async setDietRecommendations(recommendations: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "dietRecommendations",
        JSON.stringify(recommendations)
      );
    } catch (error) {
      console.error("식단 추천 데이터 저장 실패:", error);
    }
  }

  // 식단 추천 데이터 가져오기
  static async getDietRecommendations(): Promise<any[] | null> {
    try {
      const data = await AsyncStorage.getItem("dietRecommendations");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("식단 추천 데이터 가져오기 실패:", error);
      return null;
    }
  }

  // 식단 추천 데이터 삭제
  static async removeDietRecommendations(): Promise<void> {
    try {
      await AsyncStorage.removeItem("dietRecommendations");
    } catch (error) {
      console.error("식단 추천 데이터 삭제 실패:", error);
    }
  }

  // 로그아웃 (모든 데이터 삭제)
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        "authToken",
        "users",
        "userInitialInfo",
        "surveyCompleted",
        "dietRecommendations",
      ]);
    } catch (error) {
      console.error("데이터 삭제 실패:", error);
    }
  }
}
