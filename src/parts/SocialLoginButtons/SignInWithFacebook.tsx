import { tracedFetch } from "@api";
import { Config, Logger, Scope, captureError, startChildSpan } from "@common";
import { useActivity, useAuth, useBoolean, useColor } from "@hooks";
import { useNavigation } from "@react-navigation/native";
import { Span } from "@sentry/types";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const facebookColorIcon = require("../../../assets/branding/facebook-logo-color.png");
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const facebookWhiteIcon = require("../../../assets/branding/facebook-logo-white.png");

export const SignInWithFacebook = ({ disabled = false }) => {
    const [span, setSpan] = useState<Span | null>(null);
    const { setActive } = useActivity();
    const [isLoading, loading] = useBoolean();
    const { navigate } = useNavigation();
    const { setUser } = useAuth();

    const [request, response, promptAsync] = Facebook.useAuthRequest({
        clientId: Config.facebook.clientId,
        scopes: ["public_profile"],
    });

    const onPrompt = () => {
        setActive(true);
        loading.on();
        setSpan(
            startChildSpan({
                name: "Continue w/ Facebook",
                op: "submit_social_login",
            })
        );
        promptAsync();
    };

    const getUserInfo = async (t: string) => {
        Scope.setSpan(span!);

        const child = span?.startChild({
            description: "Get user profile from Facebook",
            op: "retrieve_user_profile",
        });
        try {
            const data = await tracedFetch(
                `https://graph.facebook.com/me?access_token=${t}&fields=id,name,picture.type(large)`,
                null,
                child
            );

            const result = await data.json();

            if (result.id) {
                setUser({
                    socialProvider: "facebook",
                    socialAccessToken: t,
                    firstName: result.name,
                    email: null,
                    id: result.id,
                });
                child?.finish();

                setTimeout(() => {
                    setActive(false);
                    loading.off();
                }, 300);

                navigate("App", {
                    screen: "Home",
                    params: { fromLogin: true },
                });
                return;
            } else {
                Logger.addBreadcrumb({
                    type: "info",
                    level: "info",
                    message: "Facebook Response",
                    data: result,
                });
                throw new Error("Facebook info has no ID?");
            }
        } catch (error) {
            captureError(error, child);
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
    const backgroundColor = "white"; // useColorModeSelect("#1777f3", "white");
    const image = facebookColorIcon; // useColorModeSelect(facebookWhiteIcon, facebookColorIcon);

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor }]}
            onPress={onPrompt}
            activeOpacity={0.65}
            disabled={!request || disabled || isLoading}
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
