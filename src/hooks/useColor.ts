import { Colors, CustomColors, useTheme } from "@rneui/themed";
import { useColorScheme } from "react-native";

type Key = keyof (Omit<Colors, "platform"> & CustomColors);

export function useColor(light: Key, dark: Key, fallback?: string) {
    const { theme } = useTheme();
    const colorMode = useColorScheme();
    return (
        (colorMode === "dark" ? theme.colors[dark] : theme.colors[light]) ??
        fallback
    );
}
