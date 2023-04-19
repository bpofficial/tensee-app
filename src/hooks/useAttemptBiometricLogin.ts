import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect } from "react";
import { useBiometricState } from "./BiometricContext";
import { useCredentialActions } from "./CredentialContext";
import { usePinSettings } from "./PinAuthContext";

export function useAttemptBiometricLogin() {
    const isFocused = useIsFocused();
    const { navigate } = useNavigation();
    const { refreshAccessToken, isRefreshTokenExpired } =
        useCredentialActions();
    const { hasPinSet } = usePinSettings();
    const { getHasUsedBiometrics } = useBiometricState();

    const navigateToPinEntryIfPossible = async () => {
        const isPinSet = await hasPinSet();
        if (isPinSet) {
            navigate("Auth", { screen: "PinEntry" });
        }
    };

    const attemptBiometrics = async () => {
        const isRefreshExpired = await isRefreshTokenExpired();
        if (isRefreshExpired) return;

        const hasHardware = await LocalAuthentication.hasHardwareAsync();

        if (!hasHardware) {
            // If there's no biometric hardware available, navigate to the pin entry screen
            return navigateToPinEntryIfPossible();
        }

        const supportedBiometrics =
            await LocalAuthentication.supportedAuthenticationTypesAsync();

        const isBiometricAvailable = supportedBiometrics.length > 0;

        if (!isBiometricAvailable) {
            // If there's no supported biometrics, navigate to the pin entry screen
            return navigateToPinEntryIfPossible();
        }

        // TODO: Figure out what to do here, and what the flow is for setting up biometric
        // login. i.e. how to direct or prompt the user to allow biometrics.
        const hasUsedBiometricsBefore = await getHasUsedBiometrics();
        if (!hasUsedBiometricsBefore) return;

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Authenticate with biometrics",
            fallbackLabel: "", // Disables fallback button
            disableDeviceFallback: false,
        });

        if (result.success) {
            console.log("biometric success");
            await refreshAccessToken();
            return navigate("App");
        } else {
            return navigateToPinEntryIfPossible();
        }
    };

    useEffect(() => {
        if (isFocused) attemptBiometrics();
    }, [isFocused]);
}
