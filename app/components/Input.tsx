import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  validationType?: "email" | "numeric" | "text" | "phone";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder = "Nebulon Input...",
  value = "",
  onChangeText,
  validationType = "text",
  required = false,
  minLength,
  maxLength,
  errorMessage,
}) => {
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

  const validateInput = (text: string) => {
    if (!text.trim()) {
      if (required) {
        setError("필수 입력 항목입니다");
        setIsValid(false);
        return false;
      }
      setError("");
      setIsValid(true);
      return true;
    }

    // 이메일 검증
    if (validationType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        setError("올바른 이메일 형식을 입력해주세요");
        setIsValid(false);
        return false;
      }
    }

    // 숫자 검증
    if (validationType === "numeric") {
      const numericRegex = /^\d+$/;
      if (!numericRegex.test(text)) {
        setError("숫자만 입력해주세요");
        setIsValid(false);
        return false;
      }
    }

    // 전화번호 검증
    if (validationType === "phone") {
      const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
      if (!phoneRegex.test(text.replace(/-/g, ""))) {
        setError("올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)");
        setIsValid(false);
        return false;
      }
    }

    // 최소 길이 검증
    if (minLength && text.length < minLength) {
      setError(`최소 ${minLength}자 이상 입력해주세요`);
      setIsValid(false);
      return false;
    }

    // 최대 길이 검증
    if (maxLength && text.length > maxLength) {
      setError(`최대 ${maxLength}자까지 입력 가능합니다`);
      setIsValid(false);
      return false;
    }

    setError("");
    setIsValid(true);
    return true;
  };

  const handleTextChange = (text: string) => {
    validateInput(text);
    onChangeText?.(text);
  };

  return (
    <View className="w-full">
      <TextInput
        className={`border-1 border-black rounded-md p-2.5 w-[80%] ${
          isValid ? "border-gray-300" : "border-red-500"
        }`}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        maxLength={maxLength}
      />
      {(error || errorMessage) && (
        <Text className="text-red-500 text-sm mt-1 ml-1">
          {error || errorMessage}
        </Text>
      )}
    </View>
  );
};

export default Input;
