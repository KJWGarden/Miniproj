import { TextInput, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="w-full items-center px-4">
        <TextInput
          className="border border-gray-300 rounded-md p-3 w-[80%] bg-white"
          placeholder="메시지를 입력하세요..."
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 6,
            padding: 12,
            backgroundColor: "white",
            fontSize: 16,
          }}
        />
      </View>
    </View>
  );
}
