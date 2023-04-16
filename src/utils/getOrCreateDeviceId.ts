import { randomUUID } from "expo-crypto";
import { getSecureItem, setSecureItem } from "./secureStorage";

export async function getOrCreateDeviceId() {
    const INSTALLATION_ID_KEY = "did";

    // Try to get the installation ID from secure storage
    let did = await getSecureItem(INSTALLATION_ID_KEY);

    // If there is no installation ID, create one and store it
    if (!did) {
        did = randomUUID();
        await setSecureItem(INSTALLATION_ID_KEY, did);
    }

    return did;
}
