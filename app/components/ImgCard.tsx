import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ImageBackground,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Card = () => {
  return (
    <View className="rounded-lg overflow-hidden shadow-lg w-11/12 max-w-md">
      <ImageBackground
        source={require("../../assets/images/fff.png")}
        className="w-full"
        imageStyle={{ resizeMode: "cover" }}
        style={{ height: 350 }}
      >
        <View className="flex-row justify-between items-center p-8">
          <View className="z-0 bg-white/50 rounded-lg p-2">
            <Text className="text-white">총 100kcal</Text>
          </View>
          <Pressable className="z-0">
            <Feather name="bookmark" size={24} color="white" />
          </Pressable>
        </View>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="p-3">
            <TouchableOpacity>
              <Text className="text-2xl font-bold text-white">
                상큼 바삭 건강한 아침, 베리 요거트 볼
              </Text>
              <Text className="mt-1 text-lg font-bold text-white">
                신선한 블루베리의 달콤함이 가득한 꾸덕한 그릭요거트에, 고소하고
                바삭한 보리 그래놀라가 풍성하게 더해져요.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Card;
