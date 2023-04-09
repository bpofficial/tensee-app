import { useScreenOptions } from "@hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "types";
import { ForgotPasswordScreen } from "./screens/ForgotPassword";
import { ForgotPasswordResetScreen } from "./screens/ForgotPasswordReset";
import { LoginScreen } from "./screens/Login";
import { RegisterScreen } from "./screens/Register";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
    const screenOptions = useScreenOptions();

    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
            />
            <Stack.Screen
                name="ForgotPasswordReset"
                component={ForgotPasswordResetScreen}
            />
        </Stack.Navigator>
    );
}
