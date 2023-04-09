import { CreateThemeOptions, createTheme } from "@rneui/themed";
import { DarkTheme } from "./dark";
import { LightTheme } from "./light";

const themes = {
    light: LightTheme,
    dark: DarkTheme,
};

export const createExtendedTheme = (
    mode: keyof typeof themes,
    defaultTheme: Partial<CreateThemeOptions>
) =>
    createTheme({
        mode,
        lightColors: LightTheme.lightColors,
        darkColors: DarkTheme.darkColors,
        components: {
            ...(defaultTheme.components ?? {}),
            ...(themes[mode].components ?? {}),
        },
        spacing: {
            ...(defaultTheme.spacing ?? {}),
            ...(themes[mode].spacing ?? {}),
        },
    });
