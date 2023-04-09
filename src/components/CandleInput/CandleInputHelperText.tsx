import { useTheme } from "@rneui/themed";
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
    const {
        theme: { colors },
    } = useTheme();

    const { isError, errorText } = form.getFieldProps(field.name);
    const helperTextColor = colors.grey4;

    if (isError && errorText) return null;

    return (
        <Text style={[styles.helperText, { color: helperTextColor }]}>
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
