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

export type AppTabParamList = {
    Home: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ForgotPasswordReset: undefined;
    SocialCallback: undefined; // ????
};

export type RootStackParamList = {
    App: NavigatorScreenParams<AppTabParamList> | undefined;
    Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
};

export type AppStackScreenProps<Screen extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, Screen>;

export type AppTabScreenProps<Screen extends keyof AppTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<AppTabParamList, Screen>,
        NativeStackScreenProps<RootStackParamList>
    >;
