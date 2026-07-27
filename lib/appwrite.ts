import { Account, Avatars, Client, ID, TablesDB } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  platform: "com.lp.financas",
  databaseId: "6a5ea2ff001cb593d387",
  userTableId: "user",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new TablesDB(client);
export const avatars = new Avatars(client);

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
