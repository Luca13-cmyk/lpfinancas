import { View, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import CustomButton from "@/components/CustomButton";
import { signOut } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";

const SafeAreaView = styled(RNSafeAreaView);
const settings = () => {
  const { fetchAuthenticatedUser } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <CustomButton
        onPress={async () => {
          await signOut();
          await fetchAuthenticatedUser();
        }}
        title="Sair"
      />
    </SafeAreaView>
  );
};

export default settings;
