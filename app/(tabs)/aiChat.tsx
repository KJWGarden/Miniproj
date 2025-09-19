import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 무엇을 도와드릴까요?",
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
    setInputText("");
    setIsTyping(true);

    // AI 응답 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `"${inputText}"에 대한 답변입니다. 실제 AI API를 연결하면 더 정확한 답변을 받을 수 있습니다.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
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
            placeholder="메시지를 입력하세요..."
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
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
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
