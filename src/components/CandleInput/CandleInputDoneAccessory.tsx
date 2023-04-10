import {
    Button,
    InputAccessoryView,
    Keyboard,
    StyleSheet,
    View,
} from "react-native";

interface ICandleInputDoneAccessoryProps {
    id: string;
}

export const CandleInputDoneAccessory: React.FC<
    ICandleInputDoneAccessoryProps
> = ({ id }) => {
    return (
        <InputAccessoryView backgroundColor={"white"} nativeID={id}>
            <View style={styles.buttonContainer}>
                <Button onPress={Keyboard.dismiss} title="Done" />
            </View>
        </InputAccessoryView>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "flex-end",
    },
});
