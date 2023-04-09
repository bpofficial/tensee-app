import { ThemeProvider, createTheme, useTheme } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createExtendedTheme } from "./src/common";
import { AuthProvider } from "./src/hooks";
import { RegisterFormScreen } from "./src/screens/register";

function App() {
    const { theme } = useTheme();
    const backgroundColor = theme.colors.background;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <RegisterFormScreen />
            <StatusBar style="auto" />
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
    const colorMode = useColorScheme() ?? "light";
    const extendedTheme = createExtendedTheme(colorMode, {});
    const theme = createTheme(extendedTheme);

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <SafeAreaProvider>
                    <App />
                </SafeAreaProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
