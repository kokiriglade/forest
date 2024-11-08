// Copyright Seiama 2021-2023. MIT license.
// Ported mostly from https://github.com/seiama/registry/

/**
 * A WORM (Write-Once, Read-Many) map implementation designed for reliable storage of immutable values
 *
 * This module provides a `Registry` class, which allows for registering a unique key-value pair once
 *
 * Once registered, the data cannot be modified or overwritten
 *
 * @example
 * ```ts
 * import { type Holder, Registry } from "@forest/registry";
 * import { assertEquals, assertExists } from "@std/assert";
 *
 * const registry: Registry<string, number> = new Registry();
 * registry.register("meaning of life", 42);
 *
 * const holder: Holder<string, number> | null = registry.get("meaning of life");
 *
 * assertExists(holder);
 * assertEquals(holder.value, 42);
 * ```
 *
 * @module
 */
export * from "./holder.ts";
export * from "./registry.ts";
