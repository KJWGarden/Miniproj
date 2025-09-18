import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";

export default function ListItem(props: {
  title: string;
  subTitle: string;
  pressable: boolean;
}) {
  return (
    <Pressable>
      <View className="flex-row justify-between items-center w-11/12 p-4 ">
        <View className="flex-row items-center gap-2">
          <Text className="font-bold text-lg">{props.title}</Text>
          <Text>{props.subTitle}</Text>
        </View>
        {props.pressable && (
          <Feather name="chevron-right" size={24} color="black" />
        )}
      </View>
    </Pressable>
  );
}
