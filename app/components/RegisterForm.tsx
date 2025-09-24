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
import { authService, RegisterRequest } from "../../services/authService";
import {
  debugNetworkRequest,
  testSimpleConnection,
} from "../../utils/debugNetwork";
import { testEndpoints } from "../../utils/endpointTester";
import { StorageService } from "../../utils/storage";
import TermsOfService from "./TermsOfService";

const Form = () => {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleTermsAccept = () => {
    setTermsAccepted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("오류", "이름을 입력해주세요.");
      return false;
    }
    if (!formData.username.trim()) {
      Alert.alert("오류", "사용자명을 입력해주세요.");
      return false;
    }
    // 사용자명 형식 검증 (영문, 숫자, 언더스코어만 허용, 3-20자)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(formData.username)) {
      Alert.alert(
        "오류",
        "사용자명은 영문, 숫자, 언더스코어만 사용 가능하며 3-20자여야 합니다."
      );
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert("오류", "이메일을 입력해주세요.");
      return false;
    }
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("오류", "올바른 이메일 형식을 입력해주세요.");
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert("오류", "전화번호를 입력해주세요.");
      return false;
    }
    // 전화번호 형식 검증 (간단한 한국 전화번호 형식)
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(formData.phone.replace(/-/g, ""))) {
      Alert.alert(
        "오류",
        "올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)"
      );
      return false;
    }
    if (!formData.password) {
      Alert.alert("오류", "비밀번호를 입력해주세요.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert("오류", "비밀번호는 6자 이상이어야 합니다.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // 네트워크 디버깅 시작
    console.log("=== 회원가입 시도 시작 ===");
    await debugNetworkRequest();

    try {
      // 전화번호 형식 변환 (01012341234 -> 010-1234-1234)
      const formatPhoneNumber = (phone: string) => {
        const cleaned = phone.replace(/-/g, "");
        if (cleaned.length === 11 && cleaned.startsWith("010")) {
          return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
            7
          )}`;
        }
        return phone;
      };

      const registerData: RegisterRequest = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formatPhoneNumber(formData.phone.trim()),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      console.log("전송할 데이터:", registerData);
      console.log("API 엔드포인트: /users/signup (POST with query params)");

      const response = await authService.register(registerData);

      console.log("서버 응답:", response);

      if (response.success && response.data) {
        // 회원가입 성공
        Alert.alert("성공", "회원가입이 완료되었습니다!", [
          {
            text: "확인",
            onPress: async () => {
              // 토큰과 사용자 정보 저장 (안전하게 처리)
              if (response.data?.token) {
                await StorageService.setAuthToken(response.data.token);
              }
              if (response.data?.user) {
                await StorageService.setUserData(response.data.user);
              }
              // 로그인 화면으로 이동
              router.replace("/login");
            },
          },
        ]);
      } else {
        Alert.alert(
          "회원가입 실패",
          response.error || "회원가입에 실패했습니다."
        );
      }
    } catch (error) {
      console.log("회원가입 오류 상세:", error);
      Alert.alert("오류", `네트워크 오류가 발생했습니다: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 약관에 동의하지 않은 경우 약관 화면 표시
  if (!termsAccepted) {
    return <TermsOfService onAccept={handleTermsAccept} />;
  }

  // 약관 동의 후 회원가입 폼 표시
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center py-20 px-4">
        <View className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <View className="flex-col w-full h-[50px] items-center mb-4">
            <View className="w-full justify-start">
              <TouchableOpacity
                onPress={() => setTermsAccepted(false)}
                className="pb-2"
              >
                <Text className="text-teal-500 font-medium">← 약관으로</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text className="text-2xl font-bold text-center text-gray-800 flex-1">
                회원가입
              </Text>
            </View>
          </View>

          <View className="space-y-4">
            <View className="pb-2">
              <Text className="text-sm font-medium text-gray-700">
                이름 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="Enter FullName"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <View className="pb-2">
              <Text className="text-sm font-medium text-gray-700">
                사용자명 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="Enter Username"
                value={formData.username}
                onChangeText={(value) => handleInputChange("username", value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <View className="pb-2">
              <Text className="text-sm font-medium text-gray-700">
                이메일 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="name@example.com"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <View className="pb-2">
              <Text className="text-sm font-medium text-gray-700">
                전화번호 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="010-1234-5678"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                maxLength={13} // 010-1234-5678 형식
              />
            </View>

            <View className="pb-2">
              <Text className="text-sm font-medium text-gray-700">
                비밀번호 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="Enter Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700">
                비밀번호 확인 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <TouchableOpacity
              className={`py-3 rounded mt-4 ${
                isLoading ? "bg-gray-400" : "bg-black"
              }`}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-semibold">
                {isLoading ? "회원가입 중..." : "회원가입"}
              </Text>
            </TouchableOpacity>

            {/* 네트워크 테스트 버튼 (개발용) */}
            <TouchableOpacity
              className="bg-blue-500 py-2 rounded mt-2"
              onPress={async () => {
                console.log("=== 네트워크 테스트 시작 ===");
                await testSimpleConnection();
                console.log("=== 네트워크 테스트 완료 ===");
              }}
            >
              <Text className="text-white text-center font-semibold text-sm">
                네트워크 테스트
              </Text>
            </TouchableOpacity>

            {/* 엔드포인트 테스트 버튼 (개발용) */}
            <TouchableOpacity
              className="bg-green-500 py-2 rounded mt-2"
              onPress={async () => {
                await testEndpoints();
              }}
            >
              <Text className="text-white text-center font-semibold text-sm">
                엔드포인트 테스트
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-6 flex-row justify-center items-center">
            <Text className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/login");
              }}
            >
              <Text className="text-teal-500 font-bold">로그인</Text>
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
