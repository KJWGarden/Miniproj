import { ScrollView, Text, View } from "react-native";
import ImgCard from "../components/ImgCard";

const recommendData = [
  {
    id: 1,
    title: "상큼 바삭 건강한 아침, 베리 요거트 볼",
    subtitle:
      "신선한 블루베리의 달콤함이 가득한 꾸덕한 그릭요거트에, 고소하고 바삭한 보리 그래놀라가 풍성하게 더해져요",
    image: require("../../assets/images/www.png"),
    calories: 100,
  },
  {
    id: 2,
    title: "단백질 풍부한 그릴드 치킨 샐러드",
    subtitle:
      "바삭하게 구운 닭가슴살과 신선한 로메인, 체리 토마토가 어우러진 든든한 샐러드. 올리브오일 드레싱으로 완성",
    image: require("../../assets/images/www.png"),
    calories: 2340,
  },
  {
    id: 3,
    title: "부드러운 아보카도 토스트",
    subtitle:
      "완벽하게 익은 아보카도를 올린 통밀 토스트에 레몬즙과 바질, 바다소금으로 간을 낸 건강한 브런치 메뉴",
    image: require("../../assets/images/www.png"),
    calories: 500,
  },
  {
    id: 4,
    title: "따뜻한 연어 포케 볼",
    subtitle:
      "신선한 연어와 현미밥, 아보카도, 오이, 김가루가 어우러진 하와이안 스타일의 포케 볼. 간장 드레싱으로 마무리",
    image: require("../../assets/images/www.png"),
    calories: 300,
  },
  {
    id: 5,
    title: "달콤한 고구마 스무디 볼",
    subtitle:
      "구운 고구마와 바나나, 아몬드 밀크로 만든 부드러운 스무디에 그래놀라와 베리류를 토핑한 든든한 간식",
    image: require("../../assets/images/www.png"),
    calories: 240,
  },
];

export default function TargetScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ alignItems: "center", paddingBottom: 150 }}
      >
        <View className="pt-8 p-4">
          <Text className="text-2xl font-bold text-gray-800 mb-8">
            USER님을 위한 추천 식단
          </Text>
        </View>
        <View className="items-center gap-8">
          {recommendData.map((item) => (
            <ImgCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
              calories={item.calories}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
