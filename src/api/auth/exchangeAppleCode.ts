import { Config, withSpan } from "@common";
import { Credentials } from "react-native-auth0";
import { auth0 } from "./auth0";

export const exchangeAppleAuthorizationCode = async (
    authorizationCode: string
): Promise<Credentials | null> => {
    try {
        const result = await withSpan(
            {
                op: "exchange",
                name: "Auth0 Exchange",
                description: "Exchange Apple auth code for Auth0 token",
            },
            () =>
                auth0.auth.exchangeNativeSocial({
                    scope: "openid profile email offline_access",
                    audience: Config.auth0.audience,
                    subjectToken: authorizationCode,
                    subjectTokenType:
                        "http://auth0.com/oauth/token-type/apple-authz-code",
                })
        );
        return result;
    } catch (error) {
        console.error(error);
    }
    return null;
};
