/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { App, Auth } from "@screens";
import { useRef } from "react";
import * as Sentry from "sentry-expo";
import { RootStackParamList } from "types";
import { linking } from "./LinkingConfiguration";

export const routingInstrumentation =
    new Sentry.Native.ReactNavigationInstrumentation();

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Auth"
                component={Auth.Navigator}
                options={{ headerShown: false, statusBarTranslucent: true }}
            />
            <Stack.Screen
                name="App"
                component={App.Navigator}
                options={{ headerShown: false, statusBarTranslucent: true }}
            />
        </Stack.Navigator>
    );
}

export function Navigation() {
    // Create a ref for the navigation container
    const navigation = useRef<any>();

    return (
        // Connect the ref to the navigation container
        <NavigationContainer
            ref={navigation}
            linking={linking}
            onReady={() => {
                // Register the navigation container with the instrumentation
                routingInstrumentation.registerNavigationContainer(navigation);
            }}
        >
            <RootNavigator />
        </NavigationContainer>
    );
}
