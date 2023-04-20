import { Logger } from "@common";
import { useNavigation } from "@react-navigation/native";
import { Config } from "config";
import { useEffect } from "react";
import { useAppState } from "./context/AppStateContext";
import { useAuth } from "./context/AuthContext";
import { useCredentialActions } from "./context/CredentialContext";
import { useLastActivityTimestamp } from "./useLastActivityTimestamp";

export function useAutoLogout() {
    const { user } = useAuth();
    const { isAccessTokenExpired, isLoading } = useCredentialActions();
    const { appState, previousAppState } = useAppState();
    const { navigate } = useNavigation();
    const [lastActivityTimestamp] = useLastActivityTimestamp();

    useEffect(() => {
        if (
            previousAppState &&
            previousAppState.match(/inactive|background/) &&
            appState === "active" &&
            user &&
            !isLoading
        ) {
            isAccessTokenExpired()
                .then((isExpired) => {
                    const logoutAt =
                        lastActivityTimestamp + Config.auth0.autoLogoutAfter;
                    const now = Date.now();

                    if (logoutAt <= now && isExpired) {
                        navigate("Auth");
                    }
                })
                .catch(Logger.captureException);
        }
    }, [appState, previousAppState, user, isLoading]);
}
