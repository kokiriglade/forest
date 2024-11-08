import { Float32, Int16, Int32, Int8 } from "@forest/primitives";
import { assertEquals } from "@std/assert";

Deno.test("Int8: should handle values within 8-bit range", () => {
    const int8 = new Int8(127);
    assertEquals(int8.valueOf(), 127);
    assertEquals(Object.prototype.toString.call(int8), "[object Int8]");
});

Deno.test("Int8: should overflow and wrap around for out-of-range values", () => {
    const int8 = new Int8(200);
    assertEquals(int8.valueOf(), -56); // Expected due to 8-bit signed overflow
});

Deno.test("Int16: should handle values within 16-bit range", () => {
    const int16 = new Int16(32767);
    assertEquals(int16.valueOf(), 32767);
    assertEquals(Object.prototype.toString.call(int16), "[object Int16]");
});

Deno.test("Int16: should overflow and wrap around for out-of-range values", () => {
    const int16 = new Int16(40000);
    assertEquals(int16.valueOf(), -25536); // Expected due to 16-bit signed overflow
});

Deno.test("Int32: should handle values within 32-bit range", () => {
    const int32 = new Int32(2147483647);
    assertEquals(int32.valueOf(), 2147483647);
    assertEquals(Object.prototype.toString.call(int32), "[object Int32]");
});

Deno.test("Int32: should overflow and wrap around for out-of-range values", () => {
    const int32 = new Int32(2147483648);
    assertEquals(int32.valueOf(), -2147483648); // Expected due to 32-bit signed overflow
});

Deno.test("Float32: should handle floating-point values", () => {
    const float32 = new Float32(3.14);
    assertEquals(float32.valueOf(), 3.14);
    assertEquals(Object.prototype.toString.call(float32), "[object Float32]");
});

Deno.test("Float32: should handle large floating-point values", () => {
    const float32 = new Float32(1.23e38);
    assertEquals(float32.valueOf(), 1.23e38);
});
