import { createContext } from "react";
import * as Yup from "yup";
import { ICandleInputProps } from "../CandleInput";

/**
 * The context state for the CandleForm.
 */
export interface ICandleFormContextState<
    T extends Yup.ObjectSchema<Yup.AnyObject>
> {
    schema: T;
    formError?: string;
    isValid: boolean;
    getFieldProps(field: string): Partial<ICandleInputProps>;
    handleSubmit(): void;
}

/**
 * Initialize the context with a default state.
 */
export const CandleFormContext = createContext<ICandleFormContextState<any>>({
    schema: null,
    isValid: false,
    getFieldProps() {
        return {};
    },
    handleSubmit() {
        //
    },
});
