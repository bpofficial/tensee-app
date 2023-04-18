import {
    IntermediateUserInfo,
    createAppState,
    withNetworkActivity,
} from "@api";
import { auth0 } from "@api/auth/auth0";
import { Config, Logger, withSpan } from "@common";
import { UnknownError, getDefinedError } from "@errors";
import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { InteractionManager } from "react-native";
import { UserInfo } from "react-native-auth0";
import { useCredentialActions } from "./CredentialContext";
import { usePinSettings } from "./PinAuthContext";

interface IAuthContext {
    user: UserInfo | IntermediateUserInfo | null;
    setUser(user: UserInfo | IntermediateUserInfo): void;
    login(email: string, password: string): Promise<void>;
    register(name: string, email: string, password: string): Promise<void>;
    logout(): Promise<void>;
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
});

/**
 * We don't use securefetch for Auth0 because it is recommended not to:
 * https://auth0.com/docs/troubleshoot/general-usage-and-operations-best-practices#avoid-pinning-or-fingerprinting-tls-certificates-for-auth0-endpoints
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
    // const [attestationStatus, attestationToken] = useAttestation();
    const {
        storeCredentials,
        exchangeSocialTokens,
        accessToken,
        clearCredentials,
    } = useCredentialActions();
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
                    async () => {
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

    useEffect(() => {
        if (user && "socialProvider" in user) {
            exchangeSocialTokens(user)
                .then((userProfile) => {
                    if (userProfile !== null) {
                        setUser(userProfile);
                    }
                })
                .catch(Logger.captureException);
        }
    }, [user]);

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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
