import { Config } from "config";
import Auth0 from "react-native-auth0";

export const auth0 = new Auth0({
    domain: Config.auth0.domain,
    clientId: Config.auth0.clientId,
});
