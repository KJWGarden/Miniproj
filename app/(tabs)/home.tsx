import { ScrollView, View } from "react-native";
import Calorie from "../components/Calorie";
import CircularProgress from "../components/CircularProgress";
import InputCard from "../components/InputCard";
import NutritionalComposition from "../components/NutritionalComposition";

const Data = [
  {
    index: 1,
    name: "ㅇㅇㅇㅇㅇ",
    value: 100,
  },
  {
    index: 2,
    name: "ㅈㅈㅈㅈㅈㅈ",
    value: 100,
  },

  {
    index: 3,
    name: "ㅁㅁㅁㅁㅁㅁ",
    value: 100,
  },
  {
    index: 4,
    name: "ㅁㅁㅁㅁㅁㅁ",
    value: 100,
  },
];

export default function TabOneScreen() {
  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
      >
        <View className="flex-row items-center justify-center mt-8">
          <View className="items-center">
            <Calorie title="남은 칼로리" value={1000} />
          </View>
          <View className="items-center">
            <CircularProgress
              progress={75}
              size={150}
              strokeWidth={5}
              color="#10B981"
              eatCalorie={1000}
            />
          </View>
          <View className="items-center">
            <Calorie title="목표칼로리" value={1000} />
          </View>
        </View>
        <View className="w-full flex justify-center items-center mt-4">
          <NutritionalComposition />
        </View>
        <View className="w-full flex justify-center items-center mt-4">
          {Data.map((item) => (
            <InputCard
              key={item.index}
              index={item.index}
              name={item.name}
              value={item.value}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
