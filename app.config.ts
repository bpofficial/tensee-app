const App = {
    version: "1.0.0",
    name: "Tensee",
    slug: "tensee-test",
    id: "com.wpd.tensee.test",
    scheme: "tenseeapp",
    background: "#161414",
    extra: {
        api: {
            apiUrl: "http://192.168.1.8:4000/local",
        },
        auth0: {
            domain: "bpktensee.au.auth0.com",
            clientId: "FC4KrwsM9DKx4tO0PGO9g1VztC9OWH1D",
            audience: "https://api.tensee.com/v1/",
        },
        facebook: {
            clientId: "938879340574098",
        },
        google: {
            iosClientId:
                "635247457778-81rqnkohtmjilqep4jd61e9dq8h01pk6.apps.googleusercontent.com",
            androidClientId:
                "635247457778-6hk52aj9s8vv1u880n7b481oj4nkbke9.apps.googleusercontent.com",
        },
        eas: {
            projectId: "f08fbcdc-3eeb-44d3-a2ea-73dafdbbbb8d",
        },
    },
};

module.exports = {
    expo: {
        name: App.name,
        slug: App.slug,
        version: App.version,
        scheme: App.scheme,
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: App.background,
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            supportsTablet: false,
            bundleIdentifier: App.id,
            config: { usesNonExemptEncryption: false },
            infoPlist: {
                NSFaceIDUsageDescription:
                    "We use Face ID to securely re-authenticate you.",
                NSUserTrackingUsageDescription:
                    "This identifier will be used to deliver personalized ads to you.",
                SKAdNetworkItems: [
                    { SKAdNetworkIdentifier: "v9wttpbfk9.skadnetwork" },
                    { SKAdNetworkIdentifier: "n38lu8286q.skadnetwork" },
                ],
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: App.background,
            },
            package: App.id,
        },
        plugins: [
            [
                "expo-build-properties",
                {
                    android: {
                        enableShrinkResourcesInReleaseBuilds: true,
                        enableProguardInReleaseBuilds: true,
                    },
                },
            ],
            ["expo-attestation-config-plugin", { environment: "production" }],
            "expo-apple-authentication",
            [
                "react-native-auth0",
                {
                    domain: App.extra.auth0.domain,
                    customScheme: App.scheme,
                },
            ],
            "sentry-expo",
            "expo-localization",
            "expo-facebook",
        ],
        extra: {
            eas: { projectId: App.extra.eas.projectId },
            AUTH0_DOMAIN: App.extra.auth0.domain,
            AUTH0_CLIENT_ID: App.extra.auth0.clientId,
            AUTH0_AUDIENCE: App.extra.auth0.audience,
            FACEBOOK_CLIENT_ID: App.extra.facebook.clientId,
            GOOGLE_CLIENT_ID_IOS: App.extra.google.iosClientId,
            GOOGLE_CLIENT_ID_ANDROID: App.extra.google.androidClientId,
            API_URL: App.extra.api.apiUrl,
        },
    },
};
