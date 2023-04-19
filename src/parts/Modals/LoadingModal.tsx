import { CandleLoadingIndicator } from "@components";
import { useColor } from "@hooks";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface LoadingModalProps {
    isLoading: boolean;
}

export const LoadingModal = ({ isLoading = false }: LoadingModalProps) => {
    const color = useColor("white", "white");

    return (
        <Modal animationType="none" transparent={true} visible={isLoading}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <CandleLoadingIndicator size={28} />
                    <Text style={[styles.modalText, { color }]}>Loading</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // eslint-disable-next-line react-native/no-color-literals
    centeredView: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        flex: 1,
        justifyContent: "center", // Set the background color and opacity
    },
    modalText: {
        fontSize: 18,
        paddingTop: 32,
        textAlign: "center",
    },
    // eslint-disable-next-line react-native/no-color-literals
    modalView: {
        alignItems: "center",
        borderRadius: 4,
        elevation: 5,
        margin: 20,
        paddingHorizontal: 54,
        paddingVertical: 36,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
