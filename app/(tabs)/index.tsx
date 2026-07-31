import useAuthStore from "@/store/auth.store";

import { FlatList, Image, Pressable, Text, View } from "react-native";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";

import { formatCurrency, getRandomColor } from "@/lib/utils";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import SubscriptionCard from "@/components/SubscriptionCard";
import useAppwrite from "@/lib/useAppwrite";
import {
  createSubscription,
  getCategories,
  getSubscriptions,
} from "@/lib/appwrite";
import { icons } from "@/constants/icons";

import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import clsx from "clsx";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useAuthStore();
  const [isModalSubscriptionVisible, setIsModalSubscriptionVisible] =
    useState(false);
  const [isModalTransactionVisible, setIsModalTransactionVisible] =
    useState(false);
  const [isCreatingSubscription, setIscreatingSubscription] =
    useState<boolean>(false);

  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const {
    data: subscriptions,
    refetch,
    loading,
  } = useAppwrite({
    fn: getSubscriptions,
    params: { accountId: user!.$id },
  });

  const {
    data: categories,
    refetch: refetchCategories,
    loading: loadingCategories,
  } = useAppwrite({
    fn: getCategories,
    params: { accountId: user!.$id },
  });

  const upcomingSubscriptions = useMemo(() => {
    const now = dayjs();
    const nextWeek = now.add(7, "days");

    const daysLefts = subscriptions?.rows
      ?.filter((sub) => {
        if (sub.status !== "active" || !sub.billingDay) return false;

        // Garante que o dia é um número (ex: 5)
        const dayNumber = Number(sub.billingDay);

        // Cria a data no mês e ano atuais com o dia do vencimento (ex: 2026-07-05)
        let dueDate = now.date(dayNumber);

        // Se o dia já passou no mês atual, ajusta a cobrança para o próximo mês
        if (dueDate.isBefore(now, "day")) {
          dueDate = dueDate.add(1, "month");
        }

        return (
          (dueDate.isSame(now, "day") || dueDate.isAfter(now)) &&
          dueDate.isBefore(nextWeek)
        );
      })
      .sort((a, b) => Number(a.billingDay) - Number(b.billingDay));

    return daysLefts || [];
  }, [subscriptions]);

  const handleSubscriptionPress = (item: Subscription) => {
    console.log(item.$id);
    const isExpanding = expandedSubscriptionId !== item.$id;
    setExpandedSubscriptionId((currentId) =>
      currentId === item.$id ? null : item.$id,
    );
    // posthog.capture(isExpanding ? 'subscription_expanded' : 'subscription_collapsed', {
    //     subscription_name: item.name,
    //     subscription_id: item.id,
    // });
  };

  const handleSubscriptionOnLongPress = (item: Subscription) => {
    console.log(item.$id);
  };

  const handleCreateSubscription = async (
    newData: Omit<Subscription, "$id">,
  ) => {
    console.log("Creating new subscription:", newData);
    setIscreatingSubscription(true);
    try {
      // 1. Cria o registro no Appwrite
      await createSubscription(newData);

      // 2. Recarrega a lista chamando a função de refetch
      if (refetch) {
        await refetch();
      }

      // 3. Fecha o modal/formulário se necessário
      // onClose();
    } catch (error) {
      console.error("Erro ao criar assinatura:", error);
    } finally {
      setIscreatingSubscription(false);
    }
  };

  // comentario teste

  // console.log(subscriptions?.rows);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={user?.avatar ? { uri: user.avatar } : images.avatar}
                  className="home-avatar"
                />
                <Text className="home-user-name">{user?.name}</Text>
              </View>
              <View className="home-add-row">
                <Pressable onPress={() => setIsModalSubscriptionVisible(true)}>
                  <Image source={icons.subs} className="home-add-icon" />
                </Pressable>
                <Pressable onPress={() => setIsModalTransactionVisible(true)}>
                  <Image source={icons.transaction} className="home-add-icon" />
                </Pressable>

                {/* <Pressable onPress={() => setIsModalSubscriptionVisible(true)}>
                <Image source={icons.transaction} className="home-add-icon" />
              </Pressable> */}
              </View>
            </View>

            {/* <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(user?.balance || 0)}
                </Text>
                <View className="home-balance-date">
                  <Pressable
                    onPress={() => setIsModalSubscriptionVisible(true)}
                  >
                    <Image
                      source={icons.add}
                      className="size-8 rounded-full border-2"
                    />
                  </Pressable>
                </View>
              </View>
            </View> */}

            <View className="mb-5">
              <ListHeading title="Categorias" onPressCreate={() => {}} />
              <View className="auth-field">
                <View className="category-scroll">
                  {categories?.rows?.slice(0, 7).map((cat) => (
                    <Pressable
                      key={cat.$id}
                      className={clsx("category-chip")}
                      onPress={() => {}}
                    >
                      <Text className={clsx("category-chip-text")}>
                        {cat.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <ListHeading title="Chegando" />

              <FlatList
                data={upcomingSubscriptions as unknown as Subscription[]}
                renderItem={({ item }: { item: Subscription }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    Sem assinaturas para vir ainda.
                  </Text>
                }
              />
            </View>

            <ListHeading title="Assinaturas" />
          </>
        )}
        data={
          subscriptions?.rows
            ? (subscriptions.rows as unknown as Subscription[])
            : null
        }
        keyExtractor={(item) => item.$id}
        renderItem={({ item }: { item: Subscription }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.$id}
            onPress={() => handleSubscriptionPress(item)}
            onLongPress={() => handleSubscriptionOnLongPress(item)}
            color={item.color || undefined}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">Sem assinaturas ainda</Text>
        }
        contentContainerClassName="pb-30"
      />

      <CreateSubscriptionModal
        visible={isModalSubscriptionVisible}
        onClose={() => setIsModalSubscriptionVisible(false)}
        onSubmit={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}
