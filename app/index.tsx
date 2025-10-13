import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StorageService } from "../utils/storage";

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const [showButtons, setShowButtons] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 앱 시작 시 로그인 상태와 설문 완료 여부 확인
    const checkAppState = async () => {
      try {
        const token = await StorageService.getAuthToken();
        const surveyCompleted = await StorageService.getSurveyCompleted();

        console.log("🔍 앱 상태 확인:");
        console.log("- 토큰 존재:", !!token);
        console.log("- 설문 완료:", surveyCompleted);

        // 저장된 사용자 정보도 확인
        const userInfo = await StorageService.getUserInitialInfo();
        console.log("- 저장된 사용자 정보:", userInfo);

        // 항상 웰컴 화면을 표시 (자동 로그인 비활성화)
        console.log("🔍 앱 시작 - 웰컴 화면 표시");
        console.log("- 토큰 존재:", !!token);
        console.log("- 설문 완료:", surveyCompleted);
        console.log("- 저장된 사용자 정보:", userInfo);

        setIsLoading(false);

        // 아이콘 애니메이션 시작
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // 애니메이션 완료 후 버튼들 표시
          setShowButtons(true);
        });
      } catch (error) {
        console.error("앱 상태 확인 오류:", error);
        setIsLoading(false);

        // 오류 시에도 애니메이션 실행
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowButtons(true);
        });
      }
    };

    checkAppState();
  }, [router]);

  // 로딩 중이거나 자동으로 다른 화면으로 이동하는 경우
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-500">
        <Text className="text-white text-lg">로딩 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      {/* 앱 아이콘 애니메이션 */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="items-center mb-8"
      >
        <Image
          source={require("../assets/images/icon.png")}
          className="w-24 h-24 rounded-2xl mb-4"
          resizeMode="contain"
        />
        <Text className="text-4xl font-bold text-white mb-2">Miniproj</Text>
        <Text className="text-lg text-white opacity-90">
          건강한 식단 관리의 시작
        </Text>
      </Animated.View>

      {/* 로그인/회원가입 버튼들 */}
      {showButtons && (
        <Animated.View
          style={{
            opacity: fadeAnim,
          }}
          className="w-full max-w-sm px-8"
        >
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-white py-4 rounded-xl mb-4 shadow-lg"
          >
            <Text className="text-blue-500 text-center font-bold text-lg">
              로그인
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            className="border-2 border-white py-4 rounded-xl mb-4"
          >
            <Text className="text-white text-center font-bold text-lg">
              회원가입
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              await StorageService.clearAll();
              console.log("🧹 모든 저장된 데이터가 삭제되었습니다.");
              Alert.alert("완료", "로그아웃되었습니다.");
            }}
            className="bg-red-500 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-sm">
              개발용: 모든 데이터 삭제
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
