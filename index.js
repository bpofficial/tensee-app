import { routingInstrumentation } from "@navigation";
import { registerRootComponent } from "expo";
import * as Sentry from "sentry-expo";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableInExpoDevelopment: true,
    enableNativeCrashHandling: true,
    enableOutOfMemoryTracking: true,
    tracesSampleRate: 1.0,
    sampleRate: 1.0,
    integrations: [
        new Sentry.Native.ReactNativeTracing({
            routingInstrumentation,
        }),
    ],
    beforeSend: async (event) => {
        const deviceId = await getOrCreateDeviceId();
        event.tags = event.tags || {};
        event.tags.deviceId = deviceId;

        return event;
    },
});

import { getOrCreateDeviceId } from "@utils";
import App from "./App";

registerRootComponent(App);
