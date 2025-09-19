import { Text, View } from "react-native";

export default function RecommendScreen(props: { id: number }) {
  return (
    <View>
      <Text className="text-2xl font-bold text-gray-800">
        RecommendScreen {props.id}
      </Text>
    </View>
  );
}
