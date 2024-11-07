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
 * import { Key } from "@kokiri/key";
 *
 * Key.key("kokiriglade", "my_thing").asString() // "kokiriglade:my_thing"
 * ```
 *
 * @module
 */
export * from "./key.ts"
export * from "./namespaced.ts"
