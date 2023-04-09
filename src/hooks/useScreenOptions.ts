import { useTheme } from "@rneui/themed";

export function useScreenOptions() {
    const { theme } = useTheme();
    const backgroundColor = theme.colors.background;

    return {
        headerShown: false,
        contentStyle: {
            backgroundColor,
        },
    };
}
