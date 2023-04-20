import { tracedFetch } from "@api";
import { withSpan } from "@common";
import { Span } from "@sentry/types";

export async function getChallenge(
    device: string,
    state: string,
    token: string,
    parent?: Span
): Promise<string | null> {
    try {
        const result = await withSpan(
            {
                op: "http",
                name: "Get Attestation Challenge",
                description:
                    "Fetch the attestation/integrity challenge from the API",
                parent,
            },
            (span) =>
                tracedFetch(
                    `/v1/attest/challenge?state=${state}&device=${device}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                    span
                )
        );

        if (result === null) return null;

        const challenge = (await result.json()).challenge;
        return challenge;
    } catch (err) {
        console.error(err);
    }
    return null;
}
