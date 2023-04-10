import { useColor } from "@hooks";
import {
    ResponseType,
    makeRedirectUri,
    useAuthRequest,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
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
const facebookColorIcon = require("../../../assets/branding/facebook-logo-color.png");
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const facebookWhiteIcon = require("../../../assets/branding/facebook-logo-white.png");

export const SignInWithFacebook = () => {
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: "<YOUR_FACEBOOK_APP_ID>",
            scopes: ["public_profile", "email"],
            redirectUri: makeRedirectUri({
                scheme: "tenseeapp",
            }),
            extraParams: {
                display: Platform.select({ web: "popup", default: "touch" }),
            },
        },
        {
            authorizationEndpoint:
                "https://www.facebook.com/v12.0/dialog/oauth",
            tokenEndpoint:
                "https://graph.facebook.com/v12.0/oauth/access_token",
        }
    );

    useEffect(() => {
        if (response?.type === "success") {
            const { access_token } = response.params;
            // Use the access token to fetch user's profile, email, etc.
        }
    }, [response]);

    const color = useColor("black", "black");
    const backgroundColor = "white"; // useColorModeSelect("#1777f3", "white");
    const image = facebookColorIcon; // useColorModeSelect(facebookWhiteIcon, facebookColorIcon);

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor }]}
            onPress={() => promptAsync()}
            activeOpacity={0.65}
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
