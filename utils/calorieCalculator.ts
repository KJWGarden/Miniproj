// utils/calorieCalculator.ts
import { UserInitialInfo } from "../services/authService";

// 활동 수준별 칼로리 계수
const ACTIVITY_CALORIE_FACTORS = {
  "운동을 거의 하지 않아요": 1.2,
  "일주일에 1~2회 운동해요": 1.375,
  "일주일에 3~5회 운동해요": 1.55,
  "일주일에 5~7회 운동해요": 1.725,
  "매일 고강도로 운동해요": 1.9,
} as const;

export type ActivityLevel = keyof typeof ACTIVITY_CALORIE_FACTORS;

/**
 * BMR (기초대사율) 계산
 * @param weight 체중 (kg)
 * @param height 키 (cm)
 * @param age 나이
 * @param gender 성별 ("남성" | "여성")
 * @returns BMR (kcal)
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: string
): number {
  if (gender === "남성") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * 권장 칼로리 계산
 * @param userInfo 사용자 초기 정보
 * @returns 권장 칼로리 (kcal)
 */
export function calculateRecommendedCalorie(userInfo: UserInitialInfo): number {
  const { gender, height, weight, age, activity_level } = userInfo;

  // BMR 계산
  const bmr = calculateBMR(weight, height, age, gender);

  // 활동 수준에 따른 칼로리 계수 가져오기
  const activityFactor =
    ACTIVITY_CALORIE_FACTORS[activity_level as ActivityLevel] || 1.2;

  // 권장 칼로리 계산 (BMR × 활동 계수)
  const recommendedCalorie = Math.round(bmr * activityFactor);

  return recommendedCalorie;
}

/**
 * 사용자 정보로부터 권장 칼로리 계산 (간편 함수)
 * @param gender 성별
 * @param height 키 (cm)
 * @param weight 체중 (kg)
 * @param age 나이
 * @param activityLevel 활동 수준
 * @returns 권장 칼로리 (kcal)
 */
export function getRecommendedCalorie(
  gender: string,
  height: number,
  weight: number,
  age: number,
  activityLevel: string
): number {
  // BMR 계산
  const bmr = calculateBMR(weight, height, age, gender);

  // 활동 수준에 따른 칼로리 계수 가져오기
  const activityFactor =
    ACTIVITY_CALORIE_FACTORS[activityLevel as ActivityLevel] || 1.2;

  return Math.round(bmr * activityFactor);
}
