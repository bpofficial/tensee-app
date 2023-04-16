import { withNetworkActivity } from "@api/withNetworkActivity";
import { Logger, startChildSpan } from "@common";
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
import { useNavigation } from "@react-navigation/native";
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
    disabled?: boolean;
}

export const LoginForm: React.FC<FormProps> = ({
    autoFocus,
    disabled = false,
}) => {
    const doneAccessoryID = "login-form-accessory";

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
                await login(values.email, values.password);

                navigate("App", {
                    screen: "Home",
                    params: { fromLogin: true },
                });
                span.finish();
            } catch (err: any) {
                Logger.captureException(err, span);
                actions.setFormError(
                    err?.message ?? "An unknown error occured"
                );

                if (err instanceof LoginError) {
                    console.log(err.message);
                } else if (err instanceof UnknownError) {
                    console.log("unknown error", err);
                }
                span.finish();
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
                    {...{ autoFocus, disabled }}
                    inputAccessoryViewID={doneAccessoryID}
                />
                <PasswordField
                    {...{ disabled }}
                    returnKeyType="done"
                    inputAccessoryViewID={doneAccessoryID}
                />
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
            <CandleInputDoneAccessory id={doneAccessoryID} />
        </View>
    );
};
