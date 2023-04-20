import { RefreshStatus } from "@api";
import { Logger } from "@common";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { InteractionManager } from "react-native";
import { useAppState, useAuth, useCredentialActions } from "./context";

export function useAutoRefreshToken() {
    const { user } = useAuth();
    const { refreshAccessToken, clearCredentials } = useCredentialActions();
    const { appState } = useAppState();
    const { navigate } = useNavigation();

    const attemptToAutoRefresh = () => {
        // We don't want to logout mid-animation ...
        InteractionManager.runAfterInteractions(async () => {
            // Refresh already checks if the access token has
            // expired so we don't need to call `isAccessTokenExpired`.
            refreshAccessToken()
                .then((status) => {
                    switch (status) {
                        case RefreshStatus.ALL_ACTIVE:
                            break;
                        case RefreshStatus.FAILED:
                        case RefreshStatus.REFRESH_EXPIRED:
                        default:
                            clearCredentials()
                                .then(() => {
                                    navigate("Auth");
                                })
                                .catch(Logger.captureException);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    Logger.captureException(err);
                    // We'll try to clear this and move on..
                    clearCredentials()
                        .then(() => {
                            navigate("Auth");
                        })
                        .catch(Logger.captureException);
                });
        });
    };

    useEffect(() => {
        if ((appState === "active" || appState === "inactive") && user) {
            const intervalId = setInterval(
                () => attemptToAutoRefresh(),
                300 * 1000 // run every 5 minutes
            );

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [appState, user]);
}
