import {
    assert,
    assertEquals,
    assertExists,
    assertFalse,
    assertNotEquals,
    assertStrictEquals,
    assertThrows,
} from "@std/assert";
import { Registry } from "./registry.ts";
import { from, none } from "@gnome/monads";
import { type Holder, HolderType } from "./holder.ts";

const EMPTY: string = "empty";
const DEFAULT: number = 42;

Deno.test("get before get or create", () => {
    const registry: Registry<string, number> = new Registry();

    assertEquals(registry.get(EMPTY), null);
    assertEquals(none(), registry.getOptionally(EMPTY));
    const holder: Holder<string, number> = registry.getOrCreate(EMPTY);
    assertStrictEquals(EMPTY, holder.key);
    // should now return the unbound holder we created
    assertEquals(holder, registry.get(EMPTY));
    assertEquals(from(holder), registry.getOptionally(EMPTY));
});

Deno.test("immediate", () => {
    const registry: Registry<string, number> = new Registry();

    const holder: Holder<string, number> = registry.register(EMPTY, DEFAULT);

    assertStrictEquals(EMPTY, holder.key);

    const keySet: Set<string> = new Set();
    keySet.add(EMPTY);
    assertEquals(keySet, registry.keys);

    assertStrictEquals(holder.type, HolderType.IMMEDIATE);

    assert(holder.bound);
    assertStrictEquals(DEFAULT, holder.value);
    assertEquals(from(DEFAULT), holder.valueOptionally());

    assertEquals(holder, registry.get(EMPTY));

    // assert does not throw
    assertThrows(() => assertThrows(() => holder.valueOrThrow()));

    assertThrows(() => registry.register(EMPTY, 69));
});

Deno.test("lazy", () => {
    const registry: Registry<string, number> = new Registry();

    const holderBeforeRegistration: Holder<string, number> = registry
        .getOrCreate(EMPTY);

    assertStrictEquals(EMPTY, holderBeforeRegistration.key);

    const keySet: Set<string> = new Set();
    keySet.add(EMPTY);
    assertEquals(keySet, registry.keys);

    assertStrictEquals(holderBeforeRegistration.type, HolderType.LAZY);

    assertFalse(holderBeforeRegistration.bound);
    assertThrows(() => assertExists(holderBeforeRegistration.value));
    assertEquals(none(), holderBeforeRegistration.valueOptionally());
    assertThrows(() => holderBeforeRegistration.valueOrThrow());

    const holderAfterRegistration: Holder<string, number> = registry.register(
        EMPTY,
        DEFAULT,
    );

    assertStrictEquals(holderAfterRegistration.type, HolderType.LAZY);

    assertStrictEquals(holderBeforeRegistration, holderAfterRegistration);

    assert(holderBeforeRegistration.bound);

    assertEquals(DEFAULT, holderBeforeRegistration.value);
    assertEquals(from(DEFAULT), holderBeforeRegistration.valueOptionally());

    // assert does not throw
    assertThrows(() =>
        assertThrows(() => holderBeforeRegistration.valueOrThrow())
    );

    assertThrows(() => registry.register(EMPTY, 69));
});

Deno.test("register same value with different keys", () => {
    const registry: Registry<string, number> = new Registry();

    const holder1: Holder<string, number> = registry.register("a", DEFAULT);
    // assert does not throw
    assertThrows(() => assertThrows(() => holder1.valueOrThrow()));

    const holder2: Holder<string, number> = registry.register("b", DEFAULT);
    // assert does not throw
    assertThrows(() => assertThrows(() => holder2.valueOrThrow()));

    assertNotEquals(holder1, holder2);
});

Deno.test("keys", () => {
    const registry: Registry<string, number> = new Registry();

    assert(registry.keys.size == 0);

    registry.register(EMPTY, DEFAULT);

    const keySet: Set<string> = new Set();
    keySet.add(EMPTY);
    assertEquals(keySet, registry.keys);
});
