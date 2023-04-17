import { createAppState } from "@api/createAppState";
import { startChildSpan, withSpan } from "@common";
import { Span } from "@sentry/types";
import { getOrCreateDeviceId } from "@utils";
import * as Attest from "expo-attestation";
import { getChallenge } from "./getChallenge";
import { submitAttestation } from "./sendAttestationData";
import { AttestationStatus } from "./types";

async function getKeyID(userId: string, span: Span) {
    let keyId = await withSpan({ op: "check_has_key", parent: span }, () =>
        Attest.getKeyIdAsync(userId)
    );

    if (keyId === null) {
        await withSpan({ op: "generate_new_key", parent: span }, async () => {
            const key = await Attest.generateKeyAsync(userId);
            if (key !== null) {
                keyId = key;
            }
        });
    }

    const hasAttested = await withSpan(
        {
            parent: span,
            op: "check_key_attested",
            name: "Check keyId is attested",
            description: `Determine whether the key pair identified by the key ID 
                      has been attested with DeviceCheck yet.`,
        },
        () =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Attest.hasAttestedKeyAsync(keyId!)
    );

    if (hasAttested) return AttestationStatus.SUCCESS;
    if (keyId === null) return null;
    return String(keyId);
}

export async function attestDevice(
    userId: string,
    token: string
): Promise<AttestationStatus> {
    const span = startChildSpan({
        name: "attestDevice",
        op: "attest",
    });

    const canAttest = await withSpan({ op: "can_attest", parent: span }, () => {
        return Attest.canUseAttestationAsync();
    });

    if (canAttest) {
        try {
            // Exit early if the key has already attested...
            const keyId = await getKeyID(userId, span);
            if (keyId === AttestationStatus.SUCCESS) {
                span.finish();
                return keyId;
            }

            const device = await withSpan(
                { op: "get_device_id", parent: span },
                () => getOrCreateDeviceId()
            );

            if (device === null) {
                span.finish();
                return AttestationStatus.ERROR;
            }

            const state = await withSpan(
                { op: "create_state", parent: span },
                () => createAppState(device)
            );

            if (state === null) {
                span.finish();
                return AttestationStatus.ERROR;
            }

            const challenge = await withSpan(
                { op: "get_challenge", parent: span },
                (thisSpan) => getChallenge(device, state, token, thisSpan)
            );

            if (challenge === null) {
                span.finish();
                return AttestationStatus.ERROR;
            }

            const attestationResult = await withSpan(
                { op: "perform_attestation", parent: span },
                () => Attest.performAttestationAsync(userId, challenge)
            );

            if (attestationResult === null) {
                span.finish();
                return AttestationStatus.ERROR;
            }

            const attestation = attestationResult[1];

            const result = await withSpan(
                { op: "send_attestation", parent: span },
                (thisSpan) =>
                    submitAttestation(
                        device,
                        challenge,
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        keyId!,
                        attestation,
                        token,
                        thisSpan
                    )
            );

            if (result) {
                await withSpan({ op: "mark_key_attested", parent: span }, () =>
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    Attest.markKeyAttestedAsync(keyId!)
                );

                return AttestationStatus.SUCCESS;
            }

            return AttestationStatus.FAILED;
        } catch (err) {
            console.error(err);
            return AttestationStatus.ERROR;
        }
    } else {
        span.finish();
        return AttestationStatus.NOT_AVAILABLE;
    }
}
