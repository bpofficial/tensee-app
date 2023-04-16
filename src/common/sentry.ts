import { Native } from "sentry-expo";

let _scope = Native.getCurrentHub().getScope();

Native.getCurrentHub().configureScope((scope) => {
    if (!_scope) _scope = scope;
});

export const Logger = Native;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const Scope = _scope!;

export const startChildSpan = (
    ctx: Parameters<typeof Native["startTransaction"]>[0] & { new?: boolean }
) => {
    const span = Scope.getSpan();
    // console.log("");
    // console.log("curr span: ", span?.op, (span as any)?._name);
    // console.log("next span: ", ctx.op, ctx.description || ctx.name, "\n");
    if (span && !ctx.new) {
        return span.startChild(ctx);
    }
    const transaction = Native.startTransaction(ctx);
    return transaction;
};
