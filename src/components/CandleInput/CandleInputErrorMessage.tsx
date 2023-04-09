import { useTheme } from "@rneui/themed";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { useForm } from "../CandleForm";
import { useInputContext } from "./InputContext";

export const CandleInputErrorMessage = () => {
    const field = useInputContext();
    const form = useForm();
    const {
        theme: { colors },
    } = useTheme();

    const { isError, errorText } = form.getFieldProps(field.name);

    if (!isError) return null;

    return (
        <Text style={[styles.errorText, { color: colors.error }]}>
            {errorText}
        </Text>
    );
};

const styles = StyleSheet.create({
    errorText: {
        fontSize: 12,
        marginTop: 6,
        paddingHorizontal: 12,
    },
});
