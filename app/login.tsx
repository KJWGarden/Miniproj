import { View } from "react-native";
import LoginForm from "./components/LoginForm";

export default function Login() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      <LoginForm />
    </View>
  );
}
