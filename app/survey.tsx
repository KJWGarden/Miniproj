import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardTypeOptions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProgressBar from "./components/ProgressBar";
import SurveyInput from "./components/SurveyInput";
import SurveyList from "./components/SurveyList";
import SurveyOften from "./components/SurveyOften";

interface SurveyQuestion {
  question: string;
  type: "radio" | "input" | "often";
  Inputtype?: KeyboardTypeOptions;
  options?: string[];
  progress: number;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  validationType?: "birthdate" | "numeric" | "text";
}

export default function Survey() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isInputValid, setIsInputValid] = useState<boolean>(true);

  const surveyQuestions: SurveyQuestion[] = [
    {
      question: "성별을 선택해주세요",
      options: ["남성", "여성"],
      type: "radio",
      progress: 0,
    },
    {
      question: "생년월일을 알려주세요",
      type: "input",
      Inputtype: "name-phone-pad",
      progress: 20,
      minLength: 8, // YYYYMMDD 형식
      maxLength: 8,
      placeholder: "예: 19900101",
      validationType: "birthdate",
    },
    {
      question: "키를 알려주세요",
      type: "input",
      Inputtype: "numeric",
      progress: 30,
      minLength: 2, // 최소 2자리
      maxLength: 3,
      placeholder: "예: 170",
      validationType: "numeric",
    },
    {
      question: "몸무게를 알려주세요",
      type: "input",
      Inputtype: "numeric",
      progress: 40,
      minLength: 2, // 최소 2자리
      maxLength: 3,
      placeholder: "예: 65",
      validationType: "numeric",
    },
    {
      question: "운동 빈도를 선택해주세요",
      type: "radio",
      options: ["주 5회 이상", "주 3-4회", "주 1-2회", "거의 안함"],
      progress: 50,
    },
    {
      question: "평소 식사는 어떻게 하시나요?",
      type: "often",
      progress: 70,
    },
    {
      question: "알레르기 음식이 있나요?",
      type: "radio",
      options: ["없음", "견과류", "유제품", "해산물", "기타"],
      progress: 90,
    },
  ];

  const currentQuestion = surveyQuestions[currentStep];
  const progress = currentQuestion.progress;

  // 현재 단계의 답변이 있는지 확인
  const hasAnswer = () => {
    const answer = answers[currentStep];
    if (!answer || answer.trim().length === 0) return false;

    // often 타입인 경우 JSON 파싱하여 모든 식사 시간이 선택되었는지 확인
    if (currentQuestion.type === "often") {
      try {
        const mealAnswers = JSON.parse(answer);
        return mealAnswers.morning && mealAnswers.lunch && mealAnswers.dinner;
      } catch {
        return false;
      }
    }

    // radio 타입에서 중복 선택이 가능한 경우 (알레르기 질문)
    if (
      currentQuestion.type === "radio" &&
      currentQuestion.question.includes("알레르기")
    ) {
      try {
        const selectedAnswers = JSON.parse(answer);
        return Array.isArray(selectedAnswers) && selectedAnswers.length > 0;
      } catch {
        return answer.trim().length > 0;
      }
    }

    return answer.trim().length > 0;
  };

  // 다음 버튼 활성화 조건
  const canProceed = () => {
    if (!hasAnswer()) return false;

    // 마지막 단계인 경우 완료 버튼 활성화
    if (currentStep === surveyQuestions.length - 1) return true;

    // input 타입인 경우 validation 상태도 확인
    if (currentQuestion.type === "input") {
      return isInputValid;
    }

    // often 타입인 경우 모든 식사 시간이 선택되었는지 확인
    if (currentQuestion.type === "often") {
      try {
        const mealAnswers = JSON.parse(answers[currentStep] || "{}");
        return mealAnswers.morning && mealAnswers.lunch && mealAnswers.dinner;
      } catch {
        return false;
      }
    }

    return true;
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep]: answer,
    }));
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsInputValid(isValid);
  };

  // 단계가 변경될 때마다 validation 상태 초기화
  useEffect(() => {
    setIsInputValid(true);
  }, [currentStep]);

  const handleNext = () => {
    if (canProceed()) {
      if (currentStep === surveyQuestions.length - 1) {
        // 마지막 단계에서 완료 버튼을 누르면 홈으로 이동
        router.replace("/(tabs)/home");
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View className="flex-1 justify-start items-center bg-gray-100 p-8">
      <View className="w-full max-w-sm">
        <Text className="text-lg font-bold text-center mb-4">설문 진행률</Text>
        <ProgressBar progress={progress} color="bg-green-500" />
        <Text className="text-sm text-gray-600 text-center mt-2">
          {progress}% 완료
        </Text>

        <View className="h-full w-full flex justify-start items-start py-8">
          <Text className="text-2xl font-bold text-center mb-8">
            {currentQuestion.question}
          </Text>

          {currentQuestion.type === "radio" && (
            <View className="h-1/2 w-full space-y-4">
              <SurveyList
                title={currentQuestion.question}
                options={currentQuestion.options ?? []}
                type={currentQuestion.type}
                progress={currentQuestion.progress}
                onPress={handleAnswerSelect}
                selectedAnswer={answers[currentStep]}
                allowMultiple={currentQuestion.question.includes("알레르기")}
              />
            </View>
          )}

          {currentQuestion.type === "input" && (
            <View className="w-full space-y-4">
              <SurveyInput
                type={currentQuestion.Inputtype as KeyboardTypeOptions}
                placeholder={currentQuestion.placeholder}
                value={answers[currentStep] || ""}
                onChangeText={handleAnswerSelect}
                minLength={currentQuestion.minLength}
                maxLength={currentQuestion.maxLength}
                validationType={currentQuestion.validationType}
                onValidationChange={handleValidationChange}
              />
            </View>
          )}

          {currentQuestion.type === "often" && (
            <View className="w-full space-y-4">
              <SurveyOften
                onPress={handleAnswerSelect}
                selectedAnswer={answers[currentStep]}
              />
            </View>
          )}

          <View className="flex-row justify-between mt-8 w-full">
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg ${
                currentStep === 0 ? "bg-gray-300" : "bg-gray-500"
              }`}
            >
              <Text className="text-white font-bold">이전</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-lg ${
                !canProceed() ? "bg-gray-300" : "bg-blue-500"
              }`}
            >
              <Text className="text-white font-bold">
                {currentStep === surveyQuestions.length - 1 ? "완료" : "다음"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
