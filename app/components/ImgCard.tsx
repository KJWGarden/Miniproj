import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

const Card = (props: {
  title: string;
  subtitle: string;
  image: any;
  calories: number;
  id: number;
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/(pages)/recommend/${props.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="rounded-3xl overflow-hidden w-11/12 max-w-md">
        <ImageBackground
          source={props.image}
          className="w-full"
          imageStyle={{ resizeMode: "cover" }}
          style={{ height: 350 }}
        >
          <View className="flex-row justify-between items-center p-8">
            <View className="z-0 bg-black/50 rounded-lg p-2">
              <Text className="text-white">총 {props.calories}kcal</Text>
            </View>
            <TouchableOpacity className="z-0">
              <Feather name="bookmark" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-1 justify-end">
            <LinearGradient
              colors={[
                "transparent",
                "rgba(0, 0, 0, 0.3)",
                "rgba(0, 0, 0, 0.8)",
              ]}
              locations={[0, 0.5, 1]}
              style={{
                padding: 32,
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
              }}
            >
              <TouchableOpacity>
                <Text className="text-2xl font-bold text-white">
                  {props.title}
                </Text>
                <Text className="mt-1 text-md font-light text-white">
                  {props.subtitle}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
