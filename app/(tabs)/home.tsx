import { UserInitialInfo } from "@/services/authService";
import { eatenFoodApi, imageUploadApi } from "@/utils/api";
import { calculateRecommendedCalorie } from "@/utils/calorieCalculator";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { StorageService } from "../../utils/storage";
import Calorie from "../components/Calorie";
import CircularProgress from "../components/CircularProgress";
import InputCard from "../components/InputCard";
import NutritionalComposition from "../components/NutritionalComposition";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl || "http://localhost:8000";

export default function TabOneScreen() {
  const [data, setData] = useState([]);
  const [userInitialInfo, setUserInitialInfo] =
    useState<UserInitialInfo | null>(null);
  const [recommendedCalorie, setRecommendedCalorie] = useState(2000); // 기본값
  const [eatenCalorie, setEatenCalorie] = useState(0); // 기본값
  const [nutritionData, setNutritionData] = useState({
    carbs: { eaten: 0, recommended: 150 },
    protein: { eaten: 0, recommended: 150 },
    fat: { eaten: 0, recommended: 150 },
  });

  // 영양소 및 칼로리 데이터 계산 함수
  const calculateNutritionData = useCallback((foodData: any[]) => {
    const totals = foodData.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.value || 0),
        carbs: acc.carbs + (item.carbs_g || 0),
        protein: acc.protein + (item.protein_g || 0),
        fat: acc.fat + (item.fat_g || 0),
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0 }
    );

    // 칼로리 업데이트
    setEatenCalorie(totals.calories);

    // 영양소 데이터 업데이트
    setNutritionData({
      carbs: { eaten: totals.carbs, recommended: 150 },
      protein: { eaten: totals.protein, recommended: 150 },
      fat: { eaten: totals.fat, recommended: 150 },
    });

    console.log("칼로리 및 영양소 계산 완료:", totals);
  }, []);

  const loadUserEatData = useCallback(async () => {
    try {
      if (
        !StorageService ||
        typeof StorageService.getUserEatData !== "function"
      ) {
        console.error("StorageService.getUserEatData is not available");
        return;
      }
      const userEatData = await StorageService.getUserEatData();
      if (userEatData) {
        // 데이터 유효성 검사 및 기본값 설정
        const validatedData = userEatData.map((item: any) => ({
          index: item.index || 0,
          name: item.name || "음식명 없음",
          value: item.value || 0,
          image: item.image || "",
          dateTime:
            item.dateTime ||
            new Date().toISOString().slice(0, 16).replace("T", " "),
          eaten_food_no: item.eaten_food_no || item.no || null, // 서버 ID 추가
        }));
        setData(validatedData);
      }
    } catch (error) {
      console.error("사용자 음식 데이터 로드 실패:", error);
    }
  }, []);

  // 서버에서 먹은 음식 데이터 가져오기
  const loadServerEatenFoods = useCallback(async () => {
    try {
      const token = await StorageService.getAuthToken();
      console.log(
        "토큰 상태:",
        token ? `${token.substring(0, 20)}...` : "토큰 없음"
      );

      console.log("서버에서 먹은 음식 목록 가져오는 중...");
      console.log("요청 URL:", `${API_BASE_URL}/users/eaten-foods/today`);
      console.log(
        "토큰:",
        token ? `${token.substring(0, 20)}...` : "토큰 없음"
      );
      const listResponse = await eatenFoodApi.getEatenFoods(token || "");

      if (listResponse.success && listResponse.data) {
        console.log("서버에서 받은 음식 목록:", listResponse.data);

        // 각 음식의 상세 정보를 개별적으로 가져오기
        const detailedData = await Promise.all(
          listResponse.data.map(async (item: any, index: number) => {
            try {
              console.log(`음식 상세 정보 가져오는 중: ${item.no}`);
              const detailResponse = await eatenFoodApi.getEatenFood(
                item.no,
                token || ""
              );

              if (detailResponse.success && detailResponse.data) {
                const detailItem = detailResponse.data;
                return {
                  index: index + 1,
                  name: detailItem.food_name || "음식명 없음",
                  value: parseFloat(detailItem.calories) || 0,
                  image: detailItem.image_url || "",
                  dateTime: detailItem.created_at
                    ? new Date(detailItem.created_at)
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")
                    : new Date().toISOString().slice(0, 16).replace("T", " "),
                  eaten_food_no: detailItem.no || null,
                  // 상세 정보에서 영양소 정보 가져오기
                  carbs_g: parseFloat(detailItem.carbs_g) || 0,
                  protein_g: parseFloat(detailItem.protein_g) || 0,
                  fat_g: parseFloat(detailItem.fat_g) || 0,
                };
              } else {
                console.error(
                  `음식 상세 정보 가져오기 실패 (${item.no}):`,
                  detailResponse.error
                );
                // 기본 정보라도 반환
                return {
                  index: index + 1,
                  name: item.food_name || "음식명 없음",
                  value: 0,
                  image: item.image_url || "",
                  dateTime: item.created_at
                    ? new Date(item.created_at)
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")
                    : new Date().toISOString().slice(0, 16).replace("T", " "),
                  eaten_food_no: item.no || null,
                  carbs_g: 0,
                  protein_g: 0,
                  fat_g: 0,
                };
              }
            } catch (error) {
              console.error(
                `음식 상세 정보 가져오기 오류 (${item.no}):`,
                error
              );
              // 오류 시 기본 정보라도 반환
              return {
                index: index + 1,
                name: item.food_name || "음식명 없음",
                value: 0,
                image: item.image_url || "",
                dateTime: item.created_at
                  ? new Date(item.created_at)
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")
                  : new Date().toISOString().slice(0, 16).replace("T", " "),
                eaten_food_no: item.no || null,
                carbs_g: 0,
                protein_g: 0,
                fat_g: 0,
              };
            }
          })
        );

        // 서버 데이터만 사용
        setData(detailedData);
        await StorageService.setUserEatData(detailedData);

        // 영양소 데이터 계산
        calculateNutritionData(detailedData);

        console.log("서버 상세 데이터 로드 완료:", detailedData);
      } else {
        console.error("서버에서 음식 목록 가져오기 실패:", listResponse.error);
      }
    } catch (error) {
      console.error("서버 데이터 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    loadServerEatenFoods(); // 서버 데이터만 로드
  }, [loadServerEatenFoods]);

  // 사용자 정보 로드 및 권장 칼로리 설정 함수
  const loadUserInfoAndSetRecommendedCalorie = useCallback(async () => {
    try {
      const userInfo = await StorageService.getUserInitialInfo();
      if (userInfo) {
        // 사용자 정보 유효성 검사
        const isUserInfoValid =
          userInfo.age > 0 && userInfo.height > 0 && userInfo.weight > 0;

        if (!isUserInfoValid) {
          console.log(
            "❌ 홈 화면에서 사용자 정보 불완전 감지. 로그아웃 처리 중..."
          );
          Alert.alert(
            "오류",
            "사용자 정보가 불완전합니다. 다시 로그인해주세요."
          );
          // 홈 화면에서 로그인 페이지로 이동할 수는 없으므로 앱을 다시 시작해야 함
          return;
        }

        setUserInitialInfo(userInfo);
        const recommended = calculateRecommendedCalorie(userInfo);
        setRecommendedCalorie(recommended);
        console.log("✅ 사용자 정보:", userInfo);
        console.log("✅ 권장 칼로리:", recommended);
      } else {
        console.log("❌ 저장된 사용자 정보가 없습니다.");
        Alert.alert(
          "오류",
          "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요."
        );
        return;
      }
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
    }
  }, []);

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    loadUserInfoAndSetRecommendedCalorie();
  }, [loadUserInfoAndSetRecommendedCalorie]);

  // 화면이 포커스될 때마다 사용자 정보 다시 로드 (설문 완료 후나 다른 화면에서 돌아올 때)
  useFocusEffect(
    useCallback(() => {
      loadUserInfoAndSetRecommendedCalorie();
      // 서버 데이터 다시 로드
      loadServerEatenFoods();
    }, [loadUserInfoAndSetRecommendedCalorie, loadServerEatenFoods])
  );

  const handleDelete = async (index: number) => {
    try {
      // 삭제할 아이템 찾기
      const itemToDelete = data.find((item) => item.index === index);

      if (!itemToDelete) {
        console.log("삭제할 아이템을 찾을 수 없습니다.");
        return;
      }

      // 서버 데이터인지 확인 (eaten_food_no가 있는 경우)
      if (itemToDelete.eaten_food_no) {
        const token = await StorageService.getAuthToken();
        if (token) {
          console.log(
            "서버에서 음식 데이터 삭제 중:",
            itemToDelete.eaten_food_no
          );

          const response = await eatenFoodApi.deleteEatenFood(
            itemToDelete.eaten_food_no,
            token
          );

          if (response.success) {
            console.log("서버에서 음식 데이터 삭제 성공");
          } else {
            console.error("서버에서 음식 데이터 삭제 실패:", response.error);
            Alert.alert("오류", "서버에서 음식 데이터 삭제에 실패했습니다.");
            return;
          }
        } else {
          console.log("토큰이 없어서 서버 삭제를 건너뜁니다.");
        }
      }

      // 서버에 업로드된 이미지가 있는 경우 삭제
      if (itemToDelete.image && itemToDelete.image !== itemToDelete.uri) {
        const token = await StorageService.getAuthToken();
        if (token) {
          console.log("서버에서 이미지 삭제 중:", itemToDelete.image);

          const imageDeleteResponse = await imageUploadApi.deleteEatenFoodImage(
            itemToDelete.image,
            token
          );

          if (imageDeleteResponse.success) {
            console.log("서버에서 이미지 삭제 성공");
          } else {
            console.error(
              "서버에서 이미지 삭제 실패:",
              imageDeleteResponse.error
            );
            // 이미지 삭제 실패해도 음식 데이터는 삭제 진행
            Alert.alert(
              "경고",
              "서버에서 이미지 삭제에 실패했지만 음식 데이터는 삭제됩니다."
            );
          }
        } else {
          console.log("토큰이 없어서 서버 이미지 삭제를 건너뜁니다.");
        }
      }

      // 로컬 데이터에서 삭제
      setData((prevData) => {
        const updatedData = prevData.filter((item) => item.index !== index);

        // 영양소 데이터 재계산
        calculateNutritionData(updatedData);

        return updatedData;
      });

      // 로컬 스토리지에서도 삭제
      const updatedData = data.filter((item) => item.index !== index);
      await StorageService.setUserEatData(updatedData);

      console.log("음식 데이터가 삭제되었습니다:", itemToDelete);
    } catch (error) {
      console.error("음식 데이터 삭제 실패:", error);
      Alert.alert("오류", "음식 데이터 삭제에 실패했습니다.");
    }
  };

  const handleUpdate = (
    index: number,
    name: string,
    value: number,
    image?: string,
    dateTime?: string
  ) => {
    setData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.index === index
          ? {
              ...item,
              name,
              value,
              image: image || item.image,
              dateTime:
                dateTime ||
                item.dateTime ||
                new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : item
      );

      // 영양소 데이터 재계산
      calculateNutritionData(updatedData);

      return updatedData;
    });
  };

  // 남은 칼로리 계산
  const remainingCalorie = recommendedCalorie - eatenCalorie;

  // 진행률 계산 (0-100)
  const progress = Math.min(
    Math.max((eatenCalorie / recommendedCalorie) * 100, 0),
    100
  );
  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: "center", paddingBottom: 150 }}
      >
        <View className="flex-row items-center justify-center mt-8">
          <View className="items-center">
            <Calorie title="남은 칼로리" value={remainingCalorie} />
          </View>
          <View className="items-center">
            <CircularProgress
              progress={progress}
              size={150}
              strokeWidth={5}
              color="#10B981"
              eatCalorie={eatenCalorie}
            />
          </View>
          <View className="items-center">
            <Calorie title="권장칼로리" value={recommendedCalorie} />
          </View>
        </View>
        <View className="w-full flex justify-center items-center mt-4">
          <NutritionalComposition nutritionData={nutritionData} />
        </View>

        <View className="w-full flex justify-center items-center mt-4 gap-4">
          {data.map((item) => (
            <InputCard
              key={item.index}
              index={item.index}
              name={item.name}
              value={item.value}
              image={item.image}
              dateTime={item.dateTime}
              carbs_g={item.carbs_g}
              protein_g={item.protein_g}
              fat_g={item.fat_g}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
