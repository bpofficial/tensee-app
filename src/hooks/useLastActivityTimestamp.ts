import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useAppState } from "./AppStateContext";

export function useLastActivityTimestamp(): [number, (t: number) => void] {
    const [timestamp, setTimestamp] = useState<number>(-1);
    const { appState, previousAppState } = useAppState();

    const setLastActivityTimestamp = async (timestamp: number) => {
        try {
            await AsyncStorage.setItem(
                "lastActivityTimestamp",
                timestamp.toString()
            );
        } catch (err) {
            console.log("Error setting last activity timestamp:", err);
        }
    };

    const getLastActivityTimestamp = async () => {
        try {
            const lastActivityTimestamp = await AsyncStorage.getItem(
                "lastActivityTimestamp"
            );
            return lastActivityTimestamp
                ? parseInt(lastActivityTimestamp)
                : Date.now();
        } catch (err) {
            console.log("Error getting last activity timestamp:", err);
            return Date.now();
        }
    };

    const onAppStateChange = async () => {
        if (
            previousAppState &&
            previousAppState.match(/inactive|background/) &&
            appState === "active"
        ) {
            const ts = await getLastActivityTimestamp();
            await setLastActivityTimestamp(ts);
            setTimestamp(ts);
        } else if (
            appState.match(/inactive|background/) &&
            previousAppState === "active"
        ) {
            const now = Date.now();
            await setLastActivityTimestamp(now);
            setTimestamp(now);
        }
    };

    useEffect(() => {
        onAppStateChange();
    }, [appState]);

    return [timestamp, setLastActivityTimestamp];
}
