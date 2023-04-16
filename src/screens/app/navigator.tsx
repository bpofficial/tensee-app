/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import {
    useAttestation,
    useAutoLogout,
    useAutoRefreshToken,
    useScreenOptions,
} from "@hooks";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { AppTabParamList } from "types";
import { HomeScreen } from "./screens/Home";

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<AppTabParamList>();

export function AppTabNavigator() {
    const screenOptions = useScreenOptions();

    useAutoLogout();
    useAutoRefreshToken();
    useAttestation();

    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            screenOptions={screenOptions}
        >
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="home" color={color} />
                    ),
                }}
            />
            {/*<BottomTab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="cog" color={color} />
                    ),
                }}
            /> */}
        </BottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return (
        <FontAwesome size={30} style={{ marginBottom: -3 * 1 }} {...props} />
    );
}
