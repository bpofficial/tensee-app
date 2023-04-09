import { CandleInputErrorMessage } from "@components";
import React from "react";
import { renderWithFormContext } from "../../utils";

describe("CandleInputErrorMessage", () => {
    it("renders the error message correctly", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInputErrorMessage />,
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

        const errorMessage = getByTestId("candle-input-error-message");

        expect(errorMessage).toBeTruthy();
        expect(errorMessage).toHaveTextContent("Some error");
    });

    it("renders nothing when there's no error", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInputErrorMessage />,
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
                required: false,
            }
        );

        expect(() => getByTestId("candle-input-error-message")).toThrow();
    });
});
