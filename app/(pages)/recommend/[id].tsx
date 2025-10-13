import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { mealKitApi, recipeApi } from "../../../utils/api";
import { StorageService } from "../../../utils/storage";

export default function RecommendScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recipeData, setRecipeData] = useState<{
    recipe_name: string;
    cooking_method: string;
    recipe_video_link: string;
    ingredients: (string | { name: string; image_url?: string })[];
  } | null>(null);
  const [mealKitData, setMealKitData] = useState<{
    meal_kit_id: number;
    meal_kit_name: string;
    purchase_link: string;
    image_url: string;
    calories: number;
    carbs_g: number;
    protein_g: number;
    fat_g: number;
    recommendation_id: number;
  } | null>(null);

  // 레시피 상세 정보 로드
  const loadRecipeDetail = useCallback(async () => {
    try {
      setLoading(true);

      if (!id) {
        Alert.alert("오류", "레시피 ID가 없습니다.");
        router.back();
        return;
      }

      const token = await StorageService.getAuthToken();
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        router.back();
        return;
      }

      console.log("레시피 상세 정보 요청 중... ID:", id);
      const response = await recipeApi.getRecipeDetail(parseInt(id), token);

      if (response.success && response.data) {
        console.log("레시피 상세 정보 응답:", response.data);
        setRecipeData(response.data);
      } else {
        console.error("레시피 상세 정보 로드 실패:", response.error);

        // 404 오류인 경우 특별 처리
        if (response.error === "Recipe not found") {
          Alert.alert(
            "레시피 정보 없음",
            "해당 음식의 레시피 정보가 아직 준비되지 않았습니다.\n\n식단 추천을 다시 생성해보시겠습니까?",
            [
              { text: "나중에", style: "cancel" },
              {
                text: "돌아가기",
                style: "default",
                onPress: () => router.back(),
              },
            ]
          );
        } else {
          Alert.alert("오류", "레시피 정보를 불러오는데 실패했습니다.");
          router.back();
        }
      }
    } catch (error) {
      console.error("레시피 상세 정보 로드 오류:", error);

      // 404 오류인 경우 특별 처리
      if (error instanceof Error && error.message.includes("404")) {
        Alert.alert(
          "레시피 정보 없음",
          "해당 음식의 레시피 정보가 아직 준비되지 않았습니다.\n\n식단 추천을 다시 생성해보시겠습니까?",
          [
            { text: "나중에", style: "cancel" },
            {
              text: "돌아가기",
              style: "default",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert("오류", "레시피 정보를 불러오는데 실패했습니다.");
        router.back();
      }
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  // 밀키트 상세 정보 로드
  const loadMealKitDetail = useCallback(async () => {
    try {
      if (!id) {
        return;
      }

      const token = await StorageService.getAuthToken();
      if (!token) {
        return;
      }

      console.log("밀키트 상세 정보 요청 중... ID:", id);
      const response = await mealKitApi.getMealKitDetail(parseInt(id), token);

      if (response.success && response.data) {
        console.log("밀키트 상세 정보 응답:", response.data);
        setMealKitData(response.data);
      } else {
        console.log("밀키트 상세 정보 로드 실패:", response.error);
        // 밀키트가 없는 경우는 정상적인 상황이므로 오류 처리하지 않음
      }
    } catch (error) {
      console.error("밀키트 상세 정보 로드 오류:", error);
      // 밀키트가 없는 경우는 정상적인 상황이므로 오류 처리하지 않음
    }
  }, [id]);

  // 유튜브 링크 열기
  const handleVideoPress = useCallback(async () => {
    if (recipeData?.recipe_video_link) {
      try {
        await Linking.openURL(recipeData.recipe_video_link);
      } catch (error) {
        console.error("유튜브 링크 열기 실패:", error);
        Alert.alert("오류", "유튜브 링크를 열 수 없습니다.");
      }
    }
  }, [recipeData?.recipe_video_link]);

  // 밀키트 구매 링크 열기
  const handleMealKitPurchase = useCallback(async () => {
    if (!mealKitData?.meal_kit_id) {
      Alert.alert("오류", "밀키트 정보가 없습니다.");
      return;
    }

    try {
      const token = await StorageService.getAuthToken();
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      console.log(
        "밀키트 구매 링크 요청 중... meal_kit_id:",
        mealKitData.meal_kit_id
      );
      const response = await mealKitApi.getMealKitPurchaseLink(
        mealKitData.meal_kit_id,
        token
      );

      if (response.success && response.data) {
        console.log("밀키트 구매 링크 응답:", response.data);
        await Linking.openURL(response.data.purchase_link);
      } else {
        console.error("밀키트 구매 링크 로드 실패:", response.error);
        Alert.alert("오류", "구매 링크를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("밀키트 구매 링크 열기 실패:", error);
      Alert.alert("오류", "구매 링크를 열 수 없습니다.");
    }
  }, [mealKitData?.meal_kit_id]);

  useEffect(() => {
    loadRecipeDetail();
    loadMealKitDetail();
  }, [loadRecipeDetail, loadMealKitDetail]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">레시피 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (!recipeData) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-600">레시피 정보를 찾을 수 없습니다.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-6 py-3 bg-blue-500 rounded-lg"
        >
          <Text className="text-white font-medium">돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* 헤더 */}
        <View className="bg-white p-6 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-blue-500 text-lg">← 돌아가기</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-800">
            {recipeData.recipe_name || "레시피 정보"}
          </Text>
        </View>

        {/* 요리 방법 */}
        <View className="bg-white m-4 p-6 rounded-xl shadow-sm">
          <View className="flex-row items-center mb-4">
            <Text className="text-xl font-bold text-gray-800 mr-2">🍳</Text>
            <Text className="text-xl font-bold text-gray-800">요리 방법</Text>
          </View>
          {recipeData.cooking_method ? (
            <Text className="text-gray-700 leading-7 text-base">
              {recipeData.cooking_method}
            </Text>
          ) : (
            <Text className="text-gray-500 italic text-base">
              요리 방법이 제공되지 않았습니다.
            </Text>
          )}
        </View>

        {/* 재료 목록 */}
        <View className="bg-white m-4 p-6 rounded-xl shadow-sm">
          <View className="flex-row items-center mb-4">
            <Text className="text-xl font-bold text-gray-800 mr-2">🥘</Text>
            <Text className="text-xl font-bold text-gray-800">필요한 재료</Text>
          </View>
          {recipeData.ingredients && recipeData.ingredients.length > 0 ? (
            <View className="space-y-3">
              {recipeData.ingredients.map((ingredient, index) => (
                <View key={index} className="flex-row items-center">
                  {typeof ingredient === "object" && ingredient.image_url ? (
                    <Image
                      source={{ uri: ingredient.image_url }}
                      className="w-8 h-8 rounded-full mr-4"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-3 h-3 bg-green-500 rounded-full mr-4" />
                  )}
                  <Text className="text-gray-700 flex-1 text-base">
                    {typeof ingredient === "string"
                      ? ingredient
                      : ingredient.name}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-500 italic text-base">
              재료 정보가 제공되지 않았습니다.
            </Text>
          )}
        </View>

        {/* 유튜브 링크 */}
        {recipeData.recipe_video_link &&
          recipeData.recipe_video_link.trim() !== "" && (
            <View className="bg-white m-4 p-6 rounded-xl shadow-sm">
              <View className="flex-row items-center mb-4">
                <Text className="text-xl font-bold text-gray-800 mr-2">📺</Text>
                <Text className="text-xl font-bold text-gray-800">
                  요리 영상
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleVideoPress}
                className="bg-red-500 p-4 rounded-lg flex-row items-center justify-center shadow-md"
              >
                <Text className="text-white font-bold text-lg mr-2">▶</Text>
                <Text className="text-white font-bold text-lg">
                  유튜브에서 보기
                </Text>
              </TouchableOpacity>
            </View>
          )}

        {/* 밀키트 정보 */}
        {mealKitData && (
          <View className="bg-white m-4 p-6 rounded-xl shadow-sm">
            <View className="flex-row items-center mb-4">
              <Text className="text-xl font-bold text-gray-800 mr-2">📦</Text>
              <Text className="text-xl font-bold text-gray-800">
                밀키트 정보
              </Text>
            </View>

            {/* 밀키트 이름 */}
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              {mealKitData.meal_kit_name}
            </Text>

            {/* 영양 정보 */}
            <View className="bg-gray-50 p-4 rounded-lg mb-4">
              <Text className="text-base font-medium text-gray-700 mb-2">
                영양 정보 (1인분)
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-sm text-gray-600">칼로리</Text>
                  <Text className="text-lg font-bold text-orange-500">
                    {Math.round(mealKitData.calories)}kcal
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-gray-600">탄수화물</Text>
                  <Text className="text-lg font-bold text-blue-500">
                    {Math.round(mealKitData.carbs_g)}g
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-gray-600">단백질</Text>
                  <Text className="text-lg font-bold text-green-500">
                    {Math.round(mealKitData.protein_g)}g
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-gray-600">지방</Text>
                  <Text className="text-lg font-bold text-purple-500">
                    {Math.round(mealKitData.fat_g)}g
                  </Text>
                </View>
              </View>
            </View>

            {/* 구매 링크 */}
            <TouchableOpacity
              onPress={handleMealKitPurchase}
              className="bg-green-500 p-4 rounded-lg flex-row items-center justify-center shadow-md"
            >
              <Text className="text-white font-bold text-lg mr-2">🛒</Text>
              <Text className="text-white font-bold text-lg">
                밀키트 구매하기
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
