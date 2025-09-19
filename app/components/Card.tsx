import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Card = () => {
  return (
    <View className="bg-white rounded-lg overflow-hidden shadow-lg m-4 w-11/12 max-w-md">
      <Image
        source={require("../../assets/images/www.png")}
        className="w-full h-52"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-xs text-gray-500 mb-1">07th July 1997</Text>
        <TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900 mb-2">
            Exploring the Unknown: The Alien Encounter Chronicles
          </Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-500 leading-5">
          Deep in the vastness of space lies a story untold—of strange beings,
          otherworldly landscapes, and encounters that defy imagination.
          Discover the mysteries of alien civilizations, their technology, and
          the secrets they carry across galaxies.
        </Text>
      </View>
    </View>
  );
};

export default Card;
