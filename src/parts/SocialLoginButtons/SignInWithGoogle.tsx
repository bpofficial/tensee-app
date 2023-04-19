import { tracedFetch } from "@api";
import { captureError } from "@common";
import { useActivity, useColor } from "@hooks";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useOnLoginComplete } from "./onLoginComplete";

WebBrowser.maybeCompleteAuthSession();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const googleIcon = require("../../../assets/branding/google-icon.png");

export const SignInWithGoogle = ({ disabled = false }) => {
    const { setActive } = useActivity();
    const onLoginComplete = useOnLoginComplete();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId:
            "635247457778-81rqnkohtmjilqep4jd61e9dq8h01pk6.apps.googleusercontent.com",
        iosClientId:
            "635247457778-6hk52aj9s8vv1u880n7b481oj4nkbke9.apps.googleusercontent.com",
    });

    const onPrompt = () => {
        setActive(true);
        promptAsync();
    };

    const getUserInfo = async (t: string) => {
        try {
            const data = await tracedFetch(
                "https://www.googleapis.com/userinfo/v2/me",
                { headers: { Authorization: `Bearer ${t}` } }
            );

            const userInfo = await data.json();
            onLoginComplete({ ...userInfo, token: t }, "google");
        } catch (error) {
            captureError(error);
            setActive(false);
        }
    };

    useEffect(() => {
        if (response?.type === "success") {
            const accessToken = response.authentication?.accessToken ?? null;
            if (accessToken) {
                getUserInfo(accessToken);
                return;
            }
        }
        setActive(false);
    }, [response]);

    const color = useColor("black", "black");
    const backgroundColor = "white"; // useColorModeSelect("#4285f4", "#FFFFFF");
    const imageBackgroundColor = useColor("transparent", "transparent");
    // const image = useColorModeSelect(lightModeImage, darkModeImage);

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor }]}
            onPress={onPrompt}
            disabled={!request || disabled}
        >
            <View style={styles.centeredContainer}>
                <View
                    style={[
                        styles.imageContainer,
                        { backgroundColor: imageBackgroundColor },
                    ]}
                >
                    <Image
                        resizeMode="contain"
                        style={styles.image}
                        source={googleIcon}
                    />
                </View>
                <Text style={[styles.text, { color }]}>
                    Continue with Google
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        borderRadius: 4,
        flexDirection: "row",
        height: 54,
        justifyContent: "center",
        marginHorizontal: 12,
    },
    centeredContainer: {
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
    image: {
        height: 30,
        width: 70,
    },
    imageContainer: {
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        height: 54,
        justifyContent: "center",
        left: 0,
        position: "absolute",
        width: 70,
    },
    text: {
        fontSize: 18,
    },
});
