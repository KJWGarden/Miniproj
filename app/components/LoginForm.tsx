import { useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Form = () => {
  const router = useRouter();

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
                이메일 <Text className="text-red-600">*</Text>
              </Text>
              <TextInput
                placeholder="name@example.com"
                keyboardType="email-address"
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
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            </View>

            <TouchableOpacity className="bg-black py-3 rounded mt-4">
              <Text className="text-white text-center font-semibold">
                Login
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
