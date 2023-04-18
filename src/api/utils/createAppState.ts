import { withSpan } from "@common";
import { getOrCreateDeviceId } from "@utils";
import { Buffer } from "buffer";
import * as Application from "expo-application";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { getCalendars, getLocales } from "expo-localization";

export async function createAppState(device?: string) {
    return withSpan(
        {
            name: "Create App State",
            op: "create_state",
        },
        async () => {
            const deviceId = device || (await getOrCreateDeviceId());
            const type = await Device.getDeviceTypeAsync();
            const brand = Device.brand;
            const name = Device.deviceName;
            const year = Device.deviceYearClass;
            const manufacturer = Device.manufacturer;
            const model = Device.modelId;
            const buildVersion = Application.nativeApplicationVersion;
            const buildId = Application.nativeBuildVersion;
            const runtimeVersion =
                Constants.manifest?.runtimeVersion?.toString();

            const calendar = getCalendars()[0];
            const locale = getLocales()[0];

            const state = {
                date: Date.now(),
                tz: calendar.timeZone,
                locale: locale.languageCode,
                type,
                brand,
                name,
                year,
                manufacturer,
                model,
                buildVersion,
                buildId,
                runtimeVersion,
                deviceId,
            };

            return Buffer.from(JSON.stringify(state)).toString("base64");
        }
    );
}
