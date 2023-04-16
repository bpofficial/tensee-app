import { AttestationAPI } from "@api";
import { createAppState } from "@api/createAppState";
import { Logger, startChildSpan } from "@common";
import { getOrCreateDeviceId } from "@utils";
import { Buffer } from "buffer";
import * as Attest from "expo-attestation";
import { getNetworkStateAsync } from "expo-network";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useAuth0 } from "react-native-auth0";

async function validateIntegrity(userId: string, token: string) {
    const canAttest = await Attest.canPerformAttestationAsync();
    if (canAttest) {
        try {
            const device = await getOrCreateDeviceId();
            const state = await createAppState(device);

            const challenge = await AttestationAPI.getAttestationChallenge(
                device,
                state,
                token
            );

            if (challenge === null) {
                throw new Error("Failed to retrieve challenge.");
            }

            const clientData = Buffer.from(challenge + state).toString(
                "base64"
            );

            const [keyId, attestation] = await Attest.performAttestationAsync(
                userId,
                clientData
            );

            return AttestationAPI.submitAttestation(
                device,
                challenge,
                keyId,
                attestation,
                token
            );
        } catch (err) {
            return null;
        }
    } else {
        return null;
    }
}

export function useAttestation(): [boolean | null, string | null] {
    const auth0 = useAuth0();
    const appState = useRef(AppState.currentState);

    const [appStateVisible, setAppStateVisible] = useState(
        appState.current === "active"
    );

    const [attestToken, setAttestToken] = useState<string | null>(null);
    const [attestStatus, setAttestStatus] = useState<boolean | null>(null);

    async function attest() {
        try {
            const span = startChildSpan({
                name: "Attest",
                op: "attest",
            });

            const networkState = await getNetworkStateAsync();
            if (networkState.isInternetReachable) {
                if (auth0.user) {
                    const credentials = await auth0.getCredentials();
                    const attestation = await validateIntegrity(
                        auth0.user.id,
                        credentials.accessToken
                    );
                    if (attestation !== null) {
                        Logger.captureMessage("Attestation succeeded.", span);
                        setAttestStatus(attestation);
                    } else {
                        Logger.captureMessage("Attestation failed.", span);
                    }
                } else {
                    Logger.captureMessage("User is not logged in.", span);
                }
            } else {
                Logger.captureMessage("Network is unreachable.", span);
            }
        } catch (err) {
            Logger.captureException(err);
        }
    }

    useEffect(() => {
        if (appStateVisible) {
            attest();
        }
    }, [appStateVisible]);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState) => {
                appState.current = nextAppState;
                setAppStateVisible(appState.current === "active");
            }
        );

        return () => subscription.remove();
    }, []);

    return [attestStatus, attestToken];
}
