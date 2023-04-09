import * as Localisation from "expo-localization";
import { I18n } from "i18n-js";
// Numeric, Currency, Date & Datetime translations
import en from "i18n-js/json/en.json";

// App strings
// eslint-disable-next-line @typescript-eslint/no-var-requires
const enAU = require("./translations/en-AU.json");

export const i18n = new I18n(
    {
        en: {
            ...en,
            ...enAU,
        },
    },
    {
        defaultLocale: Localisation.locale,
        locale: Localisation.locale,
    }
);
