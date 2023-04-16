import { getSecureItem, setSecureItem } from "@utils";
import * as Crypto from "expo-crypto";
import React, { PropsWithChildren, createContext, useContext } from "react";

type Pin = [number, number, number, number];

interface IPinAuthContext {
    setPin(pin: Pin): Promise<void>;
    hasPinSet(): Promise<boolean>;
    verifyMatch(pin: Pin): Promise<boolean>;
}

const PinAuthContext = createContext<IPinAuthContext>({
    setPin: async () => {
        //
    },
    hasPinSet: async () => {
        return false;
    },
    verifyMatch: async () => {
        return false;
    },
});

export const PinAuthProvider = ({ children }: PropsWithChildren) => {
    const hashPin = async (pin: Pin) => {
        return Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            pin.join("")
        );
    };

    const setPin = async (pin: Pin) => {
        await setSecureItem("_pin", await hashPin(pin));
    };

    const getPin = async (): Promise<string | null> => {
        const pin = await getSecureItem("_pin");
        if (pin !== null && pin.length) {
            return pin;
        }
        return null;
    };

    const hasPinSet = async () => {
        const pin = await getPin();
        return pin !== null;
    };

    const verifyMatch = async (pin: Pin) => {
        const existingPinHash = await getPin();
        const inputPinHash = await hashPin(pin);

        return existingPinHash === inputPinHash;
    };

    return (
        <PinAuthContext.Provider
            value={{
                hasPinSet,
                verifyMatch,
                setPin,
            }}
        >
            {children}
        </PinAuthContext.Provider>
    );
};

export const usePinSettings = () => useContext(PinAuthContext);
