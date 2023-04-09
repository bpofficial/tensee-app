import {
    Input as ElementsInput,
    InputProps as ElementsInputProps,
} from "@rneui/base";
import { useTheme } from "@rneui/themed";
import React, { forwardRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { useForm } from "../CandleForm";
import { CandleInputPasswordVisibilityToggle } from "./CandleInputPasswordVisibilityToggle";
import { CandleInputRightIcon } from "./CandleInputRightIcon";
import { useInputContext } from "./InputContext";

export interface ICandleInputProps extends ElementsInputProps {
    isError?: boolean;
    isSuccess?: boolean;
    errorText?: string;
}

export const CandleInput = forwardRef<TextInput, ElementsInputProps>(
    function CandleInput(inputProps, ref) {
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

        const focusBorderColor = props.isError
            ? colors.error
            : props.isSuccess
            ? colors.success
            : focused
            ? colors.primary
            : colors.grey2;

        const togglePasswordVisibility = () => {
            setIsPasswordVisible((prevState) => !prevState);
        };

        return (
            <ElementsInput
                {...props}
                ref={ref as any}
                onFocus={(e) => {
                    props.onFocus?.(e);
                    setFocused(true);
                }}
                onBlur={(e) => {
                    props.onBlur?.(e);
                    setFocused(false);
                }}
                errorMessage={props.errorText}
                errorStyle={styles.errorMessage}
                secureTextEntry={props.secureTextEntry && !isPasswordVisible}
                inputContainerStyle={[
                    styles.inputContainer,
                    { borderColor: focusBorderColor },
                ]}
                rightIcon={
                    <CandleInputRightIcon>
                        {props.secureTextEntry && (
                            <CandleInputPasswordVisibilityToggle
                                isVisible={isPasswordVisible}
                                toggleVisibility={togglePasswordVisibility}
                            />
                        )}
                    </CandleInputRightIcon>
                }
            />
        );
    }
);

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
