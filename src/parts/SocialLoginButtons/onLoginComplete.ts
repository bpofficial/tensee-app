import { IntermediateUserInfo, tracedFetch } from "@api";
import { captureError } from "@common";
import { useActivity, useAuth, useTaskContext } from "@hooks";
import { useNavigation } from "@react-navigation/native";
import { AppleAuthenticationCredential } from "expo-apple-authentication";

export function useOnLoginComplete() {
    const { setActive } = useActivity();
    const { exchangeSocialTokens } = useAuth();
    const { navigate } = useNavigation();
    const { addTask } = useTaskContext();

    async function handler(
        credential: string | AppleAuthenticationCredential,
        provider: "apple" | "google" | "facebook"
    ) {
        try {
            if (credential) {
                let exchange: IntermediateUserInfo;
                switch (provider) {
                    case "apple":
                        exchange = appleCredsToExchange(credential as any);
                        break;
                    case "facebook":
                        exchange = await facebookCredsToExchange(
                            credential as string
                        );
                        break;
                    case "google":
                        exchange = await googleCredsToExchange(
                            credential as string
                        );
                        break;
                }

                if (exchange) {
                    addTask(
                        "exchange_social_token",
                        exchangeSocialTokens(exchange)
                    );

                    navigate("Loading", {
                        screen: "Loading",
                        params: {
                            task: "exchange_social_token",
                            message: "Signing you in",
                            callback: {
                                screen: "App",
                            },
                        },
                    });
                }
            }
        } catch (err) {
            captureError(err);
        }
        setActive(false);
    }

    return handler;
}

async function facebookCredsToExchange(
    token: string
): Promise<IntermediateUserInfo> {
    const data = await tracedFetch(
        `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`,
        null
    );

    const userInfo = await data.json();
    return {
        socialProvider: "facebook",
        socialAccessToken: token,
        firstName: userInfo.name,
        email: null,
        id: userInfo.id,
    } as const;
}

async function googleCredsToExchange(
    token: string
): Promise<IntermediateUserInfo> {
    const data = await tracedFetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const userInfo = await data.json();
    return {
        socialProvider: "google",
        socialAccessToken: token,
        firstName: userInfo.name ?? userInfo.given_name,
        email: userInfo.email,
        id: userInfo.id,
    } as const;
}

function appleCredsToExchange(
    creds: AppleAuthenticationCredential
): IntermediateUserInfo {
    return {
        socialProvider: "apple",
        socialAccessToken: creds.authorizationCode,
        firstName: creds.fullName?.givenName ?? "",
        email: creds.email,
        id: creds.user,
    } as const;
}
