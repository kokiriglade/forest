/**
 * A signed 16-bit integer
 *
 * @template T a type extending `number`
 * @extends {Number}
 */
export class Int16<T extends number = number> extends Number {
    /**
     * Create an instance of `Int16`
     *
     * The `value` parameter will be clamped to an 16-bit signed integer range
     *
     * @param {T} value the initial number value
     */
    constructor(value: T) {
        super(value << 16 >> 16);
    }

    override valueOf(): T {
        return super.valueOf() as T;
    }

    get [Symbol.toStringTag](): "Int16" {
        return "Int16";
    }
}
