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
        clientId: "938879340574098",
    },
    api: {
        apiUrl: "http://192.168.1.8:4000/local",
    },
};
