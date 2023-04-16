import { MaterialIcons } from "@expo/vector-icons";
import { useColor } from "@hooks";
import { useTheme } from "@rneui/themed";
import { TouchableOpacity, useColorScheme } from "react-native";

interface ICandleInputPasswordVisibilityToggleProps {
    toggleVisibility: () => void;
    isVisible: boolean;
    disabled?: boolean;
}

export const CandleInputPasswordVisibilityToggle = ({
    toggleVisibility,
    isVisible,
    disabled = false,
}: ICandleInputPasswordVisibilityToggleProps) => {
    const { theme } = useTheme();
    const colorMode = useColorScheme();
    const color =
        colorMode === "dark" ? theme.colors.grey2 : theme.colors.black;

    const disabledColor = useColor("grey4", "grey6");

    const handlePress = () => {
        if (!disabled) toggleVisibility();
    };

    return (
        <TouchableOpacity
            testID="candle-input-visibility-toggle"
            onPress={handlePress}
            disabled={disabled}
        >
            <MaterialIcons
                name={isVisible ? "visibility-off" : "visibility"}
                size={24}
                color={disabled ? disabledColor : color}
            />
        </TouchableOpacity>
    );
};
