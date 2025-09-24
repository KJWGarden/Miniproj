import { useState } from "react";
import { Text, View } from "react-native";
import OftenButton from "./OftenButton";

export default function SurveyOften(props: {
  onPress: (answer: string) => void;
  selectedAnswer?: string;
}) {
  const [morningAnswer, setMorningAnswer] = useState<string>("");
  const [lunchAnswer, setLunchAnswer] = useState<string>("");
  const [dinnerAnswer, setDinnerAnswer] = useState<string>("");

  const handleMorningPress = (answer: string) => {
    setMorningAnswer(answer);
    // 모든 답변이 선택되었을 때만 부모에게 전달
    const newAnswers = {
      morning: answer,
      lunch: lunchAnswer,
      dinner: dinnerAnswer,
    };
    props.onPress(JSON.stringify(newAnswers));
  };

  const handleLunchPress = (answer: string) => {
    setLunchAnswer(answer);
    // 모든 답변이 선택되었을 때만 부모에게 전달
    const newAnswers = {
      morning: morningAnswer,
      lunch: answer,
      dinner: dinnerAnswer,
    };
    props.onPress(JSON.stringify(newAnswers));
  };

  const handleDinnerPress = (answer: string) => {
    setDinnerAnswer(answer);
    // 모든 답변이 선택되었을 때만 부모에게 전달
    const newAnswers = {
      morning: morningAnswer,
      lunch: lunchAnswer,
      dinner: answer,
    };
    props.onPress(JSON.stringify(newAnswers));
  };

  return (
    <View>
      <View>
        <Text className="ml-4 text-xl font-bold">아침</Text>
        <View>
          <OftenButton
            onPress={handleMorningPress}
            selectedAnswer={morningAnswer}
          />
        </View>
      </View>
      <View>
        <Text className="ml-4 text-xl font-bold">점심</Text>
        <View>
          <OftenButton
            onPress={handleLunchPress}
            selectedAnswer={lunchAnswer}
          />
        </View>
      </View>
      <View>
        <Text className="ml-4 text-xl font-bold">저녁</Text>
        <View>
          <OftenButton
            onPress={handleDinnerPress}
            selectedAnswer={dinnerAnswer}
          />
        </View>
      </View>
    </View>
  );
}
