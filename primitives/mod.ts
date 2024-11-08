/**
 * Primitive data types for representing specific numeric ranges and behaviors
 *
 * This module provides classes for handling integers with 8-bit, 16-bit, and 32-bit ranges
 * and a 32-bit floating-point number type
 *
 * Each class ensures values stay within the specified range, supporting wrap-around for overflow, which simulates low-level data type constraints
 *
 * @example
 * ```typescript
 * import { Int8, Int16, Int32, Float32 } from "@forest/primitives";
 * import { assertEquals } from "@std/assert";
 *
 * const smallInt = new Int8(127);         // 8-bit integer
 * const mediumInt = new Int16(32767);     // 16-bit integer
 * const largeInt = new Int32(2147483647); // 32-bit integer
 * const floatVal = new Float32(3.14);     // 32-bit floating-point number
 *
 * assertEquals(smallInt.valueOf(), 127);
 * assertEquals(mediumInt.valueOf(), 32767);
 * assertEquals(largeInt.valueOf(), 2147483647);
 * assertEquals(floatVal.valueOf(), 3.14);
 *
 * const outOfRangeInt = new Int8(200); // Value goes out of 8-bit signed range
 * assertEquals(outOfRangeInt.valueOf(), -56); // Expected result due to overflow
 * ```
 *
 * @module
 */
export * from "./int8.ts";
export * from "./int16.ts";
export * from "./int32.ts";
export * from "./float32.ts";
