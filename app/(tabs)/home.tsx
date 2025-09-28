import { UserInitialInfo } from "@/services/authService";
import { calculateRecommendedCalorie } from "@/utils/calorieCalculator";
import { StorageService } from "@/utils/storage";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Calorie from "../components/Calorie";
import CircularProgress from "../components/CircularProgress";
import InputCard from "../components/InputCard";
import NutritionalComposition from "../components/NutritionalComposition";

const initialData = [
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
  const [data, setData] = useState(initialData);
  const [userInitialInfo, setUserInitialInfo] =
    useState<UserInitialInfo | null>(null);
  const [recommendedCalorie, setRecommendedCalorie] = useState(2000); // 기본값
  const [eatenCalorie, setEatenCalorie] = useState(1000); // 기본값

  // 사용자 정보 로드 및 권장 칼로리 계산
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await StorageService.getUserInitialInfo();
        if (userInfo) {
          setUserInitialInfo(userInfo);
          const recommended = calculateRecommendedCalorie(userInfo);
          setRecommendedCalorie(recommended);
          console.log("권장 칼로리:", recommended);
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };

    loadUserInfo();
  }, []);

  const handleDelete = (index: number) => {
    setData((prevData) => prevData.filter((item) => item.index !== index));
  };

  const handleUpdate = (index: number, name: string, value: number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.index === index ? { ...item, name, value } : item
      )
    );
  };

  // 남은 칼로리 계산
  const remainingCalorie = recommendedCalorie - eatenCalorie;

  // 진행률 계산 (0-100)
  const progress = Math.min(
    Math.max((eatenCalorie / recommendedCalorie) * 100, 0),
    100
  );
  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: "center", paddingBottom: 150 }}
      >
        <View className="flex-row items-center justify-center mt-8">
          <View className="items-center">
            <Calorie title="남은 칼로리" value={remainingCalorie} />
          </View>
          <View className="items-center">
            <CircularProgress
              progress={progress}
              size={150}
              strokeWidth={5}
              color="#10B981"
              eatCalorie={eatenCalorie}
            />
          </View>
          <View className="items-center">
            <Calorie title="권장칼로리" value={recommendedCalorie} />
          </View>
        </View>
        <View className="w-full flex justify-center items-center mt-4">
          <NutritionalComposition />
        </View>
        <View className="w-full flex justify-center items-center mt-4 gap-4">
          {data.map((item) => (
            <InputCard
              key={item.index}
              index={item.index}
              name={item.name}
              value={item.value}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
