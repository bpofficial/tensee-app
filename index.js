import { routingInstrumentation } from "@navigation";
import { registerRootComponent } from "expo";
import * as Sentry from "sentry-expo";

Sentry.init({
    dsn: "https://b74bc21c7e414440909917b6f6d5cc97@o4504537071681536.ingest.sentry.io/4504984304615424",
    enableInExpoDevelopment: true,
    // debug: true,
    // enableAutoPerformanceTracking: true,
    // enableAutoSessionTracking: true,
    enableNativeCrashHandling: true,
    enableOutOfMemoryTracking: true,
    // tracesSampler: (ctx) => console.log("Trace: ", ctx),
    tracesSampleRate: 0.2,
    sampleRate: 1.0,
    integrations: [
        new Sentry.Native.ReactNativeTracing({
            // Pass instrumentation to be used as `routingInstrumentation`
            routingInstrumentation,
        }),
    ],
    beforeSend: async (event) => {
        // Get the device ID and set it as a tag in Sentry events
        const deviceId = await getOrCreateDeviceId();
        event.tags = event.tags || {};
        event.tags.deviceId = deviceId;

        // console.log(JSON.stringify(event, null, 4));
        return event;
    },
});

import { getOrCreateDeviceId } from "@utils";
import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
