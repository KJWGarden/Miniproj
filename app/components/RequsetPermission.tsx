import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Text } from "@/components/ui/text";
import { Feather, FontAwesome, Octicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { useState } from "react";
import { Alert, View } from "react-native";

export function AlertDialogPreview() {
  const [open, setOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  // 권한 요청 함수들
  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("알림 권한 요청 실패:", error);
      return false;
    }
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("카메라 권한 요청 실패:", error);
      return false;
    }
  };

  const requestMediaLibraryPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("앨범 권한 요청 실패:", error);
      return false;
    }
  };

  // 순차적으로 권한 요청
  const requestAllPermissions = async () => {
    const results: {
      notification?: boolean;
      camera?: boolean;
      mediaLibrary?: boolean;
    } = {};

    // 1. 알림 권한
    console.log("알림 권한 요청...");
    results.notification = await requestNotificationPermission();
    console.log("알림 권한 결과:", results.notification);

    // 2. 카메라 권한
    console.log("카메라 권한 요청...");
    results.camera = await requestCameraPermission();
    console.log("카메라 권한 결과:", results.camera);

    // 3. 앨범 권한
    console.log("앨범 권한 요청...");
    results.mediaLibrary = await requestMediaLibraryPermission();
    console.log("앨범 권한 결과:", results.mediaLibrary);

    return results;
  };

  const handleConfirm = async () => {
    try {
      const permissionResults = await requestAllPermissions();

      const grantedPermissions = Object.entries(permissionResults).filter(
        ([_, granted]) => granted
      );
      const deniedPermissions = Object.entries(permissionResults).filter(
        ([_, granted]) => !granted
      );

      let message = "";
      if (grantedPermissions.length === 3) {
        message = "모든 권한이 허용되었습니다!";
      } else {
        message = `허용된 권한: ${grantedPermissions.map(([key]) => key).join(", ")}\n거부된 권한: ${deniedPermissions.map(([key]) => key).join(", ")}`;
      }

      Alert.alert("권한 요청 완료", message);

      handleOpenChange(false);
    } catch (error) {
      console.error("권한 요청 중 오류:", error);
      Alert.alert("오류", "권한 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            식단 기록과 추천을 위해 권한을 허용해주세요
          </AlertDialogTitle>
          <AlertDialogDescription>
            <View className="w-full flex flex-col">
              <View>
                <Octicons name="bell" size={24} color="white" />
              </View>
              <View className="w-full flex flex-col">
                <Text className="font-bold text-start">알림</Text>
                <Text className="text-sm text-start text-gray-600">
                  매일 식단 관리를 잊지 않도록 알림을 보내드려요.
                </Text>
              </View>
            </View>
          </AlertDialogDescription>
          <AlertDialogDescription>
            <View>
              <Feather name="camera" size={24} color="white" />
            </View>
            <View className="w-full flex flex-col">
              <Text className="font-bold text-start">카메라</Text>
              <Text className="text-sm text-start text-gray-600">
                AI가 음식 사진을 분석해 영양소 정보를 알려드려요.
              </Text>
            </View>
          </AlertDialogDescription>
          <AlertDialogDescription>
            <View>
              <FontAwesome name="picture-o" size={24} color="white" />
            </View>
            <View className="w-full flex flex-col">
              <Text className="font-bold text-start">앨범</Text>
              <Text className="text-sm text-start text-gray-600">
                식단 사진을 올리고 관리할 수 있어요.
              </Text>
            </View>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onPress={handleConfirm}>
            <Text>확인</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
