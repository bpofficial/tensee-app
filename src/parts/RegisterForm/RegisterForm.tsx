import { withNetworkActivity } from "@api/withNetworkActivity";
import { Logger, startChildSpan } from "@common";
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
    LegalNameField,
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
        const span = startChildSpan({
            name: "Register",
            new: true,
        });

        await withNetworkActivity(async () => {
            loading.on();
            try {
                await register(values.name, values.email, values.password);
                // Navigate...
                span.finish();
                actions.resetForm();
            } catch (err: any) {
                Logger.captureException(err, span);
                actions.setFormError(
                    err?.message ?? "An unknown error occured"
                );

                if (err instanceof SignupError) {
                    console.log(err.message);
                } else if (err instanceof UnknownError) {
                    console.log("unknown error");
                }

                span.finish();
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
                <LegalNameField />
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
