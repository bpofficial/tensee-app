import { Logger, Scope, startChildSpan } from "@common";
import { useActivity, useAuth, useColor } from "@hooks";
import { useNavigation } from "@react-navigation/native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const appleBlackIcon = require("../../../assets/branding/apple-logo-black.png");
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const appleWhiteIcon = require("../../../assets/branding/apple-logo-white.png");

export const SignInWithApple = ({ disabled = false }) => {
    const { setActive } = useActivity();
    const { setUser } = useAuth();
    const { navigate } = useNavigation();
    const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

    useEffect(() => {
        (async () => {
            const availability = await AppleAuthentication.isAvailableAsync();
            setIsAppleAuthAvailable(availability);
        })();
    }, []);

    const handleAppleLogin = async () => {
        setActive(true);
        const span = startChildSpan({
            name: "Continue w/ Apple",
            op: "submit_social_login",
        });

        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            if (credential) {
                Scope.setSpan(span);
                setUser({
                    socialProvider: "apple",
                    socialAccessToken: credential.authorizationCode,
                    firstName: credential.fullName?.givenName ?? "",
                    email: credential.email,
                    id: credential.user,
                });
                navigate("App", {
                    screen: "Home",
                    params: { fromLogin: true },
                });
                span.finish();
            }
        } catch (err: any) {
            Logger.captureException(err, span);
            span.finish();
            if (err.code === "ERR_CANCELED") {
                // console.log("Apple login was canceled");
            } else {
                // console.error("Apple login error:", err);
            }
        }
        setActive(false);
    };

    const color = useColor("black", "black");
    const backgroundColor = "white"; // useColorModeSelect("black", "white");
    const image = appleBlackIcon; //useColorModeSelect(appleWhiteIcon, appleBlackIcon);

    if (!isAppleAuthAvailable) return null;

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor }]}
            onPress={handleAppleLogin}
            activeOpacity={0.65}
            disabled={disabled}
        >
            <View style={styles.centeredContainer}>
                <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={image}
                />
                <Text style={[styles.text, { color }]}>
                    Continue with Apple
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
        flex: 1,
        height: 70,
        left: 0,
        position: "absolute",
        top: -4,
        width: 70,
    },
    text: {
        fontSize: 18,
    },
});
