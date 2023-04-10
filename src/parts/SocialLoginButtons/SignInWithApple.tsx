import { useColor } from "@hooks";
import * as AppleAuthentication from "expo-apple-authentication";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const appleBlackIcon = require("../../../assets/branding/apple-logo-black.png");
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const appleWhiteIcon = require("../../../assets/branding/apple-logo-white.png");

export const SignInWithApple = () => {
    const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

    useEffect(() => {
        (async () => {
            const availability = await AppleAuthentication.isAvailableAsync();
            setIsAppleAuthAvailable(availability);
        })();
    }, []);

    const handleAppleLogin = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            if (credential) {
                console.log("Apple login credential:", credential);
                // Process the credential, sign in the user, and navigate to another screen
            }
        } catch (error: any) {
            if (error.code === "ERR_CANCELED") {
                console.log("Apple login was canceled");
            } else {
                console.error("Apple login error:", error);
            }
        }
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
