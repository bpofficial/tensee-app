/* eslint-disable react-native/no-unused-styles */
import { Theme, useTheme } from "@rneui/themed";
import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
import { isBackgroundColorNotWhiteOrTransparent } from "../../utils/isBackgroundSolid";
import { CandleLoadingIndicator } from "../LoadingIndicator";

const CandleButtonVariants = [
    "primary",
    "secondary",
    "outline",
    "plain",
    "destructive",
    "slim",
];

interface ICandleButtonProps {
    onPress(): void;
    title: string;
    variant?: typeof CandleButtonVariants[number];
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const CandleButton = ({
    onPress,
    title,
    variant = "primary",
    disabled = false,
    loading = false,
    style,
    textStyle,
}: ICandleButtonProps) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const buttonStyles: ViewStyle[] = [
        styles.button,
        (styles as Record<string, ViewStyle>)[variant],
        style as ViewStyle,
    ];

    const textStyles: TextStyle[] = [
        styles.text,
        (styles as Record<string, TextStyle>)[`${variant}Text`],
        textStyle as TextStyle,
    ];

    if (disabled) {
        buttonStyles.push(styles.disabled);
        textStyles.push(styles.disabledText);
    }

    const isSolidBackground =
        isBackgroundColorNotWhiteOrTransparent(buttonStyles);

    return (
        <TouchableOpacity
            activeOpacity={disabled || loading ? 1 : 0.65}
            onPress={onPress}
            style={buttonStyles}
            disabled={disabled || loading}
        >
            {loading ? (
                <CandleLoadingIndicator
                    variant={
                        disabled
                            ? "disabled"
                            : isSolidBackground
                            ? "white"
                            : "primary"
                    }
                    size={18}
                />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

function getStyles({ colors }: Theme) {
    const styles = StyleSheet.create({
        button: {
            alignItems: "center",
            borderRadius: 4,
            justifyContent: "center",
            marginHorizontal: 12,
            marginVertical: 5,
            minWidth: 100,
            paddingHorizontal: 20,
            paddingVertical: 16,
        },
        destructive: {
            backgroundColor: colors.error,
        },
        destructiveText: {
            color: colors.white,
        },
        disabled: {
            backgroundColor: colors.grey3,
            borderColor: colors.grey4,
        },
        disabledText: {
            color: colors.white,
        },
        outline: {
            backgroundColor: colors.transparent,
            borderColor: colors.primary,
            borderWidth: 1,
        },
        outlineText: {
            color: colors.primary,
        },
        plain: {
            backgroundColor: colors.transparent,
        },
        plainText: {
            color: colors.primary,
        },
        primary: {
            backgroundColor: colors.primary,
        },
        primaryText: {
            color: colors.white,
        },
        secondary: {
            backgroundColor: colors.secondary,
        },
        secondaryText: {
            color: colors.white,
        },
        slim: {
            paddingHorizontal: 12,
            paddingVertical: 6,
        },
        text: {
            fontSize: 18,
        },
    });

    return styles;
}
