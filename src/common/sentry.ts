import * as SentryTypes from "@sentry/types";
import { Native } from "sentry-expo";

let _scope = Native.getCurrentHub().getScope();

Native.getCurrentHub().configureScope((scope) => {
    if (!_scope) _scope = scope;
});

export const Logger = Native;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const Scope = _scope!;

type ChildSpanOpts = Pick<
    SentryTypes.SpanContext,
    Exclude<
        keyof SentryTypes.SpanContext,
        "sampled" | "traceId" | "parentSpanId"
    >
> & { name?: string };

export const startChildSpan = (
    ctx: ChildSpanOpts,
    parent?: SentryTypes.Span
) => {
    let result: SentryTypes.Span;
    const scope = Scope;
    const span = parent || scope.getSpan();
    if (span !== undefined) {
        result = span.startChild(ctx);
    } else {
        result = Native.startTransaction({
            ...ctx,
            name: ctx.name || ctx.op || "",
        });
    }
    Logger.getCurrentHub().configureScope((s) => s.setSpan(result));
    return result;
};

export async function withSpan<T>(
    ctx: ChildSpanOpts & { parent?: SentryTypes.Span },
    cb: (span: SentryTypes.Span) => T
): Promise<Awaited<T>> {
    const span = startChildSpan(ctx, ctx?.parent);
    console.debug("Starting span: ", ctx.op);
    try {
        const result = await cb(span);
        span.finish();
        return result;
    } catch (err) {
        captureError(err, span);
        span.finish();
        throw err;
    }
}

export function captureError(
    err: unknown,
    span?: SentryTypes.Span | null,
    ctx?: SentryTypes.CaptureContext
) {
    span?.finish();
    Logger.getCurrentHub().configureScope((scope) => {
        if (span) scope.setSpan(span);
    });
    Logger.withScope((scope) => {
        console.log("Caught error:", (err as any)?.message);
        Logger.captureException(err, { ...scope, ...ctx });
    });
}

export function captureMsg(
    message: string,
    span?: SentryTypes.Span | null,
    ctx?: SentryTypes.CaptureContext
) {
    Logger.withScope((scope) => {
        if (span) {
            scope.setSpan(span);
        }
        Logger.captureMessage(message, { ...scope, ...ctx });
    });
}
