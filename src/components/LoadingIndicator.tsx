import LottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";

// For more spinners:
// https://lottiefiles.com/1672-spinner
// https://editor.lottiefiles.com/?fileUrl=https://assets3.lottiefiles.com/datafiles/Zck6APGqt2fXSFF/data.json&origin=web&hash=MTY3Mi1zcGlubmVy&src=https://lottiefiles.com/upload-file/editor
const spinners = {
    primary: require("../../assets/animations/spinner-primary.json"),
    white: require("../../assets/animations/spinner-white.json"),
    disabled: require("../../assets/animations/spinner-disabled.json"),
};

interface ICandleLoadingIndicatorProps {
    size?: number;
    variant?: keyof typeof spinners;
}

export const CandleLoadingIndicator = ({
    size = 18,
    variant = "primary",
}: ICandleLoadingIndicatorProps) => {
    return (
        <View style={{ height: size + 4 }}>
            <LottieView
                source={spinners[variant]}
                autoPlay
                loop
                style={{
                    marginTop: -size / 8,
                    width: size * 2,
                    height: size * 2,
                }}
            />
        </View>
    );
};
