import {
    CandleInput,
    CandleInputControl,
    CandleInputErrorMessage,
    CandleInputHelperText,
    ICandleInputProps,
} from "@components";

export const EmailField: React.FC<ICandleInputProps> = (props) => {
    return (
        <CandleInputControl name="email" required>
            {/* <CandleInputLabel label="Email Address" /> */}
            <CandleInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                {...props}
            />
            <CandleInputErrorMessage />
            <CandleInputHelperText helperText="" />
        </CandleInputControl>
    );
};
