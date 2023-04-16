import { exchangeAppleAuthorizationCode } from "./exchangeAppleCode";
import { exchangeFacebookAccessToken } from "./exchangeFacebookToken";
import { refreshAccessToken } from "./refreshAccessToken";

export const TokenExchange = {
    exchangeFacebookAccessToken,
    exchangeAppleAuthorizationCode,
};

export const TokenActions = {
    refreshAccessToken,
};

export * from "./types";
