import { View, Text, Image } from "react-native";
import React from "react";

const UpcomingSubscriptionCard = ({
  name,
  amount,
  billingDay,
  icon,
}: Subscription) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={{ uri: icon }} className="upcoming-icon" />
        <View>
          <Text
            className="upcoming-price"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            R$ {Math.round(amount!)}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {/* {daysLeft > 1 ? `${daysLeft} days left` : "Last day"} */}
            Dia: {billingDay}
          </Text>
        </View>
      </View>

      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};
export default UpcomingSubscriptionCard;
