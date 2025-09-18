import { Text, View } from "react-native";
import ProgressBar from "./ProgressBar";

export default function NutritionalComposition() {
  return (
    <View className="flex-row justify-between bg-white rounded-xl w-[90%] px-8 py-4">
      <View className="flex-col w-1/3 px-4">
        <Text className="text-center font-bold">탄수화물</Text>
        <ProgressBar eat={100} recommend={150} color="#FF9800" />
        <Text className="text-center mt-1">100 / 150g</Text>
      </View>
      <View className="flex-col w-1/3 px-4">
        <Text className="text-center font-bold">단백질</Text>
        <ProgressBar eat={100} recommend={150} color="#212121" />
        <Text className="text-center mt-1">100 / 150g</Text>
      </View>
      <View className="flex-col w-1/3 px-4">
        <Text className="text-center font-bold">지방</Text>
        <ProgressBar eat={100} recommend={150} color="#FF0000" />
        <Text className="text-center mt-1">100 / 150g</Text>
      </View>
    </View>
  );
}
