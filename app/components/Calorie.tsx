import { Text, View } from "react-native";

export default function Calorie(props: { title: string; value: number }) {
  return (
    <View className="items-center mx-4">
      <Text className="text-2xl font-bold text-gray-800 mb-1">
        {props.value}
      </Text>
      <Text className="text-xl font-medium text-gray-800">{props.title}</Text>
    </View>
  );
}
