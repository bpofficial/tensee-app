import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { useForm } from "../CandleForm";
import { useInputContext } from "./InputContext";

export const CandleInputRightIcon = ({ children }: PropsWithChildren) => {
    const {
        theme: { colors },
    } = useTheme();
    const field = useInputContext();
    const form = useForm();

    const props = form.getFieldProps(field.name);
    const { isError = false, isSuccess = false } = props;

    const iconColor = isError
        ? colors.error
        : isSuccess
        ? colors.success
        : colors.primary;

    const iconName = isError
        ? "close-circle"
        : isSuccess
        ? "checkmark-circle"
        : "";

    return (
        <View style={styles.inputIcon}>
            {isError || isSuccess ? (
                <Ionicons name={iconName as any} size={24} color={iconColor} />
            ) : undefined}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    inputIcon: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
});
