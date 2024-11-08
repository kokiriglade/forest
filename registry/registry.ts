import { assertExists } from "@std/assert";
import { from, type Option } from "@gnome/monads/option";
import type { Holder } from "./holder.ts";
import { Immediate, Lazy } from "./holders.ts";
import { HolderType } from "./holder.ts";

export class Registry<K, V> {
    private _map: Map<K, Holder<K, V>> = new Map();
    private _keys: ReadonlySet<K> | null = null;

    constructor() {
    }

    get(key: K): Holder<K, V> | null {
        assertExists(key);
        const value = this._map.get(key);
        return value == undefined ? null : value;
    }

    getOptionally(key: K): Option<Holder<K, V>> {
        assertExists(key);
        return from(this.get(key));
    }

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

    get keys(): ReadonlySet<K> {
        if (this._keys === null) {
            this._keys = new Set(this._map.keys()) as ReadonlySet<K>;
        }
        return this._keys;
    }
}
