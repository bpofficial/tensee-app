import { PropsWithChildren, createContext, useContext } from "react";

interface ICandleInputContextState {
    required?: boolean;
    name: string;
}

const CandleInputContext = createContext<ICandleInputContextState>({
    name: "",
    required: false,
});

export interface ICandleInputContextProviderProps {
    required?: boolean;
    name: string;
}

export const CandleInputContextProvider = ({
    name,
    required,
    children,
}: PropsWithChildren<ICandleInputContextProviderProps>) => {
    return (
        <CandleInputContext.Provider value={{ name, required }}>
            {children}
        </CandleInputContext.Provider>
    );
};

export const useInputContext = () => {
    return useContext(CandleInputContext);
};
