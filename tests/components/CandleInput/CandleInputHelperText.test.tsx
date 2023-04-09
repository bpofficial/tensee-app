import { CandleInputHelperText } from "@components";
import React from "react";
import { renderWithFormContext } from "../../utils";

describe("CandleInputHelperText", () => {
    it("renders the helper text correctly", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInputHelperText helperText="Test help text" />,
            {
                getFieldProps() {
                    return {
                        isError: false,
                        errorText: undefined,
                    };
                },
            },
            {
                name: "test",
                required: true,
            }
        );

        const helperText = getByTestId("candle-input-helper-text");

        expect(helperText).toBeTruthy();
        expect(helperText).toHaveTextContent("Test help text");
    });

    it("renders when there's an error but no errorText", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInputHelperText helperText="Test help text" />,
            {
                getFieldProps() {
                    return {
                        isError: true,
                        errorText: undefined,
                    };
                },
            },
            {
                name: "test",
                required: true,
            }
        );

        const helperText = getByTestId("candle-input-helper-text");
        expect(helperText).toBeTruthy();
    });

    it("renders nothing when there's an error and errorText", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInputHelperText helperText="Test help text" />,
            {
                getFieldProps() {
                    return {
                        isError: true,
                        errorText: "Some error",
                    };
                },
            },
            {
                name: "test",
                required: true,
            }
        );

        expect(() => getByTestId("candle-input-helper-text")).toThrow();
    });
});
