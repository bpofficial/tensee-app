import * as Sentry from "@sentry/react-native";
import { Span } from "@sentry/types";
import { Config } from "config";

export async function tracedFetch(
    url: `/v1${string}` | `https://${string}`,
    options?: RequestInit | null,
    currentSpan?: Span | null
) {
    if (url.startsWith("/v1")) {
        url = (Config.api.apiUrl + url) as `https://${string}`;
    }

    const activeSpan =
        currentSpan || Sentry.getCurrentHub().getScope()?.getSpan();

    const cleanUrl = url.split("?")[0];
    const span = activeSpan?.startChild({
        op: "http",
        // We don't want to share the entire URL as it may be sensitive
        description: `fetch ${cleanUrl}`,
    });

    try {
        const start = performance.now();
        const response = await fetch(url, {
            ...(options ?? {}),
            headers: {
                ...(options?.headers ?? {}),
                "sentry-trace": activeSpan?.toTraceparent() ?? "",
            },
        });
        const end = performance.now();

        if (span) {
            span.setData("url", cleanUrl);
            span.setData("status_code", response.status);
            span.setData("duration", end - start);
            span.finish();
        }

        return response;
    } catch (error) {
        if (span) {
            span.setStatus("internal_error");
            span.finish();
        }

        throw error;
    }
}
