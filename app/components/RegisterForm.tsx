import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TermsOfService from "./TermsOfService";

const Form = () => {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleTermsAccept = () => {
    setTermsAccepted(true);
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
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <View className="pb-2">
              <Text className="text-sm font-medium text-gray-700">
                비밀번호 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="Enter Password"
                secureTextEntry
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
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <TouchableOpacity className="bg-black py-3 rounded mt-4">
              <Text className="text-white text-center font-semibold">
                회원가입
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
