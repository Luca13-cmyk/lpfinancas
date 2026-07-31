import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "@/lib/utils";
import clsx from "clsx";

const SubscriptionCard = ({
  name,
  amount,
  accountId,
  icon,
  billingDay,
  color,
  categories,
  frequency,
  status,
  expanded,

  onPress,
  onLongPress,
}: SubscriptionCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <View className="sub-head">
        <View className="sub-main">
          <Image source={{ uri: icon }} className="sub-icon" />
          <View className="sub-copy">
            <Text numberOfLines={1} className="sub-title">
              {name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
              {categories?.trim() ||
                frequency?.trim() ||
                (billingDay ? formatSubscriptionDateTime(billingDay) : "")}
            </Text>
          </View>
        </View>

        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(amount!)}</Text>
          <Text className="sub-billing">{billingDay}</Text>
        </View>
      </View>

      {expanded && (
        <View className="sub-bdy">
          <View className="sub-details">
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Categoria:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {(categories?.trim() || frequency?.trim()) ?? "Not provided"}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Frequência:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {frequency ? frequency : "Not provided"}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Dia de renovação:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {billingDay ? billingDay : "Not provided"}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Status:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {status ? formatStatusLabel(status) : "Not provided"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
};
export default SubscriptionCard;
