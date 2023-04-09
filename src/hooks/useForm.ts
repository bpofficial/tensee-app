import { CandleFormContext } from "@components/CandleForm/FormContext";
import { useContext } from "react";

export const useForm = () => {
    return useContext(CandleFormContext);
};
