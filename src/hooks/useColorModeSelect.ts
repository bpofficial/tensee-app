import { useColorScheme } from "react-native";

export function useColorModeSelect<L, D>(light: L, dark: D) {
    const colorMode = useColorScheme();
    return colorMode === "dark" ? dark : light;
}
