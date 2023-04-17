import { Config, startChildSpan, withSpan } from "@common";
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

    try {
        const subjectToken = await withSpan(
            {
                op: "exchange",
                description: "Exchange facebook token for session token",
                name: "Facebook Exchange",
                parent: span,
            },
            async () => {
                let params = "grant_type=fb_attenuate_token";
                params += `&client_id=${Config.facebook.clientId}`;
                params += `&fb_exchange_token=${facebookAccessToken}`;
                const subjectTokenResponse = await fetch(
                    "https://graph.facebook.com/v5.0/oauth/access_token?" +
                        params
                );

                const data = await subjectTokenResponse.json();
                return data.access_token;
            }
        );

        if (subjectToken) {
            const userProfile = {} as any;
            if (profile.firstName) userProfile.name = profile.firstName;
            if (profile.email) userProfile.email = profile.email;

            const result = await withSpan(
                {
                    op: "exchange",
                    name: "Auth0 Exchange",
                    description:
                        "Exchange facebook session token for Auth0 token",
                    parent: span,
                },
                () =>
                    auth0.auth.exchangeNativeSocial({
                        subjectToken,
                        subjectTokenType:
                            "http://auth0.com/oauth/token-type/facebook-info-session-access-token",
                        audience: Config.auth0.audience,
                        scope: "openid profile email offline_access",
                        userProfile: JSON.stringify(userProfile),
                    })
            );

            span.finish();

            return result;
        }
    } catch (error) {
        console.error(error);
    }
    span.finish();
    return null;
};
