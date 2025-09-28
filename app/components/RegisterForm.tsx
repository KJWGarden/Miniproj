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
    password_confirm: "",
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
    if (formData.password !== formData.password_confirm) {
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
        id: formData.name.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        phone: formatPhoneNumber(formData.phone.trim()),
        password: formData.password,
        password_confirm: formData.password_confirm,
      };

      console.log("전송할 데이터:", registerData);
      console.log("API 엔드포인트: /users/signup (POST with query params)");

      const response = await authService.register(registerData);

      console.log("서버 응답:", response);
      console.log("응답 성공 여부:", response.success);
      console.log("응답 데이터:", response.data);
      console.log("응답 오류:", response.error);

      if (response.success && response.data) {
        // 회원가입 성공 (JSON 응답 또는 텍스트 응답 모두 처리)
        const successMessage =
          (response.data as any)?.message || "회원가입이 완료되었습니다!";

        Alert.alert("성공", successMessage, [
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

      // 서버 오류에 대한 더 구체적인 메시지 제공
      let errorMessage = "회원가입 중 오류가 발생했습니다.";

      if (error instanceof Error) {
        if (error.message.includes("500")) {
          errorMessage =
            "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (error.message.includes("422")) {
          errorMessage = "입력한 정보를 다시 확인해주세요.";
        } else if (error.message.includes("409")) {
          errorMessage = "이미 사용 중인 이메일 또는 사용자명입니다.";
        } else if (error.message.includes("network")) {
          errorMessage = "네트워크 연결을 확인해주세요.";
        }
      }

      Alert.alert("회원가입 실패", errorMessage);
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
                아이디를 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="Enter Username"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <View className="pb-2">
              <Text className="text-sm font-medium text-gray-700">
                이름을 <Text className="text-red-600">*</Text>
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
                value={formData.password_confirm}
                onChangeText={(value) =>
                  handleInputChange("password_confirm", value)
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
