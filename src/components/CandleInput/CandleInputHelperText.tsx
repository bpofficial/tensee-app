import { useColor } from "@hooks";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { useForm } from "../CandleForm";
import { useInputContext } from "./InputContext";

export interface ICandleInputHelperTextProps {
    helperText?: string;
}

export const CandleInputHelperText = ({
    helperText,
}: ICandleInputHelperTextProps) => {
    const field = useInputContext();
    const form = useForm();

    const { isError, errorText } = form.getFieldProps(field.name);
    const helperTextColor = useColor("grey4", "grey3");

    if (isError && errorText) return null;

    return (
        <Text
            testID="candle-input-helper-text"
            style={[styles.helperText, { color: helperTextColor }]}
        >
            {helperText}
        </Text>
    );
};

const styles = StyleSheet.create({
    helperText: {
        fontSize: 12,
        marginTop: 6,
        paddingHorizontal: 12,
    },
});
