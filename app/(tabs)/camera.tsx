import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { imageUploadApi } from "../../utils/api";
import { StorageService } from "../../utils/storage";

export default function CameraScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<CameraMode>("picture");
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        setIsSaving(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        console.log("Photo taken:", photo.uri);

        // 미디어 라이브러리 권한 확인
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "권한 필요",
            "사진을 저장하려면 갤러리 접근 권한이 필요합니다."
          );
          return;
        }

        // 갤러리에 사진 저장
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        console.log("Photo saved to gallery:", asset.id);

        // 이미지 서버 저장
        const token = await StorageService.getAuthToken();
        let serverImageUrl = photo.uri; // 기본값은 로컬 URI

        if (token) {
          console.log("이미지 서버 저장 시작...");

          const uploadResponse = await imageUploadApi.uploadEatenFoodImage(
            photo.uri,
            token
          );

          if (uploadResponse.success && uploadResponse.data) {
            console.log(
              "이미지 서버 저장 성공:",
              uploadResponse.data.image_url
            );
            serverImageUrl = uploadResponse.data.image_url;
          } else {
            console.error("이미지 서버 저장 실패:", uploadResponse.error);
            Alert.alert(
              "경고",
              "서버 저장에 실패했지만 로컬 저장은 완료되었습니다."
            );
          }
        } else {
          console.log("토큰이 없어서 서버 저장을 건너뜁니다.");
        }

        // 앱 내부에 사진 정보 저장
        const photoInfo = {
          id: asset.id,
          uri: photo.uri,
          serverImageUrl: serverImageUrl,
          filename: asset.filename,
          width: asset.width,
          height: asset.height,
          creationTime: asset.creationTime,
          mediaType: asset.mediaType,
          savedAt: new Date().toISOString(),
        };

        // 기존 사진 목록 가져오기
        const existingPhotos = (await StorageService.getUserEatData()) || [];

        // 새 사진 추가
        const updatedPhotos = [...existingPhotos, photoInfo];

        // 사진 목록 저장
        await StorageService.setUserEatData(updatedPhotos);

        Alert.alert("성공", "사진이 갤러리에 저장되었습니다!", [
          {
            text: "확인",
            onPress: () => {
              // 홈 화면으로 이동
              router.push("/(tabs)/home");
            },
          },
        ]);
        console.log("Photo info saved:", photoInfo);
      } catch (error) {
        console.error("사진 저장 실패:", error);
        Alert.alert("오류", "사진 저장에 실패했습니다.");
      } finally {
        setIsSaving(false);
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode={mode}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={takePicture}
          disabled={isSaving}
        >
          <Text style={styles.text}>
            {isSaving ? "저장 중..." : "사진 촬영"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={toggleCameraFacing}
          disabled={isSaving}
        >
          <Text style={styles.text}>카메라 전환</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerRight: {
    width: 40,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "100%",
    paddingVertical: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
