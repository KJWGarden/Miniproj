import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

interface GalaxyTabProps {
  currentPath: string;
}

const Tab = ({ currentPath }: GalaxyTabProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: "home", route: "/(tabs)/home" },
    { name: "target", route: "/(tabs)/target" },
    { name: "camera", route: "/(tabs)/camera" },
    { name: "chat", route: "/(tabs)/aiChat" },
    { name: "settings", route: "/(tabs)/settings" },
  ];

  // prop으로 받은 currentPath에 따라 활성 탭 설정
  useEffect(() => {
    // 더 유연한 경로 매칭
    let currentTabIndex = -1;

    // 정확한 매칭 먼저 시도
    currentTabIndex = tabs.findIndex((tab) => tab.route === currentPath);

    // 정확한 매칭이 안되면 부분 매칭 시도
    if (currentTabIndex === -1) {
      currentTabIndex = tabs.findIndex((tab) => {
        const routeName = tab.route.split("/").pop(); // 마지막 부분만 추출
        const pathName = currentPath.split("/").pop();
        return routeName === pathName;
      });
    }

    if (currentTabIndex !== -1) {
      setActiveTab(currentTabIndex);
    } else {
      // 기본값으로 홈 탭 설정
      setActiveTab(0);
    }
  }, [currentPath]);

  const handleTabPress = (index: number, route: string) => {
    setActiveTab(index);
    router.push(route as any);
  };

  // currentPath가 없는 경우 또는 카메라 화면인 경우 렌더링하지 않음
  if (!currentPath || currentPath.includes("/camera")) {
    return null;
  }

  return (
    <View className="absolute bottom-0 left-0 right-0 flex items-center pb-8">
      <View className="flex-row w-11/12 items-center justify-around rounded-full bg-black py-2">
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            onPress={() => handleTabPress(index, tab.route)}
            className={`rounded-full w-12 h-12 flex items-center justify-center ${
              activeTab === index ? "bg-white" : "bg-transparent"
            }`}
          >
            {tab.name === "chat" ? (
              <Entypo
                name="chat"
                size={24}
                color={activeTab === index ? "#000000" : "white"}
              />
            ) : (
              <Feather
                name={tab.name as any}
                size={24}
                color={activeTab === index ? "#000000" : "white"}
              />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default Tab;
