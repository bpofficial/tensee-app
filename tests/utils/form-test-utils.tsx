import { DarkTheme, LightTheme } from "@common/theme";
import {
    CandleFormContext,
    ICandleFormContextState,
} from "@components/CandleForm/FormContext";
import {
    CandleInputContextProvider,
    ICandleInputContextProviderProps,
} from "@components/CandleInput/InputContext";
import { ThemeProvider } from "@rneui/themed";
import { RenderOptions, render } from "@testing-library/react-native";
import React, { PropsWithChildren } from "react";

export const renderWithFormContext = (
    ui: React.ReactElement,
    mockedFormContext: Partial<ICandleFormContextState<any>>,
    inputContextProps?: Partial<ICandleInputContextProviderProps>,
    lightMode = true,
    options?: RenderOptions
) => {
    const theme = lightMode ? LightTheme : DarkTheme;
    const Wrapper: React.FC = ({ children }: PropsWithChildren) => (
        <ThemeProvider theme={theme}>
            <CandleFormContext.Provider value={mockedFormContext as any}>
                {inputContextProps ? (
                    <CandleInputContextProvider {...(inputContextProps as any)}>
                        {children}
                    </CandleInputContextProvider>
                ) : (
                    children
                )}
            </CandleFormContext.Provider>
        </ThemeProvider>
    );

    return render(ui, { wrapper: Wrapper, ...options });
};
