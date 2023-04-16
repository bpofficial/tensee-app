import { useColor } from "@hooks";
import {
    Input as ElementsInput,
    InputProps as ElementsInputProps,
    useTheme,
} from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useForm } from "../CandleForm";
import { CandleInputPasswordVisibilityToggle } from "./CandleInputPasswordVisibilityToggle";
import { CandleInputRightIcon } from "./CandleInputRightIcon";
import { useInputContext } from "./InputContext";

export interface ICandleInputProps
    extends Omit<ElementsInputProps, "errorMessage"> {
    isError?: boolean;
    isSuccess?: boolean;
    errorText?: string;
}

export const CandleInput: React.FC<ICandleInputProps> = (inputProps) => {
    const field = useInputContext();
    const form = useForm();

    const props = {
        ...inputProps,
        ...form.getFieldProps(field.name),
    };

    const {
        theme: { colors },
    } = useTheme();
    const [focused, setFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const textColor = useColor("black", "grey1");
    const backgroundColor = useColor("white", "grey9");
    const focusBorderColor = props.isError
        ? colors.error
        : props.isSuccess
        ? colors.success
        : focused
        ? colors.focusOutline
        : props.disabled
        ? colors.grey6
        : colors.grey2;

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    return (
        <ElementsInput
            {...props}
            testID="candle-input"
            ref={props.ref as any}
            onFocus={(e) => {
                props.onFocus?.(e);
                setFocused(true);
            }}
            onBlur={(e) => {
                props.onBlur?.(e);
                setFocused(false);
            }}
            style={[
                {
                    color: textColor,
                },
                props.style,
            ]}
            errorMessage={props.errorText}
            errorStyle={styles.errorMessage}
            secureTextEntry={props.secureTextEntry && !isPasswordVisible}
            inputContainerStyle={[
                styles.inputContainer,
                { borderColor: focusBorderColor },
                { backgroundColor },
            ]}
            rightIcon={
                <CandleInputRightIcon>
                    {props.secureTextEntry && (
                        <CandleInputPasswordVisibilityToggle
                            isVisible={isPasswordVisible}
                            toggleVisibility={togglePasswordVisibility}
                            disabled={props.disabled}
                        />
                    )}
                </CandleInputRightIcon>
            }
        />
    );
};

const styles = StyleSheet.create({
    errorMessage: {
        display: "none",
    },
    inputContainer: {
        borderRadius: 4,
        borderWidth: 1,
        height: 50,
        paddingHorizontal: 12,
    },
});
