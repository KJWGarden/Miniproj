import { useEffect, useState } from "react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

export default function SurveyInput(props: {
  type: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  minLength?: number;
  maxLength?: number;
  validationType?: "birthdate" | "numeric" | "text";
  onValidationChange?: (isValid: boolean) => void;
}) {
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

  const validateInput = (text: string) => {
    if (!text.trim()) {
      setError("");
      setIsValid(true);
      props.onValidationChange?.(true);
      return true;
    }

    // 생년월일 검증 (YYYYMMDD 형식)
    if (props.validationType === "birthdate") {
      const birthdateRegex =
        /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
      if (!birthdateRegex.test(text)) {
        setError("올바른 생년월일 형식을 입력해주세요 (예: 19900101)");
        setIsValid(false);
        props.onValidationChange?.(false);
        return false;
      }

      // 실제 날짜 유효성 검사
      const year = parseInt(text.substring(0, 4));
      const month = parseInt(text.substring(4, 6));
      const day = parseInt(text.substring(6, 8));
      const date = new Date(year, month - 1, day);

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        setError("유효하지 않은 날짜입니다");
        setIsValid(false);
        props.onValidationChange?.(false);
        return false;
      }
    }

    // 숫자 검증 (키, 몸무게)
    if (props.validationType === "numeric") {
      const numericRegex = /^\d+$/;
      if (!numericRegex.test(text)) {
        setError("숫자만 입력해주세요");
        setIsValid(false);
        props.onValidationChange?.(false);
        return false;
      }

      const num = parseInt(text);
      if (props.type === "numeric" && props.placeholder?.includes("키")) {
        if (num < 100 || num > 250) {
          setError("키는 100cm ~ 250cm 사이의 값을 입력해주세요");
          setIsValid(false);
          props.onValidationChange?.(false);
          return false;
        }
      }

      if (props.type === "numeric" && props.placeholder?.includes("몸무게")) {
        if (num < 20 || num > 200) {
          setError("몸무게는 20kg ~ 200kg 사이의 값을 입력해주세요");
          setIsValid(false);
          props.onValidationChange?.(false);
          return false;
        }
      }
    }

    // 최소 길이 검증
    if (props.minLength && text.length < props.minLength) {
      setError(`최소 ${props.minLength}자 이상 입력해주세요`);
      setIsValid(false);
      props.onValidationChange?.(false);
      return false;
    }

    // 최대 길이 검증
    if (props.maxLength && text.length > props.maxLength) {
      setError(`최대 ${props.maxLength}자까지 입력 가능합니다`);
      setIsValid(false);
      props.onValidationChange?.(false);
      return false;
    }

    setError("");
    setIsValid(true);
    props.onValidationChange?.(true);
    return true;
  };

  const handleTextChange = (text: string) => {
    validateInput(text);
    props.onChangeText?.(text);
  };

  useEffect(() => {
    if (props.value) {
      validateInput(props.value);
    }
  }, [props.value]);

  return (
    <View className="w-full">
      <TextInput
        autoComplete="birthdate-full"
        className={`bg-white p-4 rounded-lg shadow-sm text-lg border-2 ${
          isValid ? "border-gray-200" : "border-red-500"
        }`}
        keyboardType={props.type as KeyboardTypeOptions}
        placeholder={props.placeholder || "입력해주세요"}
        value={props.value}
        onChangeText={handleTextChange}
        autoFocus={true}
        maxLength={props.maxLength}
      />
      {error && <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text>}
    </View>
  );
}
