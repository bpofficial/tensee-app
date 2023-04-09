import { ClientError } from "./ClientError";
import { ServerError } from "./ServerError";
import { SignupError } from "./SignupError";
import { UnknownError } from "./UnknownError";

export const ErrorMappings = {
    auth0: {
        invalid_password: new SignupError("The password is too weak."),
        invalid_signup: new SignupError(
            "An account with the email may already exist."
        ),
        invalid_request: new SignupError(
            "The request is malformed or contains incorrect information."
        ),
        invalid_user_password: new SignupError(
            "The provided email and/or password are incorrect."
        ),
        user_exists: new SignupError(
            "A user with this email address already exists."
        ),
        username_exists: new SignupError("The email is already taken."),
        password_dictionary_error: new SignupError(
            "The password is too common. Please choose a more unique password."
        ),
        password_no_user_info_error: new SignupError(
            "The password is based on user information. Please choose a different password."
        ),
        password_strength_error: new SignupError("The password is too weak."),

        invalid_scope: new ClientError(
            "The requested scope is invalid, unknown, or malformed."
        ),
        invalid_client: new ClientError("The client authentication failed."),
        invalid_grant: new ClientError(
            "The provided grant is invalid or has expired."
        ),
        unauthorized_client: new ClientError(
            "The client is not authorized to perform the requested action."
        ),
        unsupported_response_type: new ClientError(
            "The authorization server does not support the requested response type."
        ),
        unsupported_grant_type: new ClientError(
            "The authorization server does not support the requested grant type."
        ),

        server_error: new ServerError(
            "The server encountered an error while processing the request."
        ),
        temporarily_unavailable: new ServerError(
            "The server is temporarily unable to process the request."
        ),

        undefined: new UnknownError("An unknown error occured."),
    },
};

export function getDefinedError(
    subject: keyof typeof ErrorMappings,
    code?: string
) {
    if (!code) return;
    const errors = ErrorMappings[subject];
    if (code in errors) {
        throw ErrorMappings[subject][code as keyof typeof errors];
    }
}

// export * from "./AccessTokenExpiredError";
export * from "./ClientError";
// export * from "./NetworkError";
export * from "./RefreshAccessTokenFailedError";
// export * from "./RefreshTokenExpiredError";
export * from "./ServerError";
export * from "./SignupError";
export * from "./UnknownError";
