import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import { usePrevious } from "./usePrevious";

interface IAppState {
    appState: AppStateStatus;
    previousAppState?: AppStateStatus;
}

const AppStateContext = createContext<IAppState>({
    appState: "active",
});

export const AppStateProvider = ({ children }: PropsWithChildren) => {
    const [appState, setAppState] = useState<AppStateStatus>("active");
    const previousAppState = usePrevious(appState);

    useEffect(() => {
        const listener = AppState.addEventListener(
            "change",
            handleAppStateChange
        );
        return listener.remove;
    }, []);

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        setAppState(nextAppState);
    };

    return (
        <AppStateContext.Provider value={{ appState, previousAppState }}>
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = () => {
    return useContext(AppStateContext);
};
