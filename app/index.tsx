import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // 3초 후에 메인 화면으로 이동
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      <Text className="text-4xl font-bold text-white mb-4">환영합니다!</Text>
      <Text className="text-lg text-white">
        잠시 후 메인 화면으로 이동합니다...
      </Text>
    </View>
  );
}
