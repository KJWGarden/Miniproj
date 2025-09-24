import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  progress: number; // 0-100 사이의 값
  color?: string; // 선택적 색상
}

const ProgressBar = ({ progress, color = "bg-blue-500" }: ProgressBarProps) => {
  // progress 값을 0-100 사이로 제한
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View className="w-full">
      <View className="h-2 w-full rounded-full bg-gray-200 overflow-hidden shadow-sm">
        <View
          className={`h-full rounded-full ${color}`}
          style={{ width: `${clampedProgress}%` }}
        ></View>
      </View>
    </View>
  );
};

export default ProgressBar;
