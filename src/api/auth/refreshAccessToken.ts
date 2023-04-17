import { Config, captureError, startChildSpan, withSpan } from "@common";
import { RefreshAccessTokenFailedError } from "../../errors/RefreshAccessTokenFailedError";
import { getSecureItem, setSecureItem } from "../../utils/secureStorage";
import { api } from "../constants";
import { createAppState } from "../createAppState";
import { withNetworkActivity } from "../withNetworkActivity";
import { RefreshStatus } from "./types";

// Returns boolean, if false then logout, if true then all is good
export async function refreshAccessToken(): Promise<RefreshStatus> {
    const span = startChildSpan({
        name: "Refresh Access Token",
        op: "refresh_token",
    });

    try {
        const state = await withSpan({ op: "create_state", parent: span }, () =>
            createAppState()
        );

        const [refreshToken, rtExpiry, atExpiry] = await withSpan(
            { op: "secure_read", parent: span },
            () =>
                Promise.all([
                    getSecureItem(api.secureStorageKey + "_refreshToken"),
                    getSecureItem(api.secureStorageKey + "_rtExpiresAt"), // refresh token expiry
                    getSecureItem(api.secureStorageKey + "_atExpiresAt"), // access token expiry
                ])
        );

        const now = Date.now() / 1000;
        const accessTokenExpiry = Number(atExpiry);
        const refreshTokenExpiry = Number(rtExpiry);

        if (
            Number.isNaN(accessTokenExpiry) ||
            Number.isNaN(refreshTokenExpiry)
        ) {
            return RefreshStatus.FAILED;
        }

        // if the access token has expired...
        if (now >= accessTokenExpiry) {
            // and we have a refresh token, and it hasn't expired...
            if (refreshToken && now <= refreshTokenExpiry) {
                const data = await withNetworkActivity(async () => {
                    const response = await withSpan(
                        {
                            op: "http",
                            description: "Request new access token",
                            parent: span,
                        },
                        () => {
                            const scope = `appstate:${state}`;

                            return fetch(
                                `https://${Config.auth0.domain}/oauth/token`,
                                {
                                    method: "POST",
                                    body: JSON.stringify({
                                        grant_type: "refresh_token",
                                        client_id: Config.auth0.clientId,
                                        refresh_token: refreshToken,
                                        scope: `openid profile email ${scope}`,
                                    }),
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            );
                        }
                    );
                    if (response.ok) {
                        return response.json();
                    }
                    return null;
                });

                if (data === null) {
                    throw new RefreshAccessTokenFailedError();
                }

                try {
                    const accessTokenExpiry = (
                        now + Config.auth0.autoLogoutAfter
                    ).toString();

                    await withSpan({ op: "secure_write", parent: span }, () =>
                        Promise.all([
                            setSecureItem(
                                api.secureStorageKey + "_accessToken",
                                data.access_token
                            ),
                            setSecureItem(
                                api.secureStorageKey + "_atExpiresAt",
                                accessTokenExpiry
                            ),
                        ])
                    );
                    return RefreshStatus.ALL_ACTIVE;
                } catch (err) {
                    captureError(err, span);
                }
            } else {
                // Refresh token has expired
                console.log("refresh token has expired...");
                return RefreshStatus.REFRESH_EXPIRED;
            }
        }
        return RefreshStatus.ALL_ACTIVE;
    } catch (err) {
        captureError(err, span);
        console.log(err);
        return RefreshStatus.FAILED;
    }
}
