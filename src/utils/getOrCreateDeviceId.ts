import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

/**
 * Using AsyncStorage ensures that if the app is
 * deleted and re-intalled, the device Id will be
 * different.
 *
 * This allows us to track users that have multiple
 * installs as the user will be attesting multiple times.
 *
 * Thus allowing us to adjust their risk metric.
 */
export async function getOrCreateDeviceId() {
    const INSTALLATION_ID_KEY = "did";

    // Try to get the installation ID from secure storage
    let did = await AsyncStorage.getItem(INSTALLATION_ID_KEY);

    // If there is no installation ID, create one and store it
    if (!did) {
        did = randomUUID();
        await AsyncStorage.setItem(INSTALLATION_ID_KEY, did);
    }

    return did;
}
