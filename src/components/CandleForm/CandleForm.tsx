import {
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { TextInput } from "react-native";
import * as Yup from "yup";
import { ICandleInputProps } from "../CandleInput";
import { CandleFormContext } from "./FormContext";
import { SchemaKeys, SchemaValues } from "./types";

export interface ICandleFormActions {
    resetForm(): void;
    setFormError(errorMessage: string): void;
    clearFormError(): void;
}

/**
 * Props for the CandleForm component.
 */
interface ICandleInputContextProviderProps<
    T extends Yup.ObjectSchema<Yup.AnyObject>
> {
    schema: T;
    onSubmit(
        values: Required<SchemaValues<SchemaKeys<T>, string>>,
        actions: ICandleFormActions
    ): void;
}

/**
 * CandleForm component that wraps a form and manages its state.
 */
export const CandleForm = <T extends Yup.ObjectSchema<Yup.AnyObject>>({
    schema,
    onSubmit,
    children,
}: PropsWithChildren<ICandleInputContextProviderProps<T>>) => {
    const fieldKeys = useMemo(() => Object.keys(schema.fields), []);
    const inputRefs = fieldKeys.map(() => useRef<TextInput | null>(null));

    const [isValid, setIsValid] = useState(false);
    const [values, setValues] = useState<Partial<SchemaKeys<T>>>({});
    const [errors, setErrors] = useState<Partial<SchemaKeys<T>>>({});
    const [touched, setTouched] = useState<
        SchemaValues<SchemaKeys<T>, boolean>
    >({});

    const [formError, setFormError] = useState<string | null>(null);

    /**
     * Handles changes to a field.
     */
    const handleChange = (field: keyof SchemaKeys<T>) => (text: string) => {
        setValues({ ...values, [field]: text });
        checkValidity();
    };

    /**
     * Handles when a field loses focus.
     */
    const handleBlur = (field: keyof SchemaKeys<T>) => async () => {
        setTouched({ ...touched, [field]: true });
        checkValidity();
    };

    const handleFormReset = () => {
        setFormError(null);
        setValues({});
        setErrors({});
        setTouched({});
        setIsValid(false);
    };

    /**
     * Handles form submission.
     */
    const handleSubmit = useCallback(() => {
        if (isValid)
            onSubmit(values as any, {
                resetForm: handleFormReset,
                setFormError,
                clearFormError: () => setFormError(null),
            });
    }, [isValid]);

    /**
     * Checks the form's validity against the provided schema.
     */
    const checkValidity = useCallback(async () => {
        try {
            await schema.validate(values, { abortEarly: false });
            setErrors({});
            setIsValid(true);
            return true;
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = error.inner.reduce((acc, curr) => {
                    if (curr.path) acc[curr.path] = curr.message;
                    return acc;
                }, {} as any);
                setErrors(validationErrors);
                setIsValid(false);
            }
            return false;
        }
    }, [values]);

    /**
     * Gets the refs for a given field.
     */
    const getRef = useCallback(
        (field: keyof SchemaKeys<T>) => {
            return [
                inputRefs[fieldKeys.findIndex((f) => f === field)] ?? null,
                inputRefs[fieldKeys.findIndex((f) => f === field) + 1] ?? null,
            ];
        },
        [inputRefs, fieldKeys]
    );

    /**
     * Gets field-specific props for a given field.
     */
    const getFieldProps = useCallback(
        (field: string): Partial<ICandleInputProps> => {
            const [currentRef, nextRef] = getRef(field);

            return {
                onBlur: handleBlur(field),
                onChangeText: handleChange(field),
                errorText: touched[field] ? errors[field] : undefined,
                isError: !!touched[field] && errors[field],
                isSuccess: !!touched[field] && !errors[field],
                value: values[field],
                ref: currentRef,
                onSubmitEditing() {
                    if (!!currentRef && nextRef === null) {
                        handleSubmit();
                    } else if (nextRef) {
                        nextRef?.current?.focus?.();
                    }
                },
                blurOnSubmit: false,
            };
        },
        [touched, errors, values, getRef]
    );

    /**
     * Re-check form validity whenever touched or values change.
     */
    useEffect(() => {
        checkValidity();
    }, [touched, values]);

    return (
        <CandleFormContext.Provider
            value={{ schema, isValid, getFieldProps, handleSubmit }}
        >
            {children}
        </CandleFormContext.Provider>
    );
};

/**
 * Custom hook to use the CandleForm context.
 */
export const useForm = () => {
    return useContext(CandleFormContext);
};
