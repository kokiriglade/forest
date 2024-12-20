import { assertEquals } from "@std/assert";
import { Key } from "./key.ts";

Deno.test("constructor overloading functions as expected", () => {
    assertEquals(
        Key.key("namespace", "value").string,
        Key.key("namespace:value").string,
    );
});
