import * as Yup from "yup";

export const LoginFormValidationSchema = Yup.object().shape({
    email: Yup.string().required("Please enter your email address."),
    password: Yup.string().required("Please enter your password."),
});
