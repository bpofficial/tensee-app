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
import {
    EmailField,
    FullNameField,
    PasswordConfirmationField,
    PasswordField,
} from "../CommonInputFields";
import { RegisterFormValidationSchema } from "./validationSchema";

interface FormValues {
    name: string;
    email: string;
    password: string;
}

export const RegisterForm = () => {
    const { register } = useAuth();
    const [isLoading, loading] = useBoolean();

    const handleRegistration = async (
        values: FormValues,
        actions: ICandleFormActions
    ) => {
        await withNetworkActivity(async () => {
            loading.on();
            try {
                await register(values.name, values.email, values.password);
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
                onSubmit={handleRegistration}
                schema={RegisterFormValidationSchema}
            >
                <FullNameField />
                <EmailField />
                <PasswordField />
                <PasswordConfirmationField />
                <CandleFormConsumer>
                    {({ isValid, handleSubmit }) => (
                        <CandleButton
                            disabled={!isValid}
                            title="Continue"
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
