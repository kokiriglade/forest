import type { Keyed, Namespaced } from "./mod.ts";

/**
 * Class representing a Key with a namespace and value separated by a default separator
 */
export class Key implements Keyed, Namespaced {
    /** Default separator between namespace and value */
    public static DEFAULT_SEPARATOR: string = ":";

    /** Pattern for validating the namespace format */
    private static NAMESPACE_PATTERN: RegExp = new RegExp("^[a-z0-9_\\-.]+$");

    /** Pattern for validating the value format */
    private static VALUE_PATTERN: RegExp = new RegExp("^[a-z0-9_\\-./]+$");

    private constructor(
        private readonly _namespace: string,
        private readonly _value: string,
    ) {}

    get key(): Key {
        return this;
    }

    /**
     * Creates a Key instance from a single formatted string "namespace:value"
     * @param string - The string in the format "namespace:value"
     * @returns A new Key instance
     * @throws {Error} Throws an error if the format is invalid or patterns do not match
     */
    public static key(string: string): Key;

    /**
     * Creates a Key instance from separate namespace and value strings
     * @param namespace - The namespace of the Key, must match NAMESPACE_PATTERN
     * @param value - The value of the Key, must match VALUE_PATTERN
     * @returns A new Key instance
     * @throws {Error} Throws an error if the patterns do not match
     */
    public static key(namespace: string, value: string): Key;

    public static key(string: string, value?: string): Key {
        if (value === undefined) {
            // Parse "namespace:value" format
            const [namespace, val] = string.split(Key.DEFAULT_SEPARATOR);
            if (!namespace || !val) {
                throw new Error(
                    `Invalid format. Expected "namespace${Key.DEFAULT_SEPARATOR}value"`,
                );
            }
            Key.assertPattern(namespace, Key.NAMESPACE_PATTERN, "namespace");
            Key.assertPattern(val, Key.VALUE_PATTERN, "value");
            return new Key(namespace, val);
        } else {
            // Use separate namespace and value
            Key.assertPattern(string, Key.NAMESPACE_PATTERN, "namespace");
            Key.assertPattern(value, Key.VALUE_PATTERN, "value");
            return new Key(string, value);
        }
    }

    /**
     * Asserts that a value matches a specified pattern
     * @param value - The value to check
     * @param pattern - The regular expression pattern the value should match
     * @param fieldName - The name of the field being checked, used in the error message
     * @throws {Error} Throws an error if the value does not match the pattern
     */
    private static assertPattern(
        value: string,
        pattern: RegExp,
        fieldName: string,
    ): asserts value is string {
        if (!pattern.test(value)) {
            throw new Error(`${fieldName} must match pattern ${pattern}`);
        }
    }

    get namespace(): string {
        return this._namespace;
    }

    /**
     * Gets the value of the Key
     * @returns The value as a string
     */
    get value(): string {
        return this._value;
    }

    /**
     * Returns the Key as a single string with namespace and value separated by the default separator
     * @returns A string in the format "namespace:value"
     */
    get string(): string {
        return `${this.namespace}${Key.DEFAULT_SEPARATOR}${this.value}`;
    }
}
