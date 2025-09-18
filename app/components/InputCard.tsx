import { Pressable, Text, View } from "react-native";

export default function InputCard(props: {
  index: number;
  name: string;
  value: number;
}) {
  return (
    <View className="flex-row justify-between items-center bg-white rounded-md p-4 w-[90%] overflow-scroll-y">
      <View>
        <Text>{props.index}번째 음식</Text>
        <Text>{props.name}</Text>
        <Text>{props.value}</Text>
      </View>
      <View>
        <Pressable className="bg-gray-200 items-center rounded-full p-2 my-4 w-10 h-10">
          <Text>+</Text>
        </Pressable>
        <Pressable className="bg-gray-200 items-center rounded-full p-2 my-4 w-10 h-10">
          <Text>-</Text>
        </Pressable>
      </View>
    </View>
  );
}
