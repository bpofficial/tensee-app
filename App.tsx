import { createExtendedTheme } from "@common";
import {
    AppStateProvider,
    AttestationProvider,
    AuthProvider,
    BiometricProvider,
    CredentialProvider,
    PinAuthProvider,
    TaskProvider,
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
                <ThemeProvider theme={theme}>
                    <TaskProvider>
                        <AppStateProvider>
                            <BiometricProvider>
                                <PinAuthProvider>
                                    <CredentialProvider>
                                        <AuthProvider>
                                            <AttestationProvider>
                                                <SafeAreaProvider>
                                                    <App />
                                                </SafeAreaProvider>
                                            </AttestationProvider>
                                        </AuthProvider>
                                    </CredentialProvider>
                                </PinAuthProvider>
                            </BiometricProvider>
                        </AppStateProvider>
                    </TaskProvider>
                </ThemeProvider>
            </Sentry.Native.TouchEventBoundary>
        </Sentry.Native.ErrorBoundary>
    );
}
