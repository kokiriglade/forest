import {
    assertExists,
    type AssertionError as _AssertionError,
} from "@std/assert";
import { from, type Option } from "@gnome/monads/option";
import type { Holder } from "./holder.ts";
import { Immediate, Lazy } from "./holders.ts";
import { HolderType } from "./holder.ts";

/**
 * A registry
 *
 * @template K the key type
 * @template V the value type
 */
export class Registry<K, V> {
    private _map: Map<K, Holder<K, V>> = new Map();
    private _keys: ReadonlySet<K> | null = null;

    /** Creates a new registry */
    constructor() {
    }

    /**
     * Gets a holder by its key
     *
     * `null` will be returned if no value has been {@linkcode register registered} for `key`
     *
     * @param key the key
     * @returns a holder, or `null`
     * @throws {_AssertionError} if the provided key is null
     */
    get(key: K): Holder<K, V> | null {
        assertExists(key);
        const value = this._map.get(key);
        return value == undefined ? null : value;
    }

    /**
     * Gets a holder by its key
     *
     * @param key the key
     * @returns a holder, or an empty option
     * @throws {_AssertionError} if the provided key is null
     */
    getOptionally(key: K): Option<Holder<K, V>> {
        assertExists(key);
        return from(this.get(key));
    }

    /**
     * Gets a holder by its key, or creates a new holder if one does not already exist and registers it against the provided key
     *
     * The returned holder may contain a value if one has previously been registered, or it may be empty, pending future value registration
     *
     * @param key the key
     * @returns a holder
     * @throws {_AssertionError} if the provided key is null
     */
    getOrCreate(key: K): Holder<K, V> {
        assertExists(key);

        let holder: Holder<K, V> | null = this.get(key);

        if (holder == null) {
            holder = new Lazy(key);
            this._map.set(key, holder);
            this._keys = null;
        }

        return holder;
    }

    /**
     * Registeres `value` to `key`, returning a {@link Holder}
     *
     * @param key the key
     * @param value the value
     * @returns a holder
     * @throws {_AssertionError} if the provided key or value are null
     */
    register(key: K, value: V): Holder<K, V> {
        assertExists(key);
        assertExists(value);

        let holder: Holder<K, V> | null = this.get(key);

        if (holder == null) {
            holder = new Immediate(key, value);
            this._map.set(key, holder);
            this._keys = null;
        } else {
            let oldValue: V | null = null;

            if (holder.type == HolderType.IMMEDIATE) {
                oldValue = holder.value;
            } else if (holder.type == HolderType.LAZY) {
                oldValue = (holder as Lazy<K, V>).bind(value);
            }

            if (oldValue != null) {
                if (oldValue != value) {
                    throw new Error(
                        `${key} is already bound to ${oldValue}, cannot bind to ${value}`,
                    );
                }
            }
        }

        return holder;
    }

    /**
     * Gets the keys
     *
     * @return the keys
     */
    get keys(): ReadonlySet<K> {
        if (this._keys === null) {
            this._keys = new Set(this._map.keys()) as ReadonlySet<K>;
        }
        return this._keys;
    }
}
