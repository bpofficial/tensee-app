// TaskContext.tsx
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { LoadingScreenParamList } from "types";

export type TaskStatus = "pending" | "loading" | "done" | "error";

interface Task {
    key: string;
    promise: Promise<unknown | void>;
    status: TaskStatus;
}

export type NavigableTaskResult = LoadingScreenParamList["Loading"];

interface TaskContextType {
    // Have considered a map, decided to use array still
    tasks: Task[];
    addTask<T>(key: string, promise: Promise<T>): void;
    updateTaskStatus: (key: string, status: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextType>({
    tasks: [],
    addTask: () => {
        //
    },
    updateTaskStatus: () => {
        //
    },
});

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }: PropsWithChildren) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    function addTask<T>(
        key: string,
        promise: Promise<T | NavigableTaskResult>
    ) {
        setTasks([...tasks, { key, promise, status: "pending" }]);
    }

    const updateTaskStatus = (key: string, status: TaskStatus) => {
        setTasks(
            tasks.map((Task) => (Task.key === key ? { ...Task, status } : Task))
        );
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus }}>
            {children}
        </TaskContext.Provider>
    );
};
