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
export type ComponentConstructor<I, T extends Component<I> = Component<I>> =
    new (
        ...args: never[]
    ) => T;
