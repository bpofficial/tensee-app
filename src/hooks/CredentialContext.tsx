import { API, RefreshStatus } from "@api";
import { api } from "@api/constants";
import { Config, withSpan } from "@common";
import { getSecureItem, setSecureItem } from "@utils";
import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useState,
} from "react";
import { InteractionManager } from "react-native";
import { Credentials } from "react-native-auth0";
import { useBoolean } from "./useBoolean";

interface ICredentialContext {
    accessToken: string | null;
    isLoading: boolean;
    isAccessTokenExpired(): Promise<boolean>;
    isRefreshTokenExpired(): Promise<boolean>;
    storeCredentials(credentials: Credentials): void;
    clearCredentials(): Promise<void>;
    refreshAccessToken(): Promise<RefreshStatus>;
}

const CredentialContext = createContext<ICredentialContext>({
    accessToken: null,
    isLoading: false,
    isAccessTokenExpired: async () => {
        return false;
    },
    isRefreshTokenExpired: async () => {
        return false;
    },
    storeCredentials: async () => {
        // empty
    },
    clearCredentials: async () => {
        // empty
    },
    refreshAccessToken: async () => {
        return RefreshStatus.ALL_ACTIVE;
    },
});

export const CredentialProvider = ({ children }: PropsWithChildren) => {
    // Loading is to stop AutoLogout from triggering while a credential
    // action is taking place...
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, loading] = useBoolean();

    const storeCredentials = (credentials: Credentials) => {
        InteractionManager.runAfterInteractions(() => {
            withSpan(
                {
                    op: "store_credentials",
                    name: "Save credentials to storage",
                    description: `Store the provided credentials securely 
                                  alonside their expiry dates.`,
                },
                async () => {
                    const now = Date.now() / 1000;

                    const promises = [];
                    if (credentials.accessToken) {
                        const accessTokenExpiry = (
                            now + Config.auth0.autoLogoutAfter
                        ).toString();

                        setAccessToken(credentials.accessToken);
                        promises.push(
                            setSecureItem(
                                api.secureStorageKey + "_accessToken",
                                credentials.accessToken
                            )
                        );
                        promises.push(
                            setSecureItem(
                                api.secureStorageKey + "_atExpiresAt",
                                accessTokenExpiry
                            )
                        );
                    }

                    if (credentials.refreshToken) {
                        const refreshTokenExpiry = (
                            now + api.refreshTokenLifetime
                        ).toString();

                        promises.push(
                            setSecureItem(
                                api.secureStorageKey + "_refreshToken",
                                credentials.refreshToken
                            )
                        );
                        promises.push(
                            setSecureItem(
                                api.secureStorageKey + "_rtExpiresAt",
                                refreshTokenExpiry
                            )
                        );
                    }

                    await Promise.all(promises);
                }
            ).catch();
        });
    };

    const clearCredentials = async () => {
        withSpan(
            {
                op: "clear_credentials",
                name: "Clear stored credentials",
                description:
                    "Removes all credentials that are stored on the device.",
            },
            async () => {
                setAccessToken(null);
                await Promise.all([
                    setSecureItem(api.secureStorageKey + "_accessToken", null),
                    setSecureItem(api.secureStorageKey + "_refreshToken", null),
                    setSecureItem(api.secureStorageKey + "_atExpiresAt", null),
                    setSecureItem(api.secureStorageKey + "_rtExpiresAt", null),
                ]);
            }
        ).catch();
    };

    const isTokenExpired = async (t: "refresh" | "access") => {
        const keyPart = t === "access" ? "at" : "rt";
        const tokenKey = api.secureStorageKey + `_${t}Token`;
        const expiryKey = api.secureStorageKey + `_${keyPart}ExpiresAt`;

        const token = await getSecureItem(tokenKey);
        const expiry = await getSecureItem(expiryKey);

        if (token?.length && expiry !== null && expiry.length) {
            if (!Number.isNaN(Number(expiry))) {
                const exp = Number(expiry);
                const now = Date.now() / 1000; // we're operating in seconds...
                return now > exp;
            } else {
                await setSecureItem(expiryKey, "");
            }
        }
        return true;
    };

    const refreshAccessToken = async () => {
        loading.on();
        const result = await API.Auth.TokenActions.refreshAccessToken();
        if (result === RefreshStatus.ALL_ACTIVE) {
            // Update the access token here...
            await withSpan(
                {
                    op: "update_access_token",
                    name: "Update state with new token",
                    description: `When the access token has been refreshed it'll be stored securely.
                                  Read that and update the react state with it.`,
                },
                async () => {
                    const newAccessToken = await getSecureItem(
                        api.secureStorageKey + "_accessToken"
                    );
                    if (newAccessToken?.length) {
                        setAccessToken(newAccessToken);
                    }
                }
            );
        }
        loading.off();
        return result;
    };

    return (
        <CredentialContext.Provider
            value={{
                accessToken,
                storeCredentials,
                clearCredentials,
                isAccessTokenExpired: () => isTokenExpired("access"),
                isRefreshTokenExpired: () => isTokenExpired("refresh"),
                refreshAccessToken,
                isLoading,
            }}
        >
            {children}
        </CredentialContext.Provider>
    );
};

export const useCredentialActions = () => useContext(CredentialContext);
