import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  authService,
  LoginRequest,
  ServerUserDataResponse,
} from "../../services/authService";
import { StorageService } from "../../utils/storage";

const Form = () => {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert("오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const loginData: LoginRequest = {
        id: id,
        password: password,
      };

      const response = await authService.login(loginData);

      if (response.success && response.data) {
        // 쿠키에서 토큰 추출
        let token = null;
        if (response.headers?.map?.["set-cookie"]) {
          const cookieHeader = response.headers.map["set-cookie"];
          // access_token=... 부분 추출
          const tokenMatch = cookieHeader.match(/access_token=([^;]+)/);
          if (tokenMatch) {
            token = tokenMatch[1];
          }
        }

        // 토큰 저장
        if (token) {
          await StorageService.setAuthToken(token);
        }

        if (response.data?.user) {
          await StorageService.setUserData(response.data.user);
        }

        // 사용자 초기 정보 가져오기
        let hasInitialInfo = false;
        try {
          const userInfoResponse = await authService.getUserInitialInfo(token);
          console.log("사용자 초기 정보 응답:", userInfoResponse);

          // 응답 구조 확인 및 적절한 데이터 추출
          if (
            userInfoResponse &&
            userInfoResponse.success &&
            userInfoResponse.data
          ) {
            const serverData: ServerUserDataResponse = userInfoResponse.data;

            // 서버 응답을 UserInitialInfo 형식으로 매핑
            const userInfo = {
              gender: serverData.gender || "",
              age: serverData.user_age || 0,
              height: serverData.height || 0,
              weight: serverData.weight || 0,
              activity_level: serverData.activity_level || "",
              goal: serverData.diet_goal || "",
              preferred_food: "",
              allergies: [],
              eat_level: {
                breakfast: "",
                lunch: "",
                dinner: "",
              },
            };

            console.log("매핑된 사용자 정보:", userInfo);

            // 사용자 초기 정보 저장
            await StorageService.setUserInitialInfo(userInfo);
            hasInitialInfo = true;
          } else {
            console.log("사용자 초기 정보 없음 또는 응답이 예상과 다름");
            hasInitialInfo = false;
          }
        } catch (error) {
          console.error("사용자 초기 정보 가져오기 실패:", error);
          hasInitialInfo = false;
        }

        // 로그인 성공
        Alert.alert("성공", "로그인되었습니다!", [
          {
            text: "확인",
            onPress: () => {
              // 초기 정보가 있으면 홈으로, 없으면 설문으로 이동
              if (hasInitialInfo) {
                router.replace("/(tabs)/home");
              } else {
                router.replace("/survey");
              }
            },
          },
        ]);
      } else {
        Alert.alert("로그인 실패", response.error || "로그인에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center py-20 px-4">
        <View className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
            로그인
          </Text>

          <View className="space-y-4">
            <View className="pb-2">
              <Text className="text-sm font-medium text-gray-700">
                아이디 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="ID"
                keyboardType="default"
                value={id}
                onChangeText={setId}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700">
                비밀번호 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="Enter Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <TouchableOpacity
              className={`py-3 rounded mt-4 ${
                isLoading ? "bg-gray-400" : "bg-black"
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-semibold">
                {isLoading ? "로그인 중..." : "Login"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-4 flex-row justify-center items-center">
            <Text className="text-sm text-gray-600">
              아직 회원이 아니신가요?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.replace("/register");
              }}
            >
              <Text className="font-bold text-teal-500">회원가입</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-2 flex-row justify-center items-center">
            <Text className="text-sm text-gray-600">
              아이디 또는 비밀번호를 잊어버리셨나요?{" "}
            </Text>
            <TouchableOpacity>
              <Text className="font-bold text-teal-500">찾기</Text>
            </TouchableOpacity>
          </View>

          <Text className="mt-6 text-center text-xs text-gray-400">
            © Copyright 2025{" "}
            <Text className="font-semibold text-gray-600"></Text> All Rights
            Reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Form;
