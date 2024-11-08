import { type Holder, HolderType } from "./holder.ts";
import { from, type Option } from "@gnome/monads";

/**
 * Immediate holder class with an assigned value
 *
 * @template K The key type
 * @template V The value type
 */
export class Immediate<K, V> implements Holder<K, V> {
    constructor(private readonly keyValue: K, private readonly val: V) {}

    get key(): K {
        return this.keyValue;
    }

    get value(): V | null {
        return this.val;
    }

    get bound(): boolean {
        return true;
    }

    valueOptionally(): Option<V> {
        return from(this.val);
    }

    valueOrThrow(): V {
        return this.val;
    }

    get type(): HolderType {
        return HolderType.IMMEDIATE;
    }
}

/**
 * Lazy holder class where the value is assigned later
 *
 * @template K The key type
 * @template V The value type
 */
export class Lazy<K, V> implements Holder<K, V> {
    private _value: V | null = null;

    constructor(private readonly keyValue: K) {}

    get key(): K {
        return this.keyValue;
    }

    /**
     * Binds a value to the lazy holder if it has not been assigned yet
     * @param value - The value to bind
     * @returns `null` if binding is successful, or the existing value if already bound
     */
    bind(value: V): V | null {
        if (this._value === null) {
            this._value = value;
            return null;
        } else {
            return this._value;
        }
    }

    get value(): V | null {
        return this._value;
    }

    get bound(): boolean {
        return this._value !== null;
    }

    valueOptionally(): Option<V> {
        return from(this._value);
    }

    valueOrThrow(): V {
        if (this._value == null) {
            throw new Error("No value bound to this holder");
        }
        return this._value;
    }

    get type(): HolderType {
        return HolderType.LAZY;
    }
}
