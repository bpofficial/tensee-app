import { PropsWithChildren, createContext, useContext, useState } from "react";

interface IActivityState {
    isActive: boolean;
    setActive(v: boolean): void;
}

const ActivityContext = createContext<IActivityState>({
    isActive: false,
    setActive() {
        //
    },
});

interface IActivityProviderProps {
    initialState?: boolean;
}

export const ActivityProvider = ({
    initialState = false,
    children,
}: PropsWithChildren<IActivityProviderProps>) => {
    const [isActive, setActive] = useState(initialState);

    return (
        <ActivityContext.Provider value={{ isActive, setActive }}>
            {children}
        </ActivityContext.Provider>
    );
};

export const ActivityConsumer = ActivityContext.Consumer;

export const useActivity = () => {
    return useContext(ActivityContext);
};
