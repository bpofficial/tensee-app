import Constants from "expo-constants";
import { getSecureItem, setSecureItem } from "../utils/secureStorage";
import { api } from "./constants";
import { withNetworkActivity } from "./withNetworkActivity";
import { InteractionManager } from "react-native";
import { createAppState } from "./createAppState";
import { RefreshAccessTokenFailedError } from "../errors/RefreshAccessTokenFailedError";

export async function refreshAccessToken() {
    try {
        console.log('Begin: refreshToken')
        const state = createAppState()

        const [refreshToken, sExpiry] = await Promise.all([
            getSecureItem(api.secureStorageKey + '_refreshToken'),
            getSecureItem(api.secureStorageKey + '_rtExpiresAt')
        ])

        const expiry = Number(sExpiry)
        if (!Number.isNaN(expiry) && (Date.now() / 1000) <= expiry) {
            if (refreshToken) {
                try {
                    console.log('refreshing token...')

                    const data = await withNetworkActivity(async () => {
                        const response = await fetch(`https://${Constants.expoConfig?.extra!.AUTH0_DOMAIN}/oauth/token`, {
                            method: 'POST',
                            body: JSON.stringify({
                                grant_type: 'refresh_token',
                                client_id: Constants.expoConfig?.extra!.AUTH0_CLIENT_ID,
                                refresh_token: refreshToken,
                                scope: `appstate:${state}`
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        return response.json()
                    })

                    InteractionManager.runAfterInteractions(async () => {
                        const nowInSeconds = Date.now() / 1000
                        const accessTokenExpiry = (nowInSeconds + data.expires_in).toString()
    
                        await Promise.all([
                            setSecureItem(api.secureStorageKey + '_refreshToken', data.access_token),
                            setSecureItem(api.secureStorageKey + '_rtExpiresAt', accessTokenExpiry)
                        ])
                    })
                } catch (err) {
                    console.log(err)
                    throw new RefreshAccessTokenFailedError()
                }
            }
        } else {
            console.log('Token not expired')
        }
    } catch (err) {
        console.log('Encountered an error...')
        console.log(err)
        throw new RefreshAccessTokenFailedError()
    }
}