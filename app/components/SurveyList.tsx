import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function SurveyList(props: {
  title: string;
  options: string[];
  type: string;
  progress: number;
  onPress: (answer: string) => void;
  selectedAnswer?: string;
  allowMultiple?: boolean; // 중복 선택 허용 여부
}) {
  // 선택된 답변들을 배열로 파싱
  const getSelectedAnswers = (): string[] => {
    if (!props.selectedAnswer) return [];
    try {
      return JSON.parse(props.selectedAnswer);
    } catch {
      return [props.selectedAnswer];
    }
  };

  const selectedAnswers = getSelectedAnswers();

  const handleOptionPress = (option: string) => {
    if (!props.allowMultiple) {
      // 단일 선택 모드
      props.onPress(option);
      return;
    }

    // 중복 선택 모드
    let newAnswers: string[];

    if (option === "없음") {
      // "없음"을 선택하면 다른 모든 선택 해제
      newAnswers = ["없음"];
    } else {
      // 다른 옵션을 선택하면
      if (selectedAnswers.includes("없음")) {
        // "없음"이 선택되어 있으면 "없음" 제거하고 새 옵션 추가
        newAnswers = [option];
      } else {
        // "없음"이 없으면 기존 선택에 추가/제거
        if (selectedAnswers.includes(option)) {
          // 이미 선택된 옵션이면 제거
          newAnswers = selectedAnswers.filter((answer) => answer !== option);
        } else {
          // 새로운 옵션 추가
          newAnswers = [...selectedAnswers, option];
        }
      }
    }

    props.onPress(JSON.stringify(newAnswers));
  };

  return (
    <ScrollView className="h-full flex-col gap-2">
      {props.options.map((option) => (
        <TouchableOpacity
          key={option}
          className={`p-4 rounded-lg border-gray-200 ${
            selectedAnswers.includes(option)
              ? "bg-blue-100 border-blue-300"
              : "bg-white"
          }`}
          onPress={() => handleOptionPress(option)}
        >
          <Text
            className={`text-lg font-bold ${
              selectedAnswers.includes(option) ? "text-blue-600" : "text-black"
            }`}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
