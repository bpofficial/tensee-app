import { Logger } from "@common";
import { api } from "./constants";

async function getAttestationChallenge(
    device: string,
    state: string,
    token: string
): Promise<string | null> {
    try {
        const result = await fetch(
            api.apiUrl + `/v1/attest/challenge?state=${state}&device=${device}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const challenge = (await result.json()).challenge;
        return challenge;
    } catch (err) {
        Logger.captureException(err);
    }
    return null;
}

async function submitAttestation(
    device: string,
    challenge: string,
    keyId: string,
    attestation: string,
    token: string
) {
    try {
        const result = await fetch(api.apiUrl + "/v1/attest", {
            method: "POST",
            body: JSON.stringify({
                device,
                keyId,
                challenge,
                attestation,
            }),
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return result.ok;
    } catch (err) {
        Logger.captureException(err);
    }
    return false;
}

export const AttestationAPI = {
    getAttestationChallenge,
    submitAttestation,
};
