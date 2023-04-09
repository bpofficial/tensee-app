/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Constants from "expo-constants";

export const Config = {
    auth0: {
        domain: Constants.expoConfig?.extra!.AUTH0_DOMAIN,
        clientId: Constants.expoConfig?.extra!.AUTH0_CLIENT_ID,
        audience: Constants.expoConfig?.extra!.AUTH0_AUDIENCE
    }
}