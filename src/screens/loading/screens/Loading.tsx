import { CandleLoadingIndicator } from "@components";
import { useTaskContext } from "@hooks";
import {
    RouteProp,
    StackActions,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { LoadingScreenParamList } from "types";

export const LoadingScreen: React.FC = () => {
    const { navigate, dispatch } = useNavigation();
    const { params } = useRoute<RouteProp<LoadingScreenParamList>>();

    const { tasks, updateTaskStatus } = useTaskContext();
    const { task, timer, message, callback, failCallback } = (params as any)
        .params;

    useEffect(() => {
        const handleJobCompletion = async () => {
            if (task) {
                const job = tasks.find((t) => t.key === task);
                if (job) {
                    try {
                        const result = await job.promise;
                        updateTaskStatus(task, "done");

                        if (
                            result &&
                            typeof result === "object" &&
                            result !== null &&
                            "callback" in result &&
                            result.callback &&
                            typeof result.callback === "object"
                        ) {
                            const cb = result.callback as any;
                            dispatch(
                                StackActions.replace(cb.screen, {
                                    ...(cb.params ?? {}),
                                    job: { result, status: "done" },
                                })
                            );
                            return;
                        }

                        dispatch(
                            StackActions.replace(callback.screen, {
                                ...callback.params,
                                job: { result, status: "done" },
                            })
                        );
                    } catch (error) {
                        console.error(error);
                        updateTaskStatus(task, "error");
                        dispatch(
                            StackActions.replace(
                                failCallback?.screen ?? callback.screen,
                                {
                                    ...callback.params,
                                    job: {
                                        result: null,
                                        status: "error",
                                    },
                                }
                            )
                        );
                    }
                }
            } else if (timer) {
                setTimeout(() => {
                    dispatch(
                        StackActions.replace(callback.screen, callback.params)
                    );
                }, timer);
            }
        };

        handleJobCompletion();
    }, [tasks, updateTaskStatus, task, timer, navigate, callback]);

    return (
        <View>
            <CandleLoadingIndicator />
            <Text>{message}</Text>
        </View>
    );
};
