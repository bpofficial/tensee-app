import {
    CandleInput,
    CandleInputControl,
    CandleInputErrorMessage,
    CandleInputHelperText,
    CandleInputLabel,
    ICandleInputProps,
} from "@components";

export const FullNameField: React.FC<ICandleInputProps> = (props) => {
    return (
        <CandleInputControl name="name" required>
            <CandleInputLabel label="Full Name" />
            <CandleInput
                placeholder="John Doe"
                keyboardType="default"
                autoCapitalize="words"
                autoComplete="name"
                returnKeyType="next"
                {...props}
            />
            <CandleInputErrorMessage />
            <CandleInputHelperText helperText="" />
        </CandleInputControl>
    );
};
