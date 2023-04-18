import { tracedFetch } from "@api";
import { Logger, Scope, startChildSpan } from "@common";
import { useActivity, useAuth, useBoolean, useColor } from "@hooks";
import { useNavigation } from "@react-navigation/native";
import { Span } from "@sentry/types";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const googleIcon = require("../../../assets/branding/google-icon.png");

export const SignInWithGoogle = ({ disabled = false }) => {
    const [span, setSpan] = useState<Span | null>(null);
    const { navigate } = useNavigation();
    const { setUser } = useAuth();
    const { setActive } = useActivity();
    const [isLoading, loading] = useBoolean();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId:
            "635247457778-81rqnkohtmjilqep4jd61e9dq8h01pk6.apps.googleusercontent.com",
        iosClientId:
            "635247457778-6hk52aj9s8vv1u880n7b481oj4nkbke9.apps.googleusercontent.com",
    });

    const onPrompt = () => {
        setActive(true);
        setSpan(
            startChildSpan({
                name: "Continue w/ Google",
                op: "submit_social_login",
            })
        );
        promptAsync();
    };

    const getUserInfo = async (t: string) => {
        try {
            const data = await tracedFetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${t}` },
                },
                span
            );

            const result = await data.json();
            Scope.setSpan(span!);
            if (result.id) {
                setUser({
                    socialProvider: "google",
                    socialAccessToken: t,
                    firstName: result.name ?? result.given_name,
                    email: result.email,
                    id: result.id,
                });

                navigate("App", {
                    screen: "Home",
                    params: { fromLogin: true },
                });
            } else {
                Logger.addBreadcrumb({
                    type: "info",
                    level: "info",
                    message: "Google Response",
                    data: result,
                });
                throw new Error("Google info has no ID?");
            }

            setTimeout(() => {
                setActive(false);
                loading.off();
            }, 300);
        } catch (error) {
            Logger.captureException(error);
            console.log(error);
            setActive(false);
            loading.off();
        }
    };

    useEffect(() => {
        if (response?.type === "success") {
            const accessToken = response.authentication?.accessToken ?? null;
            if (accessToken) {
                getUserInfo(accessToken);

                span?.finish?.();
                return;
            }
        }
        setActive(false);
        loading.off();
        span?.finish?.();
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
