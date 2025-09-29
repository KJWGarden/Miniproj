// utils/api.ts
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  headers?: {
    map: { [key: string]: string };
  };
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // POST 요청
  async post<T>(
    endpoint: string,
    body: any,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log("POST 요청 URL:", url);
      console.log("POST 요청 데이터:", body);

      const headers = {
        "Content-Type": "application/json",
        ...options?.headers,
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      console.log("POST 응답 상태:", response.status, response.statusText);
      console.log("POST 응답 헤더:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("POST 오류 응답:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      // 응답 타입에 따라 적절히 처리
      const contentType = response.headers.get("content-type");
      console.log("응답 Content-Type:", contentType);

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("POST 성공 응답 (JSON):", data);
      } else {
        const textData = await response.text();
        console.log("POST 성공 응답 (Text):", textData);
        // 텍스트 응답을 JSON 형태로 변환
        data = { message: textData };
      }

      return {
        success: true,
        data,
        headers: {
          map: Object.fromEntries(response.headers.entries()),
        },
      };
    } catch (error) {
      console.log("POST 요청 실패:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // PUT 요청
  async put<T>(
    endpoint: string,
    body: any,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...options?.headers,
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // PATCH 요청
  async patch<T>(
    endpoint: string,
    body: any,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        "Content-Type": "application/json",
        ...options?.headers,
      };

      // 디버깅을 위한 임시 로그
      console.log("PATCH 요청 URL:", url);
      console.log("PATCH 요청 헤더:", headers);
      console.log("PATCH 요청 데이터:", body);

      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      });

      console.log("PATCH 응답 상태:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("PATCH 오류 응답:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("PATCH 성공 응답:", data);
      return { success: true, data };
    } catch (error) {
      console.log("PATCH 요청 실패:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient();
