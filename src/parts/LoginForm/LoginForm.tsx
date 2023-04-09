import { withNetworkActivity } from "@api/withNetworkActivity";
import {
    CandleButton,
    CandleForm,
    CandleFormConsumer,
    ICandleFormActions,
} from "@components";
import { SignupError, UnknownError } from "@errors";
import { useAuth, useBoolean } from "@hooks";
import React from "react";
import { View } from "react-native";
import { EmailField, PasswordField } from "../CommonInputFields";
import { LoginFormValidationSchema } from "./validationSchema";

interface FormValues {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const { login } = useAuth();
    const [isLoading, loading] = useBoolean();

    const handleLogin = async (
        values: FormValues,
        actions: ICandleFormActions
    ) => {
        await withNetworkActivity(async () => {
            loading.on();
            try {
                await login(values.email, values.password);
                actions.resetForm();
            } catch (error: any) {
                actions.setFormError(
                    error?.message ?? "An unknown error occured"
                );

                if (error instanceof SignupError) {
                    console.log(error.message);
                } else if (error instanceof UnknownError) {
                    console.log("unknown error");
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
            >
                <EmailField />
                <PasswordField />
                <CandleFormConsumer>
                    {({ isValid, handleSubmit }) => (
                        <CandleButton
                            disabled={!isValid}
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
