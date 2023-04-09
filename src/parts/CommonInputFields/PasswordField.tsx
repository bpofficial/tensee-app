import {
    CandleInput,
    CandleInputControl,
    CandleInputErrorMessage,
    CandleInputHelperText,
    CandleInputLabel,
    ICandleInputProps,
} from "@components";

export const PasswordField: React.FC<ICandleInputProps> = (props) => {
    return (
        <CandleInputControl name="password" required>
            <CandleInputLabel label="Password" />
            <CandleInput
                secureTextEntry
                placeholder="Password"
                returnKeyType="next"
                {...props}
            />
            <CandleInputErrorMessage />
            <CandleInputHelperText helperText="" />
        </CandleInputControl>
    );
};
