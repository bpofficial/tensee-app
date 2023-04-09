import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import { TouchableOpacity, useColorScheme } from "react-native";

interface ICandleInputPasswordVisibilityToggleProps {
    toggleVisibility: () => void;
    isVisible: boolean;
}

export const CandleInputPasswordVisibilityToggle = ({
    toggleVisibility,
    isVisible,
}: ICandleInputPasswordVisibilityToggleProps) => {
    const { theme } = useTheme();
    const colorMode = useColorScheme();
    const color =
        colorMode === "dark" ? theme.colors.grey2 : theme.colors.black;

    return (
        <TouchableOpacity
            testID="candle-input-visibility-toggle"
            onPress={toggleVisibility}
        >
            <MaterialIcons
                name={isVisible ? "visibility-off" : "visibility"}
                size={24}
                color={color}
            />
        </TouchableOpacity>
    );
};
