import { icons } from "@/constants/icons";
import { View, Text, TouchableOpacity, Image } from "react-native";

const ListHeading = ({
  title,
  onPress,
  onPressCreate,
  actionText,
}: ListHeadingProps) => {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>

      <TouchableOpacity className="list-action" onPress={onPress}>
        <Text className="list-action-text">
          {actionText ? actionText : "Ver Todos"}
        </Text>
      </TouchableOpacity>
      {onPressCreate && (
        <TouchableOpacity className="list-action" onPress={onPressCreate}>
          <Text className="list-action-text">
            {actionText ? (
              actionText
            ) : (
              <Image source={icons.plus} className="home-add-icon" />
            )}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ListHeading;
