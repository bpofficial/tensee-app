import { withNetworkActivity } from "@api";
import { captureError, startChildSpan } from "@common";
import {
    CandleButton,
    CandleForm,
    CandleFormConsumer,
    CandleFormErrors,
    ICandleFormActions,
} from "@components";
import { LoginError, UnknownError } from "@errors";
import { useAuth, useBoolean } from "@hooks";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Keyboard, View } from "react-native";
import { EmailField, PasswordField } from "../CommonInputFields";
import { LoginFormValidationSchema } from "./validationSchema";

interface FormValues {
    email: string;
    password: string;
}

interface FormProps {
    autoFocus?: boolean;
    disabled?: boolean;
}

export const LoginForm: React.FC<FormProps> = ({
    autoFocus,
    disabled = false,
}) => {
    const { navigate } = useNavigation();
    const { login } = useAuth();
    const [isLoading, loading] = useBoolean();

    const handleLogin = async (
        values: FormValues,
        actions: ICandleFormActions
    ) => {
        const span = startChildSpan({
            name: "Continue w/ Credentials",
            op: "credentials",
        });

        await withNetworkActivity(async () => {
            loading.on();
            try {
                Keyboard.dismiss();
                await login(values.email, values.password);

                span.finish();
                navigate("App", {
                    screen: "Home",
                    params: { fromLogin: true },
                });
            } catch (err: any) {
                captureError(err, span);
                actions.setFormError(
                    err?.message ?? "An unknown error occured"
                );

                if (err instanceof LoginError) {
                    console.log(err.message);
                } else if (err instanceof UnknownError) {
                    console.log("unknown error", err);
                }
            }
            loading.off();
        });
    };

    return (
        <View>
            <CandleForm
                onSubmit={handleLogin}
                schema={LoginFormValidationSchema}
                clearOnFocusOut
            >
                <CandleFormErrors />
                <EmailField {...{ autoFocus, disabled }} />
                <PasswordField {...{ disabled }} returnKeyType="done" />
                <CandleFormConsumer>
                    {({ isValid, handleSubmit }) => (
                        <CandleButton
                            disabled={!isValid || disabled}
                            title="Log in"
                            variant="primary"
                            loading={isLoading}
                            onPress={handleSubmit}
                        />
                    )}
                </CandleFormConsumer>
            </CandleForm>
        </View>
    );
};
