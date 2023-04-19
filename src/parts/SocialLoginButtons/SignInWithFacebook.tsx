import { tracedFetch } from "@api";
import { Config, captureError } from "@common";
import { useActivity, useColor } from "@hooks";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useOnLoginComplete } from "./onLoginComplete";

WebBrowser.maybeCompleteAuthSession();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const facebookColorIcon = require("../../../assets/branding/facebook-logo-color.png");
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const facebookWhiteIcon = require("../../../assets/branding/facebook-logo-white.png");

export const SignInWithFacebook = ({ disabled = false }) => {
    const { setActive } = useActivity();
    const onLoginComplete = useOnLoginComplete();

    const [request, response, promptAsync] = Facebook.useAuthRequest({
        clientId: Config.facebook.clientId,
        scopes: ["public_profile"],
    });

    const onPrompt = () => {
        setActive(true);
        promptAsync();
    };

    const getUserInfo = async (t: string) => {
        try {
            const data = await tracedFetch(
                `https://graph.facebook.com/me?access_token=${t}&fields=id,name,picture.type(large)`,
                null
            );

            const userInfo = await data.json();
            onLoginComplete({ ...userInfo, token: t }, "facebook");
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
    const backgroundColor = "white"; // useColorModeSelect("#1777f3", "white");
    const image = facebookColorIcon; // useColorModeSelect(facebookWhiteIcon, facebookColorIcon);

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor }]}
            onPress={onPrompt}
            activeOpacity={0.65}
            disabled={!request || disabled}
        >
            <View style={styles.centeredContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        resizeMode="contain"
                        style={styles.image}
                        source={image}
                    />
                </View>
                <Text style={[styles.text, { color }]}>
                    Continue with Facebook
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 4,
        flexDirection: "row",
        height: 54,
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
