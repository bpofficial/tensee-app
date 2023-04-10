import { routingInstrumentation } from "@navigation";
import { registerRootComponent } from "expo";
import * as Sentry from "sentry-expo";

Sentry.init({
    dsn: "https://b74bc21c7e414440909917b6f6d5cc97@o4504537071681536.ingest.sentry.io/4504984304615424",
    enableInExpoDevelopment: true,
    debug: true,
    enableAutoPerformanceTracking: true,
    enableAutoSessionTracking: true,
    enableNativeCrashHandling: true,
    enableOutOfMemoryTracking: true,
    integrations: [
        new Sentry.Native.ReactNativeTracing({
            // Pass instrumentation to be used as `routingInstrumentation`
            routingInstrumentation,
        }),
    ],
});

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
