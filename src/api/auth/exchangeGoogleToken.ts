import { Config } from "@common";
import { Credentials } from "react-native-auth0";
import { auth0 } from "./auth0";

export const exchangeGoogleAccessToken = async (
    googleAccessToken: string
): Promise<Credentials | null> => {
    try {
        const result = await auth0.auth.exchangeNativeSocial({
            subjectToken: googleAccessToken,
            subjectTokenType: "urn:ietf:params:oauth:token-type:access_token",
            audience: Config.auth0.audience,
            scope: "openid profile email offline_access",
        });

        console.log("Token exchange result:", result);
        return result;
    } catch (error) {
        console.log("Error during token exchange:", error);
        return null;
    }
};
