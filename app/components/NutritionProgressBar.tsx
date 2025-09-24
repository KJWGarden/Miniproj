import React from "react";
import { View } from "react-native";

const ProgressBar = (props: {
  recommend: number;
  eat: number;
  color: string;
}) => {
  return (
    <View>
      <View className="mt-2 h-2 w-full rounded-full bg-gray-300 overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            backgroundColor: props.color,
            width: `${(props.eat / props.recommend) * 100}%`,
          }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
