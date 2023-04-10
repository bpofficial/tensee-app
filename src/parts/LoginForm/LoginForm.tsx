import { withNetworkActivity } from "@api/withNetworkActivity";
import { Logger } from "@common";
import {
    CandleButton,
    CandleForm,
    CandleFormConsumer,
    CandleFormErrors,
    CandleInputDoneAccessory,
    ICandleFormActions,
} from "@components";
import { LoginError, UnknownError } from "@errors";
import { useAuth, useBoolean } from "@hooks";
import React from "react";
import { View } from "react-native";
import { EmailField, PasswordField } from "../CommonInputFields";
import { LoginFormValidationSchema } from "./validationSchema";

interface FormValues {
    email: string;
    password: string;
}

interface FormProps {
    autoFocus?: boolean;
}

export const LoginForm: React.FC<FormProps> = ({ autoFocus }) => {
    const doneAccessoryID = "login-form-accessory";

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
            } catch (error: any) {
                Logger.captureException(error);
                actions.setFormError(
                    error?.message ?? "An unknown error occured"
                );

                if (error instanceof LoginError) {
                    console.log(error.message);
                } else if (error instanceof UnknownError) {
                    console.log("unknown error", error);
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
                <CandleFormErrors />
                <EmailField
                    {...{ autoFocus }}
                    inputAccessoryViewID={doneAccessoryID}
                />
                <PasswordField
                    returnKeyType="done"
                    inputAccessoryViewID={doneAccessoryID}
                />
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
            <CandleInputDoneAccessory id={doneAccessoryID} />
        </View>
    );
};
