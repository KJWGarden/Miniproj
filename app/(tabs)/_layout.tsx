import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import GalaxyTab from "../components/GalaxyTab";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarIconMaterialCommunityIcons(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
          tabBarStyle: { display: "none" }, // 기본 탭바 숨기기
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "홈",
            tabBarIcon: ({ color }) => (
              <TabBarIconMaterialCommunityIcons name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="target"
          options={{
            title: "식단 관리",
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: "카메라",
            tabBarIcon: ({ color }) => (
              <TabBarIconMaterialCommunityIcons name="camera" color={color} />
            ),
            headerLeft: () => {
              const router = useRouter();
              return (
                <Pressable
                  onPress={() => router.back()}
                  style={{ marginLeft: 15 }}
                >
                  <Feather
                    name="arrow-left"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                </Pressable>
              );
            },
            tabBarStyle: { display: "none" }, // 카메라 화면에서만 탭바 숨기기
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "설정",
            tabBarIcon: ({ color }) => (
              <TabBarIconMaterialCommunityIcons name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
      <GalaxyTab currentPath={pathname} />
    </View>
  );
}
