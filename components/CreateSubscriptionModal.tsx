import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import clsx from "clsx";

import useAppwrite from "@/lib/useAppwrite";
import { getCategories, getIconStorageUrl } from "@/lib/appwrite";
import { getRandomColor } from "@/lib/utils";
import useAuthStore from "@/store/auth.store";
// import {posthog} from "@/src/config/posthog";

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

type Frequency = "monthly" | "yearly";

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billingDay, setBillingDay] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [category, setCategory] = useState<any>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const { user } = useAuthStore();

  // Improved price validation
  const isValidPrice = () => {
    const trimmedPrice = price.trim();
    if (!trimmedPrice) return false;
    // Strict numeric pattern check
    if (!/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(trimmedPrice)) return false;
    const numValue = Number(trimmedPrice);
    return Number.isFinite(numValue) && numValue > 0;
  };

  const {
    data: categories,
    refetch,
    loading,
  } = useAppwrite({
    fn: getCategories,
    params: { accountId: user!.$id },
  });

  const isValidForm =
    name.trim() !== "" &&
    isValidPrice() &&
    category !== "" &&
    billingDay !== "";

  const handleSubscriptionSubmit = async () => {
    if (!isValidForm) return;

    setIsloading(true);

    const priceValue = Number(price.trim());
    const subscriptionName = name.trim();

    const iconUrl = await getIconStorageUrl(subscriptionName);

    const newSubscription: Subscription = {
      $id: "", // This will be set by the database
      name: subscriptionName,
      amount: priceValue,
      accountId: user?.$id,

      frequency,
      categories: category,
      status: "active",

      icon: iconUrl,
      billingDay,
      color: getRandomColor("subscription"),
    };

    onSubmit(newSubscription);

    // posthog.capture('subscription_created', {
    //   subscription_name: name.trim(),
    //   subscription_price: priceValue,
    //   subscription_frequency: frequency,
    //   subscription_category: category,
    // })

    setIsloading(false);

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("monthly");
    setCategory("Other");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <Pressable className="modal-overlay" onPress={handleClose}>
          <Pressable
            className="modal-container"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="modal-header">
              <Text className="modal-title">Nova mensalidade</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              className="p-5"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
            >
              <View className="auth-field">
                <Text className="auth-label">Nome</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Nome da mensalidade"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Preço</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0.00"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View className="auth-field">
                <Text className="auth-label">Dia vencimento</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Coloque entre os dias 1-31"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={billingDay}
                  onChangeText={setBillingDay}
                  keyboardType="numeric"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequência</Text>
                <View className="picker-row">
                  <Pressable
                    className={clsx(
                      "picker-option",
                      frequency === "monthly" && "picker-option-active",
                    )}
                    onPress={() => setFrequency("monthly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "monthly" && "picker-option-text-active",
                      )}
                    >
                      Mensal
                    </Text>
                  </Pressable>
                  <Pressable
                    className={clsx(
                      "picker-option",
                      frequency === "yearly" && "picker-option-active",
                    )}
                    onPress={() => setFrequency("yearly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "yearly" && "picker-option-text-active",
                      )}
                    >
                      Anual
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Categoria</Text>
                <View className="category-scroll">
                  {categories?.rows?.map((cat) => (
                    <Pressable
                      key={cat.$id}
                      className={clsx(
                        "category-chip",
                        category === cat.$id && "category-chip-active",
                      )}
                      onPress={() => setCategory(cat.$id)}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === cat.$id && "category-chip-text-active",
                        )}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  !isValidForm && "auth-button-disabled",
                )}
                onPress={handleSubscriptionSubmit}
                disabled={!isValidForm || isLoading}
              >
                <Text className="auth-button-text">
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    "Finalizar"
                  )}
                </Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
