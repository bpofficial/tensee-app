import { Config, Logger, startChildSpan } from "@common";
import { Credentials } from "react-native-auth0";
import { auth0 } from "./auth0";

export const exchangeAppleAuthorizationCode = async (
    authorizationCode: string
): Promise<Credentials | null> => {
    const span = startChildSpan({
        name: "Exchange Apple Code",
        op: "exchange",
    });

    try {
        const result = await auth0.auth.exchangeNativeSocial({
            scope: "openid profile email offline_access",
            audience: Config.auth0.audience,
            subjectToken: authorizationCode,
            subjectTokenType:
                "http://auth0.com/oauth/token-type/apple-authz-code",
        });

        span.finish();
        return result;
    } catch (error) {
        Logger.captureException(error, span);
    }

    span.finish();
    return null;
};
