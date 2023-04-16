import { Logger } from "@common";
import * as Network from "expo-network";
import * as StatusBar from "expo-status-bar";

export async function withNetworkActivity<T>(cb: () => Promise<T>): Promise<T> {
    try {
        const networkState = await Network.getNetworkStateAsync();
        if (!networkState.isInternetReachable) {
            throw new Error("Not Connected");
        }

        StatusBar.setStatusBarNetworkActivityIndicatorVisible(true);

        const result = await cb();

        StatusBar.setStatusBarNetworkActivityIndicatorVisible(false);

        return result;
    } catch (err) {
        Logger.captureException(err);
        throw err;
    }
}
