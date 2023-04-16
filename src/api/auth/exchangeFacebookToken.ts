import { Config, Logger, Scope, startChildSpan } from "@common";
import { Credentials } from "react-native-auth0";
import { auth0 } from "./auth0";
import { IntermediateUserInfo } from "./types";

export const exchangeFacebookAccessToken = async (
    facebookAccessToken: string,
    profile: IntermediateUserInfo
): Promise<Credentials | null> => {
    const span = startChildSpan({
        name: "Exchange Facebook Token",
        op: "exchange",
    });
    Scope.setSpan(span);

    try {
        const childSpan = startChildSpan({
            name: "Exchange facebook token for session token",
            op: "exchange",
        });

        let subjectToken: string | undefined;
        try {
            let params = "grant_type=fb_attenuate_token";
            params += `&client_id=${Config.facebook.clientId}`;
            params += `&fb_exchange_token=${facebookAccessToken}`;
            const subjectTokenResponse = await fetch(
                "https://graph.facebook.com/v5.0/oauth/access_token?" + params
            );

            const data = await subjectTokenResponse.json();
            subjectToken = data.access_token;
        } catch (err) {
            Logger.captureException(err, childSpan);
        }
        childSpan.finish();

        const exchangeSpan = startChildSpan({
            name: "Exchange Facebook session token for Auth0 token",
            op: "exchange",
        });

        try {
            if (subjectToken) {
                const userProfile = {} as any;
                if (profile.firstName) userProfile.name = profile.firstName;
                if (profile.email) userProfile.email = profile.email;

                const result = await auth0.auth.exchangeNativeSocial({
                    subjectToken,
                    subjectTokenType:
                        "http://auth0.com/oauth/token-type/facebook-info-session-access-token",
                    audience: Config.auth0.audience,
                    scope: "openid profile email offline_access",
                    userProfile: JSON.stringify(userProfile),
                });

                exchangeSpan.finish();
                span.finish();

                return result;
            } else {
                Logger.captureMessage("subjectToken is falsy", exchangeSpan);
            }
        } catch (err) {
            Logger.captureException(err, exchangeSpan);
            console.log(err);
        }
        exchangeSpan.finish();
    } catch (error) {
        Logger.captureException(error, span);
    }
    span.finish();
    return null;
};
