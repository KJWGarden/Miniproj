import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { foodAnalysisApi } from "../../utils/api";
import { StorageService } from "../../utils/storage";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  foodAnalysis?: {
    food_name: string;
    youtube_link: string;
    ingredients: string[];
    recipe: string[];
  };
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 음식명을 입력하면 재료와 레시피 정보를 알려드릴게요. 어떤 음식을 알고 싶으신가요?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputText.trim();
    setInputText("");
    setIsTyping(true);

    try {
      // 음식 분석 API 호출
      const token = await StorageService.getAuthToken();

      if (!token) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "로그인이 필요합니다. 먼저 로그인해주세요.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
        return;
      }

      console.log("음식 분석 요청:", {
        userInput,
        token: token ? `${token.substring(0, 20)}...` : "토큰 없음",
      });

      const response = await foodAnalysisApi.analyzeFoodByName(
        userInput,
        token
      );

      console.log("음식 분석 응답:", response);

      if (response.success && response.data) {
        // analyzed_foods 배열에서 첫 번째 음식 정보 사용
        const analyzedFoods = response.data.analyzed_foods;

        if (analyzedFoods && analyzedFoods.length > 0) {
          const foodData = analyzedFoods[0];
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: `${foodData.food_name}에 대한 정보입니다.`,
            isUser: false,
            timestamp: new Date(),
            foodAnalysis: foodData,
          };
          setMessages((prev) => [...prev, aiResponse]);
        } else {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `"${userInput}"에 대한 정보를 찾을 수 없습니다.`,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `"${userInput}"에 대한 정보를 찾을 수 없습니다. 다른 음식명을 시도해보세요.`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("음식 분석 오류:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "음식 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Input - 상단 고정 */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center space-x-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 bg-gray-50"
            placeholder="음식명을 입력하세요 (예: 김치찌개, 비빔밥, 파스타...)"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            style={{
              fontSize: 16,
              maxHeight: 100,
            }}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() && !isTyping ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Feather
              name="send"
              size={20}
              color={inputText.trim() && !isTyping ? "white" : "gray"}
            />
          </Pressable>
        </View>
      </View>

      {/* Messages - 하단에서 시작 */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          paddingBottom: 150,
        }}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.isUser ? "items-end" : "items-start"}`}
          >
            <View
              className={`max-w-[90%] px-4 py-3 rounded-2xl ${
                message.isUser
                  ? "bg-blue-500 rounded-br-md"
                  : "bg-white rounded-bl-md border border-gray-200"
              }`}
            >
              <Text
                className={`text-base ${
                  message.isUser ? "text-white" : "text-gray-800"
                }`}
              >
                {message.text}
              </Text>

              {/* 음식 분석 결과 표시 */}
              {message.foodAnalysis && (
                <View className="mt-3 pt-3 border-t border-gray-200">
                  <Text className="text-lg font-bold text-gray-800 mb-2">
                    {message.foodAnalysis.food_name || "음식 정보"}
                  </Text>

                  {/* 유튜브 링크 */}
                  {message.foodAnalysis.youtube_link && (
                    <View className="mb-3">
                      <Text className="text-sm font-semibold text-gray-700 mb-1">
                        요리 영상
                      </Text>
                      <Text
                        className="text-sm text-blue-600 underline"
                        onPress={() => {
                          // 유튜브 링크 열기
                          Linking.openURL(
                            message.foodAnalysis.youtube_link
                          ).catch((err) => {
                            console.error("링크 열기 실패:", err);
                          });
                        }}
                      >
                        📺 유튜브에서 요리법 보기
                      </Text>
                    </View>
                  )}

                  {/* 재료 정보 */}
                  {message.foodAnalysis.ingredients &&
                    message.foodAnalysis.ingredients.length > 0 && (
                      <View className="mb-3">
                        <Text className="text-sm font-semibold text-gray-700 mb-1">
                          재료
                        </Text>
                        {message.foodAnalysis.ingredients.map(
                          (ingredient, index) => (
                            <Text key={index} className="text-sm text-gray-600">
                              • {ingredient}
                            </Text>
                          )
                        )}
                      </View>
                    )}

                  {/* 레시피 정보 */}
                  {message.foodAnalysis.recipe &&
                    message.foodAnalysis.recipe.length > 0 && (
                      <View className="mb-3">
                        <Text className="text-sm font-semibold text-gray-700 mb-1">
                          레시피
                        </Text>
                        {message.foodAnalysis.recipe.map((step, index) => (
                          <Text
                            key={index}
                            className="text-sm text-gray-600 mb-1"
                          >
                            {index + 1}. {step}
                          </Text>
                        ))}
                      </View>
                    )}
                </View>
              )}

              <Text
                className={`text-xs mt-1 ${
                  message.isUser ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <View className="mb-4 items-start">
            <View className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md">
              <Text className="text-gray-500">
                AI가 답변을 작성 중입니다...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
