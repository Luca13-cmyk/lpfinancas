import { icons } from "@/constants/icons";
import useAuthStore from "@/store/auth.store";
import { Redirect, Slot, Stack } from "expo-router";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  View,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView";

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Redirect href="/" />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="bg-white h-full"
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="w-full relative"
          style={{ height: Dimensions.get("screen").height / 2.25 }}
        >
          {/* <ImageBackground source={} className="size-full rounded-b-lg" resizeMode="stretch"/> */}
          <Image
            source={icons.logo}
            className="self-center size-28 absolute -bottom-1 z-10"
          />
        </View>
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
