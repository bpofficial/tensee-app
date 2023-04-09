import { useColor } from "@hooks";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { useInputContext } from "./InputContext";

interface ICandleInputLabelProps {
    label: string;
}

export const CandleInputLabel = ({ label }: ICandleInputLabelProps) => {
    const field = useInputContext();
    const labelColor = useColor("grey6", "grey2");
    const requiredColor = useColor("error", "error");

    return (
        <Text
            testID="candle-input-label"
            style={[styles.label, { color: labelColor }]}
        >
            {label}
            {field.required && (
                <Text
                    testID="candle-input-label-required"
                    style={{ color: requiredColor }}
                >
                    {" *"}
                </Text>
            )}
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
