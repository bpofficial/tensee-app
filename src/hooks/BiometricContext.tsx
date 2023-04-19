import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { PropsWithChildren, createContext, useContext } from "react";

interface IBiometricContext {
    getHasUsedBiometrics(): Promise<boolean>;
    setHasUsedBiometrics(v: boolean): Promise<void>;
}

const BiometricContext = createContext<IBiometricContext>({
    getHasUsedBiometrics: async () => {
        return true;
    },
    setHasUsedBiometrics: async () => {
        //
    },
});

const STORAGE_KEY = "used_biometrics";

export const BiometricProvider = ({ children }: PropsWithChildren) => {
    const setHasUsedBiometrics = async (value: boolean) => {
        await AsyncStorage.setItem(STORAGE_KEY, String(value));
    };

    const getHasUsedBiometrics = async () => {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value === "true") return true;
        return false;
    };

    return (
        <BiometricContext.Provider
            value={{
                getHasUsedBiometrics,
                setHasUsedBiometrics,
            }}
        >
            {children}
        </BiometricContext.Provider>
    );
};

export function useBiometricState() {
    return useContext(BiometricContext);
}
