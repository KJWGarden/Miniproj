import { Text, View } from "react-native";
import ProgressBar from "./NutritionProgressBar";

interface NutritionalCompositionProps {
  nutritionData: {
    carbs: { eaten: number; recommended: number };
    protein: { eaten: number; recommended: number };
    fat: { eaten: number; recommended: number };
  };
}

export default function NutritionalComposition({
  nutritionData,
}: NutritionalCompositionProps) {
  return (
    <View className="flex-row justify-between bg-white rounded-xl w-[90%] px-8 py-4">
      <View className="flex-col w-1/3 px-4">
        <Text className="text-center font-bold">탄수화물</Text>
        <ProgressBar
          eat={nutritionData.carbs.eaten}
          recommend={nutritionData.carbs.recommended}
          color="#FF9800"
        />
        <Text className="text-center mt-1">
          {nutritionData.carbs.eaten.toFixed(1)} /{" "}
          {nutritionData.carbs.recommended}g
        </Text>
      </View>
      <View className="flex-col w-1/3 px-4">
        <Text className="text-center font-bold">단백질</Text>
        <ProgressBar
          eat={nutritionData.protein.eaten}
          recommend={nutritionData.protein.recommended}
          color="#212121"
        />
        <Text className="text-center mt-1">
          {nutritionData.protein.eaten.toFixed(1)} /{" "}
          {nutritionData.protein.recommended}g
        </Text>
      </View>
      <View className="flex-col w-1/3 px-4">
        <Text className="text-center font-bold">지방</Text>
        <ProgressBar
          eat={nutritionData.fat.eaten}
          recommend={nutritionData.fat.recommended}
          color="#FF0000"
        />
        <Text className="text-center mt-1">
          {nutritionData.fat.eaten.toFixed(1)} / {nutritionData.fat.recommended}
          g
        </Text>
      </View>
    </View>
  );
}
