import { useColor } from "@hooks";
import { Divider } from "@rneui/base";
import { DividerProps } from "@rneui/themed";
import { useMemo, useState } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

interface ICandleDividerProps extends DividerProps {
    label?: string;
    labelStyle?: StyleProp<TextStyle>;
}

const HORIZONTAL_PADDING = 4;

export const CandleDivider: React.FC<ICandleDividerProps> = ({
    label,
    labelStyle,
    ...props
}) => {
    const color = useColor("grey4", "grey2");
    const backgroundColor = useColor("background", "background");

    const [width, setWidth] = useState(0);
    const [textWidth, setTextWidth] = useState(0);

    const left = useMemo(
        () => width / 2 - textWidth / 2 - HORIZONTAL_PADDING / 4,
        [width, textWidth]
    );

    return (
        <View
            onLayout={(event) => {
                setWidth(event.nativeEvent.layout.width);
            }}
        >
            <Divider {...props} style={props.style}>
                {label ? (
                    <Text
                        onLayout={(event) => {
                            setTextWidth(event.nativeEvent.layout.width);
                        }}
                        style={[
                            styles.label,
                            { color, backgroundColor, left },
                            labelStyle,
                        ]}
                    >
                        {label}
                    </Text>
                ) : null}
            </Divider>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        paddingHorizontal: HORIZONTAL_PADDING,
        position: "absolute",
        top: -9,
    },
});
