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

import useAuthStore from "@/store/auth.store";

interface CreateCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (category: Categories) => void;
}

type categoryType = "expense" | "income";

const CreateCategoryModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateCategoryModalProps) => {
  const [name, setName] = useState("");

  const [categoryType, setCategoryType] = useState<categoryType>("expense");

  const [isLoading, setIsloading] = useState<boolean>(false);
  const { user } = useAuthStore();

  const isValidForm = name.trim() !== "" && categoryType !== null;

  const handleCategorySubmit = async () => {
    if (!isValidForm) return;

    setIsloading(true);

    const categoryName = name.trim();

    const newCategory: Categories = {
      $id: "", // This will be set by the database
      name: categoryName,
      accountId: user?.$id,

      type: categoryType,
    };

    onSubmit(newCategory);

    setIsloading(false);

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setCategoryType("expense");
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
              <Text className="modal-title">Nova categoria</Text>
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
                  placeholder="Nome da categoria"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Tipo</Text>
                <View className="picker-row">
                  <Pressable
                    className={clsx(
                      "picker-option",
                      categoryType === "expense" && "picker-option-active",
                    )}
                    onPress={() => setCategoryType("expense")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        categoryType === "expense" &&
                          "picker-option-text-active",
                      )}
                    >
                      Despesa
                    </Text>
                  </Pressable>
                  <Pressable
                    className={clsx(
                      "picker-option",
                      categoryType === "income" && "picker-option-active",
                    )}
                    onPress={() => setCategoryType("income")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        categoryType === "income" &&
                          "picker-option-text-active",
                      )}
                    >
                      Receita
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  !isValidForm && "auth-button-disabled",
                )}
                onPress={handleCategorySubmit}
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

export default CreateCategoryModal;
