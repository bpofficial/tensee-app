/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
    CompositeScreenProps,
    NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace ReactNavigation {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface RootParamList extends RootStackParamList {}
    }
}

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ForgotPasswordReset: undefined;
    PinEntry: undefined;
};

export type OnboardingStackParamList = {
    SetupAccountType: undefined;
    SetupPrimaryDetails: undefined;
    SetupPin: undefined;
    SetupBiometrics: undefined;
    SetupNotifications: undefined;
};

export type AppTabParamList = {
    Home: undefined;
    Onboarding: undefined;
};

export type LoadingScreenParamList = {
    Loading: {
        message: string;

        // We pass in the exact arguments for 'navigate' function
        callback: {
            screen: string;
            params?: Record<string, any>;
        };

        // Go here if the task fails...
        failCallback?: {
            screen: string;
            params?: Record<string, any>;
        };

        task?: string;
        timer?: number;
    };
};

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
    Onboarding: NavigatorScreenParams<OnboardingStackParamList> | undefined;
    App: NavigatorScreenParams<AppTabParamList> | undefined;
    Loading: NavigatorScreenParams<LoadingScreenParamList>;
};

export type AppTabScreenProps<Screen extends keyof AppTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<AppTabParamList, Screen>,
        NativeStackScreenProps<RootStackParamList>
    >;
