import type { Identifiable } from "./identifiable.ts";

/**
 * A component that can be added to an entity
 *
 * @template I a way for the component to be identified at runtime
 */
export abstract class Component<I> implements Identifiable<I> {
    constructor(public identity: I) {
    }
}

/**
 * A constructor for a component
 *
 * @param args The arguments to pass to the constructor
 * @template T The component type
 */
// deno-lint-ignore no-explicit-any
export type ComponentConstructor<T extends Component<any>> = new (
    // deno-lint-ignore no-explicit-any
    ...args: any[]
) => T;
