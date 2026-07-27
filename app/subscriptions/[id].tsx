import { Link, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>SubscriptionDetails: {id}</Text>
      <Link href="/index">Voltar</Link>
    </View>
  );
};

export default SubscriptionDetails;
