import {
  Account,
  Avatars,
  Client,
  ID,
  Query,
  Storage,
  TablesDB,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  platform: "com.lp.financas",
  databaseId: "6a5ea2ff001cb593d387",
  userTableId: "user",
  transactionsTableId: "transactions",
  subscriptionsTableId: "subscriptions",
  categoriesTableId: "categories",
  bucketId: "6a6be11900202babf4f6",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new TablesDB(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

// USER
export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create({
      userId: ID.unique(),
      email,
      password,
      name,
    });
    if (!newAccount) {
      throw new Error("Failed to create user account");
    }

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      rowId: newAccount.$id,
      data: { accountId: newAccount.$id, name, email, avatar: avatarUrl },
    });
  } catch (error) {
    throw new Error(("Error creating user: " + error) as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });
  } catch (error) {
    throw new Error(("Error signing in: " + error) as string);
  }
};

export const getCurrentUser = async () => {
  try {
    // const result = await account.deleteSessions();
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("No current user found");
    }

    const currentUserRow = await databases.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      rowId: currentAccount.$id,
    });
    if (!currentUserRow) throw new Error("No user data found for current user");
    return currentUserRow;
  } catch (error) {
    throw new Error(("Error getting current user: " + error) as string);
  }
};

export const signOut = async () => {
  try {
    await account.deleteSessions();
  } catch (error) {
    throw new Error(("Error signing out: " + error) as string);
  }
};

// SUBSCRIPTIONS
export const getSubscriptions = async ({
  accountId,
}: {
  accountId: string;
}) => {
  try {
    const subscriptions = await databases.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.subscriptionsTableId,
      queries: [Query.equal("accountId", accountId)],
    });

    return subscriptions;
  } catch (error) {
    throw new Error(("Error getting subscriptions: " + error) as string);
  }
};

export const createSubscription = async (
  subscription: Omit<Subscription, "$id">,
) => {
  try {
    const newSubscription = await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.subscriptionsTableId,
      rowId: ID.unique(),
      data: subscription,
    });

    return newSubscription;
  } catch (error) {
    throw new Error(("Error creating subscription: " + error) as string);
  }
};

// CATEGORIES
export const getCategories = async ({ accountId }: { accountId: string }) => {
  console.log("get categories accountId" + " " + accountId);
  try {
    const categories = await databases.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.categoriesTableId,
      queries: [Query.equal("accountId", accountId)],
    });
    return categories;
  } catch (error) {
    throw new Error(("Error getting categories: " + error) as string);
  }
};

export const createCategory = async (category: Omit<Categories, "$id">) => {
  try {
    const newCategory = await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.categoriesTableId,
      rowId: ID.unique(),
      data: category,
    });

    return newCategory;
  } catch (error) {
    throw new Error(("Error getting categories: " + error) as string);
  }
};

// STORAGE

export const getIconStorageUrl = async (iconName: string): Promise<any> => {
  try {
    const formattedName = iconName.toLowerCase().trim();

    // 1. Lista todos os arquivos presentes no Bucket de ícones
    const response = await storage.listFiles({
      bucketId: appwriteConfig.bucketId,
    });

    console.log("formatted", formattedName);
    console.log("response", response);

    // 2. Procura um arquivo cujo nome contenha a palavra informada
    const matchedFile = response.files.find((file) =>
      file.name.toLowerCase().includes(formattedName),
    );

    console.log("matched", matchedFile);

    if (matchedFile) {
      const url =
        `${appwriteConfig.endpoint}/storage/buckets/` +
        `${appwriteConfig.bucketId}/files/${matchedFile.$id}/view` +
        `?project=${appwriteConfig.projectId}`;

      return url;
    }
  } catch (error) {
    console.error("Erro ao buscar ícone no Appwrite Storage:", error);
  }

  // Retorna uma URL padrão de fallback caso não encontre ou dê erro
  return "https://fra.cloud.appwrite.io/v1/storage/buckets/6a6be11900202babf4f6/files/6a6c0c17003d01390b39/view?project=6a5ea09a003383b3dc55&mode=admin";
};
