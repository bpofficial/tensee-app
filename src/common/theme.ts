import { CreateThemeOptions, createTheme } from "@rneui/themed";

export const createExtendedTheme = (
    defaultTheme: Partial<CreateThemeOptions>
) =>
    createTheme({
        ...CandleTheme,
        components: {
            ...(defaultTheme.components ?? {}),
            ...(CandleTheme.components ?? {}),
        },
        spacing: {
            ...(defaultTheme.spacing ?? {}),
            ...(CandleTheme.spacing ?? {}),
        },
    });

export const CandleTheme: Partial<CreateThemeOptions> = {
    mode: "light",
    lightColors: {
        primary: "#dd6649",
        secondary: "",

        grey0: "#F7F7F7",
        grey1: "#E0E0E0",
        grey2: "#BDBDBD",
        grey3: "#9E9E9E",
        grey4: "#757575",
        grey5: "#616161",
        grey6: "#4D4D4D",
        grey7: "#3C3C3C",
        grey8: "#2B2B2B",
        grey9: "#1F1F1F",
        grey10: "#141414",
        grey11: "#0A0A0A",

        focusOutline: "#4D4D4D",

        success: "green",
        error: "#B00020",

        white: "white",
        black: "black",

        transparent: "transparent",
        background: "#E0E0E0",
    },
    darkColors: {
        primary: "#dd6649",
        secondary: "",

        grey0: "#F7F7F7",
        grey1: "#E0E0E0",
        grey2: "#BDBDBD",
        grey3: "#9E9E9E",
        grey4: "#757575",
        grey5: "#616161",
        grey6: "#4D4D4D",
        grey7: "#3C3C3C",
        grey8: "#2B2B2B",
        grey9: "#1F1F1F",
        grey10: "#141414",
        grey11: "#0A0A0A",

        focusOutline: "#E0E0E0",

        success: "green",
        // error: "#B00020",

        white: "white",
        black: "black",

        background: "#161414",
    },
};
