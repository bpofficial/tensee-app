import * as SecureStore from "expo-secure-store";

export async function setSecureItem(key: string, value: string | null) {
    if (value === null) {
        await SecureStore.deleteItemAsync(key);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
}

export async function getSecureItem(key: string) {
    const result = await SecureStore.getItemAsync(key);
    return result ?? null;
}
