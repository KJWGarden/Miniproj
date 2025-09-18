import { View } from "react-native";
import ListItem from "../components/ListItem";
import Profile from "../components/profile";

const menuList = [
  {
    id: 1,
    title: "나의 정보",
    pressable: true,
  },

  {
    id: 2,
    title: "포인트 내역",
    pressable: true,
  },

  {
    id: 3,
    title: "알림 설정",
    pressable: true,
  },

  {
    id: 4,
    title: "이용 약관",
    pressable: true,
  },

  {
    id: 5,
    title: "계정 관리",
    pressable: true,
  },
  {
    id: 6,
    title: "로그아웃",
    pressable: true,
  },
  {
    id: 7,
    title: "앱 버전 정보",
    subTitle: "1.0.0",
    pressable: false,
  },
  {
    id: 8,
    title: "고객센터",
    subTitle: "contact@example.com",
    pressable: false,
  },
];

export default function SettingsScreen() {
  return (
    <View className="flex-1 justify-start items-center bg-gray-100 pt-8">
      <View className="w-full items-center">
        <Profile />
      </View>
      <View className="w-11/12 items-center bg-stone-400 rounded-lg m-4">
        {menuList.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            subTitle={item.subTitle ?? ""}
            pressable={item.pressable}
          />
        ))}
      </View>
    </View>
  );
}
