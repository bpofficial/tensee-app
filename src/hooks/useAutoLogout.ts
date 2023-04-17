import { Config, Logger } from "@common";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useAppState } from "./AppStateContext";
import { useAuth } from "./AuthContext";
import { useCredentialActions } from "./CredentialContext";
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
