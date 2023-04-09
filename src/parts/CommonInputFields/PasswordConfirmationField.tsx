import {
    CandleInput,
    CandleInputControl,
    CandleInputErrorMessage,
    CandleInputHelperText,
    CandleInputLabel,
    ICandleInputProps,
} from "@components";

export const PasswordConfirmationField: React.FC<ICandleInputProps> = (
    props
) => {
    return (
        <CandleInputControl name="passwordConfirmation" required>
            <CandleInputLabel label="Confirm Password" />
            <CandleInput
                secureTextEntry
                placeholder="Confirm Password"
                returnKeyType="done"
                {...props}
            />
            <CandleInputErrorMessage />
            <CandleInputHelperText helperText="" />
        </CandleInputControl>
    );
};
