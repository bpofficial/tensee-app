/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { useScreenOptions } from "@hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { OnboardingStackParamList } from "types";
import { HomeScreen } from "./screens/Home";

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStackNavigator() {
    const screenOptions = useScreenOptions();

    return (
        <Stack.Navigator
            initialRouteName="SetupAccountType"
            screenOptions={screenOptions}
        >
            <Stack.Screen name="SetupAccountType" component={HomeScreen} />
        </Stack.Navigator>
    );
}
