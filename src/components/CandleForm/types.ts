import * as Yup from "yup";

/**
 * Helper type that extracts the keys of a Yup.ObjectSchema.
 */
export type SchemaKeys<T> = T extends Yup.ObjectSchema<infer R> ? R : never;

/**
 * Helper type that maps the keys of an object to their values of type K.
 */
export type SchemaValues<T extends Record<string, string>, K> = {
    [s in keyof T]?: K;
};
