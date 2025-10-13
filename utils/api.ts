// utils/api.ts
import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl || "http://localhost:8000";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  headers?: {
    map: { [key: string]: string };
  };
}

// 먹은 음식 데이터 타입 (목록용)
export interface EatenFood {
  no: number;
  food_name?: string | null;
  image_url?: string | null;
  created_at: string;
}

// 먹은 음식 상세 데이터 타입
export interface EatenFoodDetail {
  no: number;
  food_name: string;
  image_url: string;
  created_at: string;
  calories: string;
  carbs_g: string;
  protein_g: string;
  fat_g: string;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // GET 요청
  async get<T>(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...options?.headers,
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers,
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
  async delete<T>(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...options?.headers,
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers,
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

// 음식 분석 관련 API 함수들
export const foodAnalysisApi = {
  // 음식 분석 (재료 및 레시피 정보)
  async analyzeFoodByName(
    foodName: string,
    token: string
  ): Promise<
    ApiResponse<{
      analyzed_foods: Array<{
        food_name: string;
        youtube_link: string;
        ingredients: string[];
        recipe: string[];
      }>;
    }>
  > {
    try {
      console.log("음식 분석 API 호출:", {
        url: `${API_BASE_URL}/api/analyze-foods`,
        foodName,
        token: token ? `${token.substring(0, 20)}...` : "토큰 없음",
      });

      const response = await fetch(`${API_BASE_URL}/api/analyze-foods/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify([{ food_name: foodName }]),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("API 응답 데이터:", data);
      return { success: true, data };
    } catch (error) {
      console.error("음식 분석 실패:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

// 이미지 생성 및 분석 관련 API 함수들
export const imageAnalysisApi = {
  // 이미지 생성
  async generateImages(
    imageUri: string,
    token: string,
    planJsonPath?: string
  ): Promise<ApiResponse<{ generated_image_url: string; image_id: string }>> {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: `captured_image_${Date.now()}.jpg`,
      } as any);

      // 쿼리 파라미터 추가
      const queryParams = new URLSearchParams();
      if (planJsonPath) {
        queryParams.append("plan_json_path", planJsonPath);
      }

      const url = `${API_BASE_URL}/api/generate-images${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("이미지 생성 실패:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // 음식 분석
  async analyzeFoods(
    generatedImageUrl: string,
    token: string
  ): Promise<
    ApiResponse<{
      food_name: string;
      calories: string;
      carbs_g: string;
      protein_g: string;
      fat_g: string;
      confidence: number;
    }>
  > {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-foods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify([{ image_url: generatedImageUrl }]), // 배열로 감싸서 전송
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("음식 분석 실패:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

// 이미지 업로드 관련 API 함수들
export const imageUploadApi = {
  // 이미지 업로드
  async uploadEatenFoodImage(
    imageUri: string,
    token: string
  ): Promise<ApiResponse<{ image_url: string; filename: string }>> {
    try {
      const formData = new FormData();
      formData.append("image_file", {
        uri: imageUri,
        type: "image/jpeg",
        name: `eaten_food_${Date.now()}.jpg`,
      } as any);

      const response = await fetch(`${API_BASE_URL}/users/eaten-food-image`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // 이미지 삭제
  async deleteEatenFoodImage(
    imageUrl: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      // POST 방식으로 삭제 요청 (일부 서버에서 사용)
      const response = await fetch(
        `${API_BASE_URL}/users/eaten-food-image/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image_url: imageUrl }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

// 먹은 음식 관련 API 함수들
export const eatenFoodApi = {
  // 특정 먹은 음식 정보 가져오기
  async getEatenFood(
    eatenFoodNo: number,
    token: string
  ): Promise<ApiResponse<EatenFoodDetail>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/eaten-foods/${eatenFoodNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("음식 상세 정보 가져오기 실패:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // 모든 먹은 음식 목록 가져오기
  async getEatenFoods(token: string): Promise<ApiResponse<EatenFood[]>> {
    try {
      const url = `${API_BASE_URL}/users/eaten-foods/today`;
      console.log("API 요청 URL:", url);
      console.log("API_BASE_URL:", API_BASE_URL);
      console.log("전체 URL 구성:", url);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // 토큰이 있을 때만 Authorization 헤더 추가
      if (token && token.trim() !== "") {
        headers.Authorization = token;
        console.log(
          "Authorization 헤더 추가됨:",
          token.substring(0, 20) + "..."
        );
      } else {
        console.log("토큰이 없어서 Authorization 헤더 생략");
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      console.log("API 응답 상태:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("API 오류 응답:", errorText);

        // 401 Unauthorized인 경우 빈 배열 반환
        if (response.status === 401) {
          console.log("인증되지 않음 - 빈 배열 반환");
          return { success: true, data: [] };
        }

        // 422 Validation Error인 경우도 빈 배열 반환 (라우팅 충돌 방지)
        if (response.status === 422) {
          console.log("라우팅 충돌 감지 - 빈 배열 반환");
          return { success: true, data: [] };
        }

        // 500 Internal Server Error인 경우 빈 배열 반환
        if (response.status === 500) {
          console.log("서버 내부 오류 감지 - 빈 배열 반환");
          return { success: true, data: [] };
        }

        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("API 성공 응답:", data);
      return { success: true, data };
    } catch (error) {
      console.error("음식 목록 가져오기 실패:", error);
      console.error("에러 타입:", typeof error);
      console.error("에러 상세:", error);

      // 네트워크 오류인 경우 빈 배열 반환
      if (
        error instanceof Error &&
        (error.message.includes("Network request failed") ||
          error.message.includes("timeout") ||
          error.message.includes("fetch"))
      ) {
        console.log("네트워크 오류 감지 - 빈 배열 반환");
        return { success: true, data: [] };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // 먹은 음식 추가
  async addEatenFood(
    foodData: Omit<EatenFood, "no" | "created_at">,
    token: string
  ): Promise<ApiResponse<EatenFood>> {
    return await apiClient.post<EatenFood>(`/users/eaten/foods/`, foodData, {
      headers: {
        Authorization: token,
      },
    });
  },

  // 먹은 음식 수정
  async updateEatenFood(
    eatenFoodNo: number,
    foodData: Partial<EatenFood>,
    token: string
  ): Promise<ApiResponse<EatenFood>> {
    return await apiClient.patch<EatenFood>(
      `/users/eaten/foods/${eatenFoodNo}`,
      foodData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  },

  // 먹은 음식 삭제
  async deleteEatenFood(
    eatenFoodNo: number,
    token: string
  ): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`/users/eaten/foods/${eatenFoodNo}`, {
      headers: {
        Authorization: token,
      },
    });
  },
};

// 식단 추천 API
export const dietRecommendationApi = {
  // 식단 추천 생성
  async generateRecommendation(token: string): Promise<
    ApiResponse<{
      success: boolean;
      message: string;
      saved_recommendations: Array<{
        food_name: string;
        image_url: string;
        recommendation_id: number;
      }>;
    }>
  > {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ai/generate-recommendation/food`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `식단 추천 API 오류 - 상태: ${response.status}, 메시지: ${errorText}`
        );

        // 500 오류인 경우 특별 처리
        if (response.status === 500) {
          console.log("서버 내부 오류 감지 - 기본 데이터 반환");
          return {
            success: false,
            error: `서버 오류: ${errorText}`,
          };
        }

        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("식단 추천 생성 실패:", error);

      // 네트워크 오류인 경우 특별 처리
      if (
        error instanceof Error &&
        (error.message.includes("Network request failed") ||
          error.message.includes("fetch") ||
          error.name === "TypeError")
      ) {
        console.log("식단 추천 네트워크 오류 감지");
        return {
          success: false,
          error: "Network request failed",
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

// 레시피 상세 API
export const recipeApi = {
  // 레시피 상세 정보 가져오기
  async getRecipeDetail(
    recommendationId: number,
    token: string
  ): Promise<
    ApiResponse<{
      recipe_name: string;
      cooking_method: string;
      recipe_video_link: string;
      ingredients: string[];
    }>
  > {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ai/recommendations/${recommendationId}/recipe`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `레시피 상세 API 오류 - 상태: ${response.status}, 메시지: ${errorText}`
        );

        // 404 오류인 경우 특별 처리 (레시피를 찾을 수 없음)
        if (response.status === 404) {
          console.log("레시피를 찾을 수 없음 - 404 오류");
          return {
            success: false,
            error: "Recipe not found",
          };
        }

        // 500 오류인 경우 특별 처리
        if (response.status === 500) {
          console.log("서버 내부 오류 감지 - 기본 데이터 반환");
          return {
            success: false,
            error: `서버 오류: ${errorText}`,
          };
        }

        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("레시피 상세 정보 가져오기 실패:", error);

      // 네트워크 오류인 경우 특별 처리
      if (
        error instanceof Error &&
        (error.message.includes("Network request failed") ||
          error.message.includes("fetch") ||
          error.name === "TypeError")
      ) {
        console.log("레시피 API 네트워크 오류 감지");
        return {
          success: false,
          error: "Network request failed",
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

// 밀키트 API
export const mealKitApi = {
  // 밀키트 상세 정보 가져오기
  async getMealKitDetail(
    recommendationId: number,
    token: string
  ): Promise<
    ApiResponse<{
      meal_kit_id: number;
      meal_kit_name: string;
      purchase_link: string;
      image_url: string;
      calories: number;
      carbs_g: number;
      protein_g: number;
      fat_g: number;
      recommendation_id: number;
    }>
  > {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ai/meal-kit/detail${recommendationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `밀키트 상세 API 오류 - 상태: ${response.status}, 메시지: ${errorText}`
        );

        // 404 오류인 경우 특별 처리 (밀키트를 찾을 수 없음)
        if (response.status === 404) {
          console.log("밀키트를 찾을 수 없음 - 404 오류");
          return {
            success: false,
            error: "Meal kit not found",
          };
        }

        // 500 오류인 경우 특별 처리
        if (response.status === 500) {
          console.log("서버 내부 오류 감지 - 기본 데이터 반환");
          return {
            success: false,
            error: `서버 오류: ${errorText}`,
          };
        }

        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("밀키트 상세 정보 가져오기 실패:", error);

      // 네트워크 오류인 경우 특별 처리
      if (
        error instanceof Error &&
        (error.message.includes("Network request failed") ||
          error.message.includes("fetch") ||
          error.name === "TypeError")
      ) {
        console.log("밀키트 API 네트워크 오류 감지");
        return {
          success: false,
          error: "Network request failed",
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // 밀키트 구매 링크 가져오기
  async getMealKitPurchaseLink(
    mealKitId: number,
    token: string
  ): Promise<
    ApiResponse<{
      purchase_link: string;
    }>
  > {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ai/meal-kit/purchase-link/${mealKitId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `밀키트 구매 링크 API 오류 - 상태: ${response.status}, 메시지: ${errorText}`
        );

        // 404 오류인 경우 특별 처리 (밀키트를 찾을 수 없음)
        if (response.status === 404) {
          console.log("밀키트 구매 링크를 찾을 수 없음 - 404 오류");
          return {
            success: false,
            error: "Purchase link not found",
          };
        }

        // 500 오류인 경우 특별 처리
        if (response.status === 500) {
          console.log("서버 내부 오류 감지 - 기본 데이터 반환");
          return {
            success: false,
            error: `서버 오류: ${errorText}`,
          };
        }

        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("밀키트 구매 링크 가져오기 실패:", error);

      // 네트워크 오류인 경우 특별 처리
      if (
        error instanceof Error &&
        (error.message.includes("Network request failed") ||
          error.message.includes("fetch") ||
          error.name === "TypeError")
      ) {
        console.log("밀키트 구매 링크 API 네트워크 오류 감지");
        return {
          success: false,
          error: "Network request failed",
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
