/**
 * A 32-bit floating point number
 *
 * @template T a type extending `number`
 * @extends {Number}
 */
export class Float32<T extends number = number> extends Number {
    /**
     * Create an instance of `Float32`
     *
     * @param {T} value the initial number value
     */
    constructor(value: T) {
        super(value);
    }

    override valueOf(): T {
        return super.valueOf() as T;
    }

    get [Symbol.toStringTag](): "Float32" {
        return "Float32";
    }
}
