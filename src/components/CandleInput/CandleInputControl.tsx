import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { CandleInputContextProvider } from "./InputContext";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICandleInputControl {
    required?: boolean;
    name: string;
}

export const CandleInputControl = ({
    required = false,
    name,
    children,
}: PropsWithChildren<ICandleInputControl>) => {
    return (
        <CandleInputContextProvider {...{ name, required }}>
            <View style={styles.container} testID="candle-input-control">
                {children}
            </View>
        </CandleInputContextProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
});
