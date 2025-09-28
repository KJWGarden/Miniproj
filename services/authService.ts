// services/authService.ts
import { apiClient } from "../utils/api";

export interface LoginRequest {
  email: string;
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
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface UserInitialInfo {
  gender: string;
  age: number;
  height: number;
  weight: number;
  activity_level: string;
  goal: string;
  preferred_food: string[];
  allergies: string[];
  eat_level: EatLevel;
}

export interface UserInitialInfoResponse {
  user_info: UserInitialInfo;
}

export class AuthService {
  // 로그인
  async login(credentials: LoginRequest) {
    const { email, password } = credentials;
    const params = new URLSearchParams({
      id: email, // 서버가 id 필드를 요구하므로 email을 id로 사용
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
    return await apiClient.patch<UserInitialInfoResponse>(
      "/users/initial/info",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export const authService = new AuthService();
