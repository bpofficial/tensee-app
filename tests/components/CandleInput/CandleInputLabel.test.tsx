import { CandleInputLabel } from "@components";
import React from "react";
import { renderWithFormContext } from "../../utils";

describe("CandleInputLabel", () => {
    it("renders the label correctly", () => {
        const { getByTestId } = renderWithFormContext(
            <CandleInputLabel label="Test label" />,
            {
                getFieldProps() {
                    return {};
                },
            },
            {
                name: "test",
                required: true,
            }
        );

        const label = getByTestId("candle-input-label");
        const required = getByTestId("candle-input-label-required");

        expect(label).toBeTruthy();
        expect(required).toBeTruthy();
        expect(label).toHaveTextContent("Test label");
        expect(required).toHaveTextContent("*");
    });
});
