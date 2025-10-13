import { authService, UserProfile } from "@/services/authService";
import { StorageService } from "@/utils/storage";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function MyPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = await StorageService.getAuthToken();
      if (token) {
        const response = await authService.getUserProfile(token);
        if (response.success && response.data) {
          setUserProfile(response.data);
        }
      }
    };
    fetchUserProfile();
  }, []);

  return <View>MyPage</View>;
}
