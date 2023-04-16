export interface IntermediateUserInfo {
    socialAccessToken: string | null;
    socialProvider: "google" | "facebook" | "apple";
    firstName: string | null;
    email: string | null;
    id: string;
}

export enum RefreshStatus {
    REFRESH_EXPIRED = "REFRESH_EXPIRED",
    ALL_ACTIVE = "ALL_ACTIVE",
    FAILED = "failed",
}
