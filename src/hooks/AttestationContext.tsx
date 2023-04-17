import { Attestation, AttestationStatus } from "@api/attest";
import { captureError, startChildSpan } from "@common";
import { getNetworkStateAsync } from "expo-network";
import React, {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useCredentialActions } from "./CredentialContext";
import { useBoolean } from "./useBoolean";

interface IAttestationContext {
    attestStatus: AttestationStatus | null;
    attest(): Promise<void>;
}

const AttestationContext = createContext<IAttestationContext>({
    attestStatus: null,
    attest: async () => {
        //
    },
});

export const AttestationProvider = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();
    const { accessToken } = useCredentialActions();

    const [attestStatus, setAttestStatus] = useState<AttestationStatus | null>(
        null
    );

    const attest = useCallback(async () => {
        const span = startChildSpan({
            name: "Begin Attestation",
            op: "attest",
        });
        try {
            const networkState = await getNetworkStateAsync();
            if (networkState.isInternetReachable) {
                if (user && "sub" in user && accessToken) {
                    const result = await Attestation.attestDevice(
                        user.sub,
                        accessToken
                    );
                    if (result === AttestationStatus.SUCCESS) {
                        setAttestStatus(result);
                    }
                }
            }
        } catch (err) {
            captureError(err, span);
        }
    }, [accessToken, user]);

    return (
        <AttestationContext.Provider value={{ attest, attestStatus }}>
            {children}
        </AttestationContext.Provider>
    );
};

export const useAttestation = () => {
    const [isAttesting, attesting] = useBoolean();
    const [hasAttested, setHasAttested] = useState(false);
    const { attest } = useContext(AttestationContext);

    const { user } = useAuth();
    const { accessToken } = useCredentialActions();

    useEffect(() => {
        if (user && accessToken && !hasAttested && !isAttesting) {
            attesting.on();
            attest().finally(() => {
                setHasAttested(true);
                attesting.off();
            });
        }
    }, [user, accessToken, hasAttested, isAttesting]);
};
