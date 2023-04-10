import { FontAwesome5 } from "@expo/vector-icons";
import { useColor } from "@hooks";
import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useForm } from "./CandleForm";

export const CandleFormErrors = () => {
    const form = useForm();
    const backgroundColor = useColor("error", "error");
    const color = useColor("white", "white");

    if (!form.formError) return null;

    return (
        <View style={styles.container}>
            <View style={[styles.pill, { backgroundColor }]}>
                <FontAwesome5
                    name="exclamation-triangle"
                    size={20}
                    color="white"
                    style={styles.icon}
                />
                <Text style={[styles.text, { color }]}>{form.formError}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        paddingBottom: 16,
    },
    icon: {
        flex: 2,
        left: 8,
    },
    pill: {
        alignItems: "center",
        borderRadius: 4,
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    text: {
        flexWrap: "wrap",
        flex: 14,
        fontSize: 16,
        textAlign: "left",
    },
});
