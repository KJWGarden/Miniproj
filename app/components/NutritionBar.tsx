import { Text, View } from "react-native";

export default function NutritionBar(props: { name: string; value: number }) {
  return (
    <View className="flex-row justify-between bg-white rounded-xl w-[90%] px-8 py-4">
      <Text>{props.name}</Text>
      <Text>{props.value}</Text>
    </View>
  );
}
