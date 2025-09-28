// utils/calorieCalculator.ts
import { UserInitialInfo } from "../services/authService";

// 활동 수준별 1kg당 칼로리 계수
const ACTIVITY_CALORIE_FACTORS = {
  "운동을 거의 하지 않아요": 25,
  "일주일에 1~2회 운동해요": 30,
  "일주일에 3~5회 운동해요": 33,
  "일주일에 5~7회 운동해요": 37,
  "매일 고강도로 운동해요": 40,
} as const;

export type ActivityLevel = keyof typeof ACTIVITY_CALORIE_FACTORS;

/**
 * 표준 체중 계산
 * @param height 키 (cm)
 * @param gender 성별 ("남자" | "여자")
 * @returns 표준 체중 (kg)
 */
export function calculateStandardWeight(
  height: number,
  gender: string
): number {
  const heightInMeters = height / 100; // cm를 m로 변환
  const factor = gender === "남자" ? 22 : 21;
  return heightInMeters * heightInMeters * factor;
}

/**
 * 권장 칼로리 계산
 * @param userInfo 사용자 초기 정보
 * @returns 권장 칼로리 (kcal)
 */
export function calculateRecommendedCalorie(userInfo: UserInitialInfo): number {
  const { gender, height, activity_level } = userInfo;

  // 표준 체중 계산
  const standardWeight = calculateStandardWeight(height, gender);

  // 활동 수준에 따른 칼로리 계수 가져오기
  const calorieFactor =
    ACTIVITY_CALORIE_FACTORS[activity_level as ActivityLevel] || 25;

  // 권장 칼로리 계산 (표준 체중 × 활동 계수)
  const recommendedCalorie = Math.round(standardWeight * calorieFactor);

  return recommendedCalorie;
}

/**
 * 사용자 정보로부터 권장 칼로리 계산 (간편 함수)
 * @param gender 성별
 * @param height 키 (cm)
 * @param activityLevel 활동 수준
 * @returns 권장 칼로리 (kcal)
 */
export function getRecommendedCalorie(
  gender: string,
  height: number,
  activityLevel: string
): number {
  const heightInMeters = height / 100;
  const factor = gender === "남자" ? 22 : 21;
  const standardWeight = heightInMeters * heightInMeters * factor;
  const calorieFactor =
    ACTIVITY_CALORIE_FACTORS[activityLevel as ActivityLevel] || 25;

  return Math.round(standardWeight * calorieFactor);
}
