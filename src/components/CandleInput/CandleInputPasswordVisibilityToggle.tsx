import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

interface ICandleInputPasswordVisibilityToggleProps {
    toggleVisibility: () => void;
    isVisible: boolean;
}

export const CandleInputPasswordVisibilityToggle = ({
    toggleVisibility,
    isVisible,
}: ICandleInputPasswordVisibilityToggleProps) => {
    return (
        <TouchableOpacity onPress={toggleVisibility}>
            <MaterialIcons
                name={isVisible ? "visibility-off" : "visibility"}
                size={24}
                color="black"
            />
        </TouchableOpacity>
    );
};
