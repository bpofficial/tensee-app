import * as SecureStore from 'expo-secure-store';

export async function setSecureItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

export async function getSecureItem(key: string) {
    const result = await SecureStore.getItemAsync(key);
    return result ?? null
}