import React from "react";
import { View } from "react-native";
import Svg, { Circle, Text } from "react-native-svg";

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 100
  color?: string;
  backgroundColor?: string;
  eatCalorie?: number;
}

export default function CircularProgress({
  size = 120,
  strokeWidth = 8,
  progress,
  color = "#3B82F6",
  backgroundColor = "#E5E7EB",
  eatCalorie = 0,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          fontSize="20"
          fill="#374151"
          fontWeight="bold"
        >
          {eatCalorie}
        </Text>
        <Text
          x={size / 2}
          y={size / 2 + 20}
          textAnchor="middle"
          fontSize="16"
          fill="#374151"
          fontWeight="500"
        >
          먹은 칼로리
        </Text>

        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}
