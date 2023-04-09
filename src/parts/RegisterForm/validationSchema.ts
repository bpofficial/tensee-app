import * as Yup from "yup";

export const RegisterFormValidationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Please enter a valid full name."),
    email: Yup.string()
        .test("email", "Please enter a valid email address.", (email) =>
            // eslint-disable-next-line no-useless-escape
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email ?? ""
            )
        )
        .required("Please enter a valid email address."),
    password: Yup.string()
        .required("Please enter a valid password.")
        .min(8, "Password must be at least 8 characters long.")
        .test(
            "characterTypes",
            "Password must contain at mix of lower and uppercase letters and special characters.",
            (password) => {
                const hasLowerCase = /[a-z]/.test(password);
                const hasUpperCase = /[A-Z]/.test(password);
                const hasNumber = /\d/.test(password);
                const hasSpecialChar = /[!@#$%^&*]/.test(password);

                const characterTypesCount =
                    +Boolean(hasLowerCase) +
                    +Boolean(hasUpperCase) +
                    +Boolean(hasNumber) +
                    +Boolean(hasSpecialChar);

                return characterTypesCount >= 3;
            }
        ),
    passwordConfirmation: Yup.string().test(
        "passwords-match",
        "Passwords must match",
        function (value) {
            const password = this.resolve(Yup.ref("password"));
            if (!password || !value) {
                return false;
            }
            return value === password;
        }
    ),
});
