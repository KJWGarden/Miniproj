import { View } from "react-native";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      <RegisterForm />
    </View>
  );
}
