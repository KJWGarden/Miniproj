// services/authService.ts
import { apiClient } from "../utils/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
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
    const { name, username, email, phone, password, confirmPassword } =
      userData;
    const params = new URLSearchParams({
      id: email, // 서버가 id 필드를 요구하므로 email을 id로 사용
      name,
      username,
      email,
      phone,
      password,
      password_confirm: confirmPassword, // 서버가 요구하는 필드명
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
}

export const authService = new AuthService();
