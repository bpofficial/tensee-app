import { LightTheme } from "@common/theme";
import { CandleInput } from "@components";
import { act, fireEvent } from "@testing-library/react-native";
import React from "react";
import { renderWithFormContext } from "../../utils";

describe("CandleInput", () => {
    it("renders an error correctly", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInput placeholder="Test input" />,
            {
                getFieldProps() {
                    return {
                        isError: true,
                        errorText: "An error occured",
                    };
                },
            },
            {
                name: "test",
                required: true,
            }
        );

        const input = getByTestId("candle-input");
        const inputContainer = getByTestId("RNE__Input__text-container");
        const errorIcon = getByTestId("candle-input-right-icon");

        const iconName = errorIcon.children[0].props.name;

        expect(input).toBeTruthy();
        expect(errorIcon).toBeTruthy();
        expect(iconName).toBe("close-circle");
        expect(inputContainer).toHaveStyle({
            borderColor: LightTheme.lightColors?.error,
        });
    });

    it("renders success correctly", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInput placeholder="Test input" />,
            {
                getFieldProps() {
                    return {
                        isError: false,
                        isSuccess: true,
                    };
                },
            },
            {
                name: "test",
                required: true,
            }
        );

        const input = getByTestId("candle-input");
        const inputContainer = getByTestId("RNE__Input__text-container");
        const successIcon = getByTestId("candle-input-right-icon");

        const iconName = successIcon.children[0].props.name;

        expect(input).toBeTruthy();
        expect(successIcon).toBeTruthy();
        expect(iconName).toBe("checkmark-circle");
        expect(inputContainer).toHaveStyle({
            borderColor: LightTheme.lightColors?.success,
        });
    });

    it("handles focus & blur correctly", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInput placeholder="Test input" />,
            {
                getFieldProps() {
                    return {
                        isError: false,
                        isSuccess: false,
                    };
                },
            },
            {
                name: "test",
                required: true,
            }
        );

        const input = getByTestId("candle-input");
        const inputContainer = getByTestId("RNE__Input__text-container");

        expect(input).toBeTruthy();
        expect(inputContainer).toHaveStyle({
            borderColor: LightTheme.lightColors?.grey2,
        });

        act(() => {
            fireEvent(input, "focus");
        });

        expect(inputContainer).toHaveStyle({
            borderColor: LightTheme.lightColors?.primary,
        });

        act(() => {
            fireEvent(input, "blur");
        });

        expect(inputContainer).toHaveStyle({
            borderColor: LightTheme.lightColors?.grey2,
        });
    });

    it("handles toggling secure fields correctly", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInput placeholder="Test input" secureTextEntry />,
            {
                getFieldProps() {
                    return {
                        isSuccess: false,
                    };
                },
            },
            {
                name: "test",
                required: true,
            }
        );

        const input = getByTestId("candle-input");
        const inputContainer = getByTestId("RNE__Input__text-container");
        const toggleButton = getByTestId("candle-input-visibility-toggle");
        let toggleIcon = toggleButton.children[0].props.name;

        expect(input).toBeTruthy();
        expect(toggleButton).toBeTruthy();
        expect(inputContainer).toHaveStyle({
            borderColor: LightTheme.lightColors?.grey2,
        });
        expect(toggleIcon).toBe("visibility");

        act(() => {
            fireEvent.press(toggleButton);
        });

        toggleIcon = toggleButton.children[0].props.name;
        expect(toggleIcon).toBe("visibility-off");
    });
});
