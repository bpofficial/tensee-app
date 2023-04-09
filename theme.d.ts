import "@rneui/themed";

declare module "@rneui/themed" {
    interface CustomColors {
        transparent: string;
        focusOutline: string;
        grey6: string;
        grey7: string;
        grey8: string;
        grey9: string;
        grey10: string;
        grey11: string;
    }

    type ExtendedColors = Colors & CustomColors;

    export interface Theme {
        colors: ExtendedColors;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Colors extends CustomColors {
        //
    }
}
