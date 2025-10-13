// services/authService.ts
import { apiClient } from "../utils/api";

export interface LoginRequest {
  id: string;
  password: string;
}

export interface RegisterRequest {
  id: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  password_confirm: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// 사용자 초기 정보 타입
export interface EatLevel {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface UserInitialInfo {
  gender: string;
  age: number;
  height: number;
  weight: number;
  activity_level: string;
  goal: string;
  preferred_food: string;
  allergies: string[];
  eat_level: EatLevel;
}

export interface UserInitialInfoResponse {
  user_info: UserInitialInfo;
}

// 실제 서버 응답 타입 (임시)
export interface ServerUserDataResponse {
  gender: string;
  age?: number;
  user_age?: number | null;
  height: number;
  weight: number;
  activity_level: string;
  diet_goal: string | null;
  birth_date: string | null;
  created_at: string;
  email: string;
  hashed_password: string;
  user_id: string;
  user_name: string;
  user_no: number;
  preferred_food?: string;
  allergies?: string[];
  eat_level?: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface UserProfile {
  gender: string;
  age: number;
  height: number;
  weight: number;
}

// 설문 데이터 타입
export interface SurveyData {
  gender: string;
  age: number;
  height: number;
  weight: number;
  activity_level: string;
  eat_level: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface SurveyResponse {
  success: boolean;
  message?: string;
}

export interface UserProfileResponse {
  success: boolean;
  message?: string;
  data?: UserProfile;
}

export class AuthService {
  // 로그인
  async login(credentials: LoginRequest) {
    const { id, password } = credentials;
    const params = new URLSearchParams({
      id: id, // 서버가 id 필드를 요구하므로 email을 id로 사용
      password,
    });
    return await apiClient.post<AuthResponse>(
      `/users/login?${params.toString()}`,
      {} // 빈 body
    );
  }

  // 회원가입
  async register(userData: RegisterRequest) {
    const { id, email, username, phone, password, password_confirm } = userData;
    const params = new URLSearchParams({
      id,
      email,
      username,
      phone,
      password,
      password_confirm,
    });
    return await apiClient.post<AuthResponse>(
      `/users/signup?${params.toString()}`,
      {} // 빈 body
    );
  }

  // 로그아웃
  async logout(token: string) {
    return await apiClient.post("/auth/logout", { token });
  }

  // 사용자 초기 정보 가져오기
  async getUserInitialInfo(token: string) {
    return await apiClient.patch<ServerUserDataResponse>(
      "/users/inital/info",
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  }

  async getUserProfile(token: string) {
    return await apiClient.get<UserProfile>("/users/profile/info", {
      headers: {
        Authorization: `${token}`,
      },
    });
  }

  // 설문 데이터 전송 (users/initial/info 엔드포인트로 PATCH)
  async submitSurveyData(surveyData: SurveyData, token: string) {
    return await apiClient.patch<SurveyResponse>(
      "/users/inital/info",
      surveyData,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  }
}

export const authService = new AuthService();
