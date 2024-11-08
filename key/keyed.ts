import type { Key } from "./key.ts";

/**
 * Something that has an associated {@link Key}
 */
export interface Keyed {
    /** Gets the key */
    readonly key: Key;
}
