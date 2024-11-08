import type { Option } from "@gnome/monads";

/**
 * A holder of a value.
 *
 * @template K the key type
 * @template V the value type
 */
export interface Holder<K, V> {
    /**
     * Gets the key
     *
     * @returns the key
     */
    readonly key: K;

    /**
     * Checks if this holder has a value associated
     *
     * @returns `true` if this holder has a value associated, `false` otherwise
     */
    readonly bound: boolean;

    /**
     * Gets the value
     * @returns the value, or `null`
     */
    readonly value: V | null;

    /**
     * Gets the value wrapped in an `Option`
     *
     * @returns the value wrapped in an `Option`
     */
    valueOptionally(): Option<V>;

    /**
     * Gets the value, or throws an error if no value is bound
     *
     * @returns the value
     * @throws {Error} if no value is bound
     */
    valueOrThrow(): V;

    /**
     * Gets the type
     *
     * @returns the type
     */
    readonly type: HolderType;
}

/** The type of a {@link Holder} */
export enum HolderType {
    /** An immediate holderhas a value available at time of creation. */
    IMMEDIATE = "IMMEDIATE",
    /**
     * A lazy holder has a value of `null` at the time of creation, with the actual value being assigned at a later time
     *
     * This type of holder is useful where a forward-reference of a value may be required
     */
    LAZY = "LAZY",
}
