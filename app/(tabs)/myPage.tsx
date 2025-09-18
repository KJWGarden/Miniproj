import { Text, View } from "react-native";
import Card from "../components/Card";

export default function TabTwoScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold text-gray-800 mb-8">마이페이지</Text>
      <Card />
    </View>
  );
}
