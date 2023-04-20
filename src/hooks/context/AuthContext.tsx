import {
    API,
    IntermediateUserInfo,
    createAppState,
    withNetworkActivity,
} from "@api";
import { auth0 } from "@api/auth/auth0";
import { Config, withSpan } from "@common";
import { UnknownError, getDefinedError } from "@errors";
import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { InteractionManager } from "react-native";
import { Credentials, UserInfo } from "react-native-auth0";
import { useCredentialActions } from "./CredentialContext";
import { usePinSettings } from "./PinAuthContext";
import { NavigableTaskResult } from "./TaskContext";

interface IAuthContext {
    user: UserInfo | IntermediateUserInfo | null;
    setUser(user: UserInfo | IntermediateUserInfo): void;
    login(email: string, password: string): Promise<void>;
    register(name: string, email: string, password: string): Promise<void>;
    logout(): Promise<void>;
    exchangeSocialTokens(
        user: IntermediateUserInfo
    ): Promise<NavigableTaskResult | null>;
}

const AuthContext = createContext<IAuthContext>({
    user: null,
    setUser() {
        //
    },
    login: async () => {
        // empty
    },
    register: async () => {
        // empty
    },
    logout: async () => {
        //
    },
    exchangeSocialTokens: async () => {
        return null;
    },
});

/**
 * We don't use securefetch for Auth0 because it is recommended not to:
 * https://auth0.com/docs/troubleshoot/general-usage-and-operations-best-practices#avoid-pinning-or-fingerprinting-tls-certificates-for-auth0-endpoints
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
    const { storeCredentials, accessToken, clearCredentials } =
        useCredentialActions();
    const { clearPin } = usePinSettings();

    const [user, setUser] = useState<UserInfo | IntermediateUserInfo | null>(
        null
    );

    const logout = async () => {
        // Maybe we don't need to clear the pin???
        await Promise.all([clearCredentials(), clearPin()]);
    };

    const login = async (email: string, password: string) => {
        try {
            // By adding app state we can have Auth0 sign our
            // token with our app state as well to ensure its
            // integrity when verified on the backend.
            const state = await createAppState();

            const credentials = await withNetworkActivity(async () => {
                return withSpan(
                    { op: "auth_login", name: "Login with Credentials" },
                    async (span) => {
                        const creds = await auth0.auth.passwordRealm({
                            username: email,
                            password: password,
                            realm: "Username-Password-Authentication",
                            // We don't use attestation in login as the app
                            // hasn't been able to authenticate and we want
                            // the user to be authenticated before attesting.
                            scope: `openid profile email offline_access appstate:${state}`,
                            audience: Config.auth0.audience,
                        });

                        const userProfile = await auth0.auth.userInfo({
                            token: creds.accessToken,
                        });

                        await API.Users.notifyLogin(
                            userProfile.sub,
                            creds.accessToken,
                            span
                        );

                        setUser(userProfile);

                        return creds;
                    }
                );
            });

            if (credentials !== null) {
                storeCredentials(credentials);
            }
        } catch (error) {
            getDefinedError("auth0", error);
            throw new UnknownError();
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const user = await withNetworkActivity(async () => {
                return withSpan(
                    { op: "auth_register", name: "Register with Credentials" },
                    () =>
                        auth0.auth.createUser({
                            name,
                            email,
                            password,
                            connection: "Username-Password-Authentication",
                            // We don't use stae or attenstating during
                            // registration as it doesn't matter.
                            // We don't receieve an access token here
                        })
                );
            });

            // Dispatch
            InteractionManager.runAfterInteractions(async () => {
                // send result to our APIs
                await withNetworkActivity(async () => {
                    // use result..
                });
            });
        } catch (error) {
            getDefinedError("auth0", error);
            throw new UnknownError();
        }
    };

    const exchangeSocialTokens = async (
        user: IntermediateUserInfo
    ): Promise<NavigableTaskResult | null> => {
        try {
            console.log(user);
            if (user.socialAccessToken) {
                let credentials: Credentials | null = null;
                if (user.socialProvider === "facebook") {
                    credentials =
                        await API.Auth.TokenExchange.exchangeFacebookAccessToken(
                            user.socialAccessToken,
                            user
                        );
                } else if (user.socialProvider === "apple") {
                    credentials =
                        await API.Auth.TokenExchange.exchangeAppleAuthorizationCode(
                            user.socialAccessToken
                        );
                } else if (user.socialProvider === "google") {
                    credentials =
                        await API.Auth.TokenExchange.exchangeGoogleAccessToken(
                            user.socialAccessToken
                        );
                }

                const result = await withSpan(
                    {
                        op: "get_social_info",
                        name: "Get user info from social access token",
                        description: `After exchanging the social token for an Auth0 token, 
                                  get the user info associated with it.`,
                    },
                    async (span): Promise<[UserInfo, number | null] | null> => {
                        if (credentials !== null) {
                            const userProfile = await auth0.auth.userInfo({
                                token: credentials.accessToken,
                            });

                            // In the context of social sign-in/register
                            // the loginCount is useful as it allows us
                            // to determine if this is a new user registering
                            // directly from the login screen.
                            const loginCount = await API.Users.notifyLogin(
                                userProfile.sub,
                                credentials.accessToken,
                                span
                            );

                            storeCredentials(credentials);
                            setUser(userProfile);
                            return [userProfile, loginCount];
                        }
                        return null;
                    }
                );

                if (result !== null) {
                    const [, loginCount] = result;
                    if (loginCount === 0) {
                        // Return this so that the task controller can
                        // redirect properly from the loading screen.
                        return {
                            callback: {
                                screen: "Onboarding",
                            },
                        } as NavigableTaskResult;
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
        return null;
    };

    useEffect(() => {
        if (accessToken !== null) {
            withSpan(
                {
                    op: "access_token_change",
                    name: "Get user info",
                    description:
                        "When the access token changes, get the user info associated with the new token.",
                },
                async () => {
                    auth0.auth
                        .userInfo({ token: accessToken })
                        .then((user) => setUser(user));
                }
            );
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                register,
                logout,
                exchangeSocialTokens,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
