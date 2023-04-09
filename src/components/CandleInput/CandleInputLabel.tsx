import { useTheme } from "@rneui/themed";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { useInputContext } from "./InputContext";

interface ICandleInputLabelProps {
    label: string;
}

export const CandleInputLabel = ({ label }: ICandleInputLabelProps) => {
    const field = useInputContext();
    const {
        theme: { colors },
    } = useTheme();

    const labelColor = colors.grey6;
    const requiredColor = colors.error;

    return (
        <Text style={[styles.label, { color: labelColor }]}>
            {label}
            {field.required && <Text style={{ color: requiredColor }}> *</Text>}
        </Text>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 8,
        paddingHorizontal: 12,
    },
});
