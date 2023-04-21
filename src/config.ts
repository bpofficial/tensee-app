/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Constants from "expo-constants";

export const Config = {
    auth0: {
        autoLogoutAfter: 60, // 300 seconds | 5 minutes, has to be less than Auth0 config value of 12 hours.
        refreshTokenLifetime: 10368000, // 4 months in seconds, set in Auth0
        domain: Constants.expoConfig?.extra!.AUTH0_DOMAIN,
        clientId: Constants.expoConfig?.extra!.AUTH0_CLIENT_ID,
        audience: Constants.expoConfig?.extra!.AUTH0_AUDIENCE,
        secureStorageKey: "auth0_credentials",
    },
    facebook: {
        clientId: Constants.expoConfig?.extra!.FACEBOOK_CLIENT_ID,
    },
    google: {
        androidClientId: Constants.expoConfig?.extra!.GOOGLE_CLIENT_ID_ANDROID,
        iosClientId: Constants.expoConfig?.extra!.GOOGLE_CLIENT_ID_IOS,
    },
    api: {
        apiUrl: Constants.expoConfig?.extra!.API_URL,
    },
};
