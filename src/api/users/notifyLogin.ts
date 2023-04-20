import { tracedFetch } from "@api/utils";
import { withSpan } from "@common";
import { Span } from "@sentry/types";

export async function notifyLogin(
    userId: string,
    token: string,
    parent?: Span
): Promise<number | null> {
    try {
        const result = await withSpan(
            {
                op: "http",
                name: "Notify User Login",
                description: "Inform the API that a user has logged in.",
                parent,
            },
            (span) =>
                tracedFetch(
                    `/v1/users/login`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            userId,
                        }),
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                    span
                )
        );

        if (result === null) return null;

        const loginCount = (await result.json()).logins;

        if (Number.isNaN(Number(loginCount))) return null;

        return Number(loginCount);
    } catch (err) {
        console.error(err);
    }
    return null;
}
