import { api } from "@api/constants";
import { withSpan } from "@common";

export async function getChallenge(
    device: string,
    state: string,
    token: string
): Promise<string | null> {
    try {
        const result = await withSpan(
            {
                op: "http",
                name: "Get Attestation Challenge",
                description:
                    "Fetch the attestation/integrity challenge from the API",
            },
            () =>
                fetch(
                    api.apiUrl +
                        `/v1/attest/challenge?state=${state}&device=${device}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );

        const challenge = (await result.json()).challenge;
        return challenge;
    } catch (err) {
        console.error(err);
    }
    return null;
}
