// Copyright KyoriPowered 2017-2024. MIT license.
// Ported mostly from https://github.com/KyoriPowered/adventure/tree/774b52564354666aab2134de0e7e2ef61b57da89/key

/**
 * A reference composed of a namespace and a path.
 *
 * A namespace is a domain for content. It is to prevent potential content conflicts or unintentional overrides of objects of the same name.
 *
 * The namespace and the path of a resource location should only contain the following symbols:
 *
 * - `0123456789` Numbers
 * - `abcdefghijklmnopqrstuvwxyz` Lowercase letters
 * - `_` Underscore
 * - `-` Hyphen/minus
 * - `.` Dot
 *
 * The following characters are illegal in the namespace, but acceptable in the path:
 *
 * - `/` Forward slash (directory separator)
 *
 * The preferred naming convention for either namespace or path is `snake_case`.
 *
 * @example
 * ```ts
 * import { Key } from "@forest/key";
 *
 * Key.key("kokiri", "forest").string // "kokiri:forest"
 * ```
 *
 * @module
 */
export * from "./key.ts";
export * from "./namespaced.ts";
export * from "./keyed.ts";
