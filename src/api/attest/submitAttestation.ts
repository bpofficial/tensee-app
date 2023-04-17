import { api } from "@api/constants";
import { withSpan } from "@common";

export async function submitAttestation(
    device: string,
    challenge: string,
    keyId: string,
    attestation: string,
    token: string
) {
    try {
        const result = await withSpan(
            {
                op: "http",
                name: "Submit Attestation",
                description: "Send attestation data to the API",
            },
            () =>
                fetch(api.apiUrl + "/v1/attest", {
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
                })
        );
        return result.ok;
    } catch (err) {
        console.error(err);
    }
    return false;
}
