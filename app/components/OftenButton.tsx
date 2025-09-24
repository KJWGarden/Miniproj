import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function OftenButton(props: {
  onPress: (answer: string) => void;
  selectedAnswer?: string;
}) {
  const [selected, setSelected] = useState(-1);

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  return (
    <View className="w-full p-6">
      <View className="flex-row items-center justify-center w-full flex-auto">
        <TouchableOpacity
          className={`border border-gray-200 rounded-l-lg w-1/3 p-4 ${
            selected === 0 ? "bg-blue-100 border-blue-300" : "bg-white"
          }`}
          onPress={() => {
            handleSelect(0);
            props.onPress("식사안함");
          }}
        >
          <Text className="text-center text-lg font-bold">식사안함</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`border border-gray-200 w-1/3 p-4 ${
            selected === 1 ? "bg-blue-100 border-blue-300" : "bg-white"
          }`}
          onPress={() => {
            handleSelect(1);
            props.onPress("간단히");
          }}
        >
          <Text className="text-center text-lg font-bold">간단히</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`border border-gray-200  w-1/3 rounded-r-lg p-4 ${
            selected === 2 ? "bg-blue-100 border-blue-300" : "bg-white"
          }`}
          onPress={() => {
            handleSelect(2);
            props.onPress("보통");
          }}
        >
          <Text className="text-center text-lg font-bold">보통</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
