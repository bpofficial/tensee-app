import { tracedFetch } from "@api";
import { api } from "@api/constants";
import { withSpan } from "@common";
import { Span } from "@sentry/types";

export async function submitAttestation(
    device: string,
    challenge: string,
    keyId: string,
    attestation: string,
    token: string,
    parent?: Span
) {
    try {
        const result = await withSpan(
            {
                op: "http",
                name: "Submit Attestation",
                description: "Send attestation data to the API",
                parent,
            },
            (span) =>
                tracedFetch(
                    api.apiUrl + "/v1/attest",
                    {
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
                    },
                    span
                )
        );
        if (result === null) return false;
        return result.ok;
    } catch (err) {
        console.error(err);
    }
    return false;
}
