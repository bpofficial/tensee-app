import { CandleDivider } from "@components";
import {
    LoginForm,
    SignInWithApple,
    SignInWithFacebook,
    SignInWithGoogle,
} from "@parts";
import React from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from "react-native";

export const LoginScreen = () => {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
        >
            <View style={styles.centeredContainer}>
                <View style={styles.logo}>
                    <Image
                        source={require("../../../../assets/icon-transparent.png")}
                    />
                </View>
                <LoginForm />
                <CandleDivider label="or" />
                <View style={styles.socialButtons}>
                    <SignInWithApple />
                    <SignInWithGoogle />
                    <SignInWithFacebook />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        gap: 32,
    },
    container: {
        flex: 1,
        marginTop: 24,
    },
    logo: {
        alignSelf: "center",
        marginBottom: 16,
        padding: 8,
    },
    socialButtons: {
        flexDirection: "column",
        gap: 12,
    },
});
