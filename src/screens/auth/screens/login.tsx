import { CandleDivider } from "@components";
import {
    ActivityConsumer,
    ActivityProvider,
    useAttemptBiometricLogin,
} from "@hooks";
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const TenseeLogo = require("../../../../assets/icon-transparent.png");

export const LoginScreen = () => {
    useAttemptBiometricLogin();

    return (
        <ActivityProvider>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
            >
                <ActivityConsumer>
                    {({ isActive }) => (
                        <View style={styles.centeredContainer}>
                            <View style={styles.logo}>
                                <Image source={TenseeLogo} />
                            </View>
                            <LoginForm disabled={isActive} />
                            <CandleDivider label="or" />
                            <View style={styles.socialButtons}>
                                <SignInWithApple disabled={isActive} />
                                <SignInWithGoogle disabled={isActive} />
                                <SignInWithFacebook disabled={isActive} />
                            </View>
                        </View>
                    )}
                </ActivityConsumer>
            </KeyboardAvoidingView>
        </ActivityProvider>
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
