import { useColor } from "@hooks";
import {
    ResponseType,
    makeRedirectUri,
    useAuthRequest,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const googleIcon = require("../../../assets/branding/google-icon.png");

export const SignInWithGoogle = () => {
    const androidClientId = "YOUR_ANDROID_CLIENT_ID";
    const iosClientId = "YOUR_IOS_CLIENT_ID";

    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            clientId: Platform.select({
                android: "<YOUR_ANDROID_CLIENT_ID>",
                ios: "<YOUR_IOS_CLIENT_ID>",
            })!,
            scopes: ["profile", "email"],
            usePKCE: false,
            redirectUri: makeRedirectUri({
                scheme: "tenseeapp",
            }),
        },
        {
            authorizationEndpoint:
                "https://accounts.google.com/o/oauth2/v2/auth",
            tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
            revocationEndpoint: "https://oauth2.googleapis.com/revoke",
        }
    );

    useEffect(() => {
        if (response?.type === "success") {
            const { access_token } = response.params;
            // Use the access token to fetch user's profile, email, etc.
        }
    }, [response]);

    const color = useColor("black", "black");
    const backgroundColor = "white"; // useColorModeSelect("#4285f4", "#FFFFFF");
    const imageBackgroundColor = useColor("transparent", "transparent");
    // const image = useColorModeSelect(lightModeImage, darkModeImage);

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor }]}
            onPress={() => promptAsync()}
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
