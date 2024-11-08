/**
 * A signed 8-bit integer
 *
 * @template T a type extending `number`
 * @extends {Number}
 */
export class Int8<T extends number = number> extends Number {
    /**
     * Create an instance of `Int8`
     *
     * The `value` parameter will be clamped to an 8-bit signed integer range
     *
     * @param {T} value the initial number value
     */
    constructor(value: T) {
        super(value << 24 >> 24);
    }

    override valueOf(): T {
        return super.valueOf() as T;
    }

    get [Symbol.toStringTag](): "Int8" {
        return "Int8";
    }
}
