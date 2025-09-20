import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface TermsOfServiceProps {
  onAccept: () => void;
}

export default function TermsOfService({ onAccept }: TermsOfServiceProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
    }
  };

  return (
    <View className="flex-1 justify-center items-center py-20 px-4">
      <View className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
          서비스 이용약관
        </Text>

        <ScrollView className="h-80 mb-6 border border-gray-200 rounded-lg p-4">
          <Text className="text-sm text-gray-700 leading-6">
            <Text className="font-bold text-lg">제1조 (목적)</Text>
            {"\n"}이 약관은 Miniproj 서비스(이하 "서비스")의 이용과 관련하여
            회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로
            합니다.{"\n\n"}
            <Text className="font-bold text-lg">제2조 (정의)</Text>
            {"\n"}
            1. "서비스"란 식단 관리 및 영양 정보 제공을 위한 모바일
            애플리케이션을 의미합니다.{"\n"}
            2. "이용자"란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는
            회원 및 비회원을 의미합니다.{"\n"}
            3. "회원"이란 서비스에 개인정보를 제공하여 회원등록을 한 자로서,
            서비스의 정보를 지속적으로 제공받으며, 서비스를 계속적으로 이용할 수
            있는 자를 의미합니다.{"\n\n"}
            <Text className="font-bold text-lg">
              제3조 (약관의 효력 및 변경)
            </Text>
            {"\n"}
            1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게
            공지함으로써 효력이 발생합니다.{"\n"}
            2. 회사는 합리적인 사유가 발생할 경우에는 이 약관을 변경할 수
            있으며, 약관이 변경되는 경우 변경된 약관의 내용과 시행일을 정하여,
            시행일로부터 최소 7일 이전에 공지합니다.{"\n\n"}
            <Text className="font-bold text-lg">제4조 (서비스의 제공)</Text>
            {"\n"}
            1. 회사는 다음과 같은 업무를 수행합니다:{"\n"}- 식단 관리 서비스
            제공{"\n"}- 영양 정보 및 칼로리 계산 서비스{"\n"}- 개인 맞춤형 식단
            추천 서비스{"\n"}- 기타 회사가 정하는 업무{"\n\n"}
            <Text className="font-bold text-lg">제5조 (개인정보 보호)</Text>
            {"\n"}
            1. 회사는 이용자의 개인정보를 보호하기 위해 개인정보보호법 등 관련
            법령을 준수합니다.{"\n"}
            2. 회사는 이용자의 개인정보를 수집, 이용, 제공하는 경우에는 이용자의
            동의를 받습니다.{"\n\n"}
            <Text className="font-bold text-lg">제6조 (이용자의 의무)</Text>
            {"\n"}
            1. 이용자는 다음 행위를 하여서는 안 됩니다:{"\n"}- 신청 또는 변경시
            허위 내용의 등록{"\n"}- 타인의 정보 도용{"\n"}- 서비스에 게시된
            정보의 변경{"\n"}- 기타 불법적이거나 부당한 행위{"\n\n"}
            <Text className="font-bold text-lg">제7조 (서비스의 중단)</Text>
            {"\n"}
            1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의
            두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할
            수 있습니다.{"\n\n"}
            <Text className="font-bold text-lg">제8조 (손해배상)</Text>
            {"\n"}
            회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가
            발생하더라도 동 손해가 회사의 고의 또는 중대한 과실에 의한 경우를
            제외하고는 이에 대하여 책임을 부담하지 아니합니다.{"\n\n"}
            <Text className="font-bold text-lg">
              제9조 (준거법 및 관할법원)
            </Text>
            {"\n"}
            1. 이 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국의
            법을 적용합니다.{"\n"}
            2. 서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 회사의
            본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.{"\n\n"}
            <Text className="font-bold text-lg">부칙</Text>
            {"\n"}이 약관은 2025년 1월 1일부터 시행합니다.
          </Text>
        </ScrollView>

        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            className={`w-6 h-6 border-2 rounded mr-3 ${
              isChecked ? "bg-teal-500 border-teal-500" : "border-gray-300"
            }`}
          >
            {isChecked && (
              <View className="flex-1 items-center justify-center">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text className="text-sm text-gray-700 flex-1">
            위 이용약관에 동의합니다.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleAccept}
          className={`py-3 rounded ${
            isChecked ? "bg-teal-500" : "bg-gray-300"
          }`}
          disabled={!isChecked}
        >
          <Text className="text-white text-center font-semibold">
            약관에 동의하고 계속하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
