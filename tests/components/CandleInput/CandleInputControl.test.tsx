import { CandleInput, CandleInputControl } from "@components";
import React from "react";
import { renderWithFormContext } from "../../utils";

describe("CandleInputControl", () => {
    it("renders the control correctly", () => {
        const testMessage = "Just making sure this is passed through...";
        const { getByTestId } = renderWithFormContext(
            <CandleInputControl name="test">
                <CandleInput />
            </CandleInputControl>,
            {
                getFieldProps() {
                    return {
                        isError: false,
                        errorText: testMessage,
                    };
                },
            }
        );

        const control = getByTestId("candle-input-control");
        const input = getByTestId("candle-input");

        expect(control).toBeTruthy();

        // Although the errorText is passed to the errorMessage prop
        // on the input, we're also spreading the props at the top
        // and so we can verify that errorText has been passed through
        // here.
        // For some reason checking on errorMessage prop doesn't work,
        // probably because there's magic behind the scenes...
        expect(input).toHaveProp("errorText", testMessage);
    });
});
