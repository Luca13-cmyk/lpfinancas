import useAuthStore from "@/store/auth.store";
import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import { icons } from "@/constants/icons";
import { HOME_BALANCE } from "@/constants/data";
import { formatCurrency } from "@/lib/utils";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background p-5">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="home-header">
        <View className="home-user">
          <Image
            source={user?.avatar ? { uri: user.avatar } : images.avatar}
            className="home-avatar"
          />
          <Text className="home-user-name">Olá, {user?.name}!</Text>
        </View>

        <Image source={icons.add} className="home-add-icon" />
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Saldo disponível</Text>
        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
