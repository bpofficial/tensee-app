import { captureError } from "@common";
import { useActivity, useAuth, useTaskContext } from "@hooks";
import { useNavigation } from "@react-navigation/native";

export function useOnLoginComplete() {
    const { setActive } = useActivity();
    const { exchangeSocialTokens } = useAuth();
    const { navigate } = useNavigation();
    const { addTask } = useTaskContext();

    function handler(
        credentials: any,
        provider: "apple" | "google" | "facebook"
    ) {
        try {
            if (credentials) {
                let exchange;
                switch (provider) {
                    case "apple":
                        exchange = appleCredsToExchange(credentials);
                        break;
                    case "facebook":
                        exchange = facebookCredsToExchange(credentials);
                        break;
                    case "google":
                        exchange = googleCredsToExchange(credentials);
                        break;
                }

                if (exchange) {
                    addTask(
                        "exchange_social_token",
                        exchangeSocialTokens(exchange as any)
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

function facebookCredsToExchange(creds: any) {
    return {
        socialProvider: "facebook",
        socialAccessToken: creds.token,
        firstName: creds.name,
        email: null,
        id: creds.id,
    };
}

function googleCredsToExchange(creds: any) {
    return {
        socialProvider: "google",
        socialAccessToken: creds.token,
        firstName: creds.name ?? creds.given_name,
        email: creds.email,
        id: creds.id,
    };
}

function appleCredsToExchange(creds: any) {
    return {
        socialProvider: "apple",
        socialAccessToken: creds.authorizationCode,
        firstName: creds.fullName?.givenName ?? "",
        email: creds.email,
        id: creds.user,
    };
}
