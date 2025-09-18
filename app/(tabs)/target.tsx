import { ScrollView, Text, View } from "react-native";
import ImgCard from "../components/ImgCard";

export default function TargetScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <ScrollView className="w-full">
        <View className="pt-8 p-4">
          <Text className="text-2xl font-bold text-gray-800 mb-8">
            USER님을 위한 추천 식단
          </Text>
        </View>
        <View className="items-center">
          <ImgCard />
        </View>
      </ScrollView>
    </View>
  );
}
