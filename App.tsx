import { createExtendedTheme } from "@common";
import {
    AppStateProvider,
    AttestationProvider,
    AuthProvider,
    CredentialProvider,
    PinAuthProvider,
} from "@hooks";
import { Navigation } from "@navigation";
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
                <AppStateProvider>
                    <PinAuthProvider>
                        <CredentialProvider>
                            <AuthProvider>
                                <AttestationProvider>
                                    <ThemeProvider theme={theme}>
                                        <SafeAreaProvider>
                                            <App />
                                        </SafeAreaProvider>
                                    </ThemeProvider>
                                </AttestationProvider>
                            </AuthProvider>
                        </CredentialProvider>
                    </PinAuthProvider>
                </AppStateProvider>
            </Sentry.Native.TouchEventBoundary>
        </Sentry.Native.ErrorBoundary>
    );
}
