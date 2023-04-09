import { api } from "@api/constants";
import { createAppState } from "@api/createAppState";
import { refreshAccessToken } from "@api/refreshAccessToken";
import { withNetworkActivity } from "@api/withNetworkActivity";
import { Config } from "@common";
import { UnknownError, getDefinedError } from "@errors";
import { setSecureItem } from "@utils";
import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { InteractionManager } from "react-native";
import Auth0, { UserInfo } from "react-native-auth0";

interface IAuthContext {
    user: UserInfo | null;
    login(email: string, password: string): Promise<void>;
    register(name: string, email: string, password: string): Promise<void>;
    refreshToken(): Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
    user: null,
    login: async () => {
        // empty
    },
    register: async () => {
        // empty
    },
    refreshToken: async () => {
        // empty
    },
});

const auth0 = new Auth0(Config.auth0);

/**
 * We don't use securefetch for Auth0 because it is recommended not to:
 * https://auth0.com/docs/troubleshoot/general-usage-and-operations-best-practices#avoid-pinning-or-fingerprinting-tls-certificates-for-auth0-endpoints
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<UserInfo | null>(null);

    const login = async (email: string, password: string) => {
        try {
            // By adding app state we can have Auth0 sign our
            // token with our app state as well to ensure its
            // integrity.
            const state = createAppState();

            const credentials = await withNetworkActivity(async () => {
                const creds = await auth0.auth.passwordRealm({
                    username: email,
                    password: password,
                    realm: "Username-Password-Authentication",
                    scope: `openid profile email offline_access appstate:${state}`,
                    audience: Config.auth0.audience,
                });

                const userProfile = await auth0.auth.userInfo({
                    token: credentials.accessToken,
                });

                setUser(userProfile);

                return creds;
            });

            InteractionManager.runAfterInteractions(async () => {
                try {
                    const nowInSeconds = Date.now() / 1000;
                    const accessTokenExpiry = (
                        nowInSeconds + credentials.expiresIn
                    ).toString();
                    const refreshTokenExpiry = (
                        nowInSeconds + api.refreshTokenLifetime
                    ).toString();

                    await Promise.all([
                        setSecureItem(
                            api.secureStorageKey + "_accessToken",
                            credentials.accessToken
                        ),
                        setSecureItem(
                            api.secureStorageKey + "_refreshToken",
                            credentials.refreshToken ?? ""
                        ),
                        setSecureItem(
                            api.secureStorageKey + "_atExpiresAt",
                            accessTokenExpiry
                        ),
                        setSecureItem(
                            api.secureStorageKey + "_rtExpiresAt",
                            refreshTokenExpiry
                        ),
                    ]);
                } catch (err) {
                    console.log("Encountered an error storing credentials...");
                    console.log(err);
                }
            });
        } catch (error) {
            console.error("Authentication error:", error);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            await withNetworkActivity(async () => {
                return auth0.auth.createUser({
                    name,
                    email,
                    password,
                    connection: "Username-Password-Authentication",
                });
            });

            // Dispatch
            InteractionManager.runAfterInteractions(async () => {
                // send result to our APIs
                await withNetworkActivity(async () => {
                    // use result..
                });
            });
        } catch (error) {
            if (error && typeof error === "object" && "code" in error) {
                getDefinedError("auth0", String(error.code));
            }
            throw new UnknownError();
        }
    };

    useEffect(() => {
        // Constantly checking to see if the access token
        // needs to be refreshed...
        refreshAccessToken();
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                refreshToken: refreshAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
