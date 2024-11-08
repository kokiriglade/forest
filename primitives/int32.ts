/**
 * A signed 32-bit integer
 *
 * @template T a type extending `number`
 * @extends {Number}
 */
export class Int32<T extends number = number> extends Number {
    /**
     * Create an instance of `Int32`
     *
     * The `value` parameter will be clamped to an 32-bit signed integer range
     *
     * @param {T} value the initial number value
     */
    constructor(value: T) {
        super(value | 0);
    }

    override valueOf(): T {
        return super.valueOf() as T;
    }

    get [Symbol.toStringTag](): "Int32" {
        return "Int32";
    }
}
