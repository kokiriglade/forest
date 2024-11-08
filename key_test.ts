import { assertEquals } from "jsr:@std/assert";
import { Key } from "./key.ts";

Deno.test("constructor overloading functions as expected", () => {
    assertEquals(
        Key.key("namespace", "value").asString(),
        Key.key("namespace:value").asString()
    );
});
