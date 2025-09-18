import { Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold text-gray-800 mb-8">설정</Text>
      <Text className="text-lg text-gray-600 text-center px-4">
        설정 화면입니다
      </Text>
    </View>
  );
}
