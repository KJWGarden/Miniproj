import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
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
  }, []);

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
            onPress={() => router.push("/(tabs)/home")} //임시 개발용 수정해야함
            className="bg-white py-4 rounded-xl mb-4 shadow-lg"
          >
            <Text className="text-blue-500 text-center font-bold text-lg">
              로그인
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            className="border-2 border-white py-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-lg">
              회원가입
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
