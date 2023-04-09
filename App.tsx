import { createExtendedTheme } from "@common";
import { AuthProvider } from "@hooks";
import { Navigation, routingInstrumentation } from "@navigation";
import {
    ThemeProvider,
    createTheme,
    useTheme,
    useThemeMode,
} from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Sentry from "sentry-expo";

Sentry.init({
    dsn: "https://b74bc21c7e414440909917b6f6d5cc97@o4504537071681536.ingest.sentry.io/4504984304615424",
    enableInExpoDevelopment: true,
    debug: true,
    sampleRate: 1.0,
    integrations: [
        new Sentry.Native.ReactNativeTracing({
            // Pass instrumentation to be used as `routingInstrumentation`
            routingInstrumentation,
        }),
    ],
});

function App() {
    const { theme } = useTheme();
    const { setMode } = useThemeMode();
    const colorMode = useColorScheme() ?? "light";

    const backgroundColor = theme.colors.background;

    useEffect(() => setMode(colorMode), [colorMode]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar style="auto" />
            <Navigation />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
});

export default function AppRoot() {
    const extendedTheme = createExtendedTheme({});
    const theme = useMemo(() => createTheme(extendedTheme), [extendedTheme]);

    return (
        <Sentry.Native.ErrorBoundary>
            <Sentry.Native.TouchEventBoundary>
                <AuthProvider>
                    <ThemeProvider theme={theme}>
                        <SafeAreaProvider>
                            <App />
                        </SafeAreaProvider>
                    </ThemeProvider>
                </AuthProvider>
            </Sentry.Native.TouchEventBoundary>
        </Sentry.Native.ErrorBoundary>
    );
}
