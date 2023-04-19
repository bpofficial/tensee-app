import { Attestation } from "./attest";
import { TokenActions, TokenExchange } from "./auth";
import { Users } from "./users";

export const API = {
    Users,
    Attestation,
    Auth: {
        TokenActions,
        TokenExchange,
    },
};

export { AttestationStatus } from "./attest";
export * from "./auth/types";
export * from "./utils";
