import React from "react";
import { Image, Text, View } from "react-native";

const Avatar = () => {
  return (
    <View className="flex-row items-center gap-2">
      <View className="w-16 h-16 rounded-full bg-gray-200 flex justify-center items-center overflow-hidden">
        <Image
          source={require("../../assets/images/favicon.png")}
          className="w-full h-full object-cover"
        />
      </View>
      <View className="flex-col pl-4 gap-2">
        <Text className="font-semibold text-lg">USER님</Text>
        <Text className="text-md text-gray-700">user1234@gmail.com</Text>
      </View>
    </View>
  );
};

export default Avatar;
