import { exchangeAppleAuthorizationCode } from "./exchangeAppleCode";
import { exchangeFacebookAccessToken } from "./exchangeFacebookToken";
import { exchangeGoogleAccessToken } from "./exchangeGoogleToken";
import { refreshAccessToken } from "./refreshAccessToken";

export const TokenExchange = {
    exchangeFacebookAccessToken,
    exchangeAppleAuthorizationCode,
    exchangeGoogleAccessToken,
};

export const TokenActions = {
    refreshAccessToken,
};

export * from "./types";
