import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { dietRecommendationApi } from "../../utils/api";
import { StorageService } from "../../utils/storage";
import ImgCard from "../components/ImgCard";

export default function TargetScreen() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [userName, setUserName] = useState("USER");
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [alertShown, setAlertShown] = useState(false);

  // 식단 추천 로드 함수 (캐시 우선)
  const loadRecommendations = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);

      // 캐시된 데이터가 있고 강제 새로고침이 아닌 경우 캐시 사용
      if (!forceRefresh) {
        const cachedRecommendations =
          await StorageService.getDietRecommendations();
        if (cachedRecommendations && cachedRecommendations.length > 0) {
          console.log("캐시된 식단 추천 사용:", cachedRecommendations);
          setRecommendations(cachedRecommendations);
          setLoading(false);
          return;
        }
      }

      const token = await StorageService.getAuthToken();

      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      console.log("식단 추천 API 요청 중...");
      console.log("API Base URL:", "http://18.215.151.57:8000");
      console.log("요청 엔드포인트:", "/ai/generate-recommendation/food");

      // 재시도 로직 추가
      let response;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          response = await dietRecommendationApi.generateRecommendation(token);
          break; // 성공 시 루프 종료
        } catch (error) {
          retryCount++;
          console.log(
            `API 요청 실패 (${retryCount}/${maxRetries + 1}):`,
            error
          );

          if (retryCount <= maxRetries) {
            console.log(`${retryCount * 2}초 후 재시도...`);
            await new Promise((resolve) =>
              setTimeout(resolve, retryCount * 2000)
            ); // 2초, 4초 대기
          } else {
            throw error; // 최종 실패 시 오류 던지기
          }
        }
      }

      if (response.success && response.data) {
        console.log("식단 추천 응답:", response.data);

        // saved_recommendations 배열을 기존 데이터 형식에 맞게 변환
        const newRecommendations = response.data.saved_recommendations.map(
          (item: any, index: number) => ({
            id: Date.now() + index, // 고유 ID
            title: item.food_name,
            subtitle: response.data.message,
            image: { uri: item.image_url }, // 서버에서 받은 이미지 URL 사용
            calories: Math.floor(Math.random() * 500) + 200, // 임시 칼로리 (200-700)
            recommendation_id: item.recommendation_id,
          })
        );

        // 로컬 스토리지에 저장
        await StorageService.setDietRecommendations(newRecommendations);
        setRecommendations(newRecommendations);
        setIsOffline(false); // 성공 시 오프라인 상태 해제
        setAlertShown(false); // 성공 시 알림 상태 리셋
        console.log("식단 추천 로드 및 캐시 저장 완료:", newRecommendations);
      } else {
        console.error("식단 추천 로드 실패:", response.error);

        // 오류 유형별 사용자 친화적 메시지 표시
        if (response.error && response.error.includes("user_age")) {
          Alert.alert(
            "서버 오류",
            "식단 추천 서비스에 일시적인 문제가 있습니다."
          );
        } else if (
          response.error &&
          response.error.includes("Network request failed")
        ) {
          setIsOffline(true);
          if (!alertShown) {
            setAlertShown(true);
            Alert.alert(
              "네트워크 오류",
              "서버 연결에 문제가 있습니다. 캐시된 데이터를 표시하거나 새로고침을 시도해주세요.",
              [
                { text: "확인", style: "default" },
                {
                  text: "새로고침",
                  style: "default",
                  onPress: () => handleRefresh(),
                },
              ]
            );
          }
        } else {
          if (!alertShown) {
            setAlertShown(true);
            Alert.alert("오류", "식단 추천을 불러오는데 실패했습니다.");
          }
        }

        // 실패 시 빈 배열 사용
        setRecommendations([]);
      }
    } catch (error) {
      console.error("식단 추천 로드 오류:", error);

      // 네트워크 오류인 경우 특별 처리
      if (
        error instanceof Error &&
        error.message.includes("Network request failed")
      ) {
        setIsOffline(true);
        if (!alertShown) {
          setAlertShown(true);
          Alert.alert(
            "네트워크 오류",
            "서버 연결에 문제가 있습니다. 캐시된 데이터를 표시하거나 새로고침을 시도해주세요.",
            [
              { text: "확인", style: "default" },
              {
                text: "새로고침",
                style: "default",
                onPress: () => handleRefresh(),
              },
            ]
          );
        }
      } else {
        if (!alertShown) {
          setAlertShown(true);
          Alert.alert("오류", "식단 추천을 불러오는데 실패했습니다.");
        }
      }

      // 오류 시 빈 배열 사용
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 새로고침 함수
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setAlertShown(false); // 새로고침 시 알림 상태 리셋
    await loadRecommendations(true); // 강제 새로고침
    setRefreshing(false);
  }, [loadRecommendations]);

  // 사용자 이름 로드
  const loadUserName = useCallback(async () => {
    try {
      // 사용자 정보에서 이름 가져오기 (임시로 기본값 사용)
      // 실제로는 로그인 시 저장된 사용자 정보에서 가져와야 함
      setUserName("username");
    } catch (error) {
      console.error("사용자 이름 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    loadUserName();
    loadRecommendations();
  }, [loadUserName, loadRecommendations]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">식단 추천을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ alignItems: "center", paddingBottom: 150 }}
      >
        <View className="pt-8 p-4 w-full">
          {/* 오프라인 상태 표시 */}
          {isOffline && (
            <View className="bg-orange-100 border border-orange-300 rounded-lg p-3 mb-4">
              <Text className="text-orange-800 text-center font-medium">
                📡 서버 연결에 문제가 있습니다. 캐시된 데이터를 표시합니다.
              </Text>
            </View>
          )}

          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-2xl font-bold text-gray-800">
              {userName}님을 위한 추천 식단
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg ${
                refreshing ? "bg-gray-300" : "bg-blue-500"
              }`}
            >
              <Text className="text-white font-medium">
                {refreshing ? "새로고침 중..." : "새로고침"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="items-center gap-8">
          {recommendations.map((item) => (
            <ImgCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
              calories={item.calories}
              recommendation_id={item.recommendation_id}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
