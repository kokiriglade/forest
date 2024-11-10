import type { TableResult } from "./table_result.ts";
import type { Component } from "./component.ts";
import type { System } from "./system.ts";

/**
 * A hook can be used to run code at specific points in the tick lifecycle
 *
 * @template I Type identifier used to identify components and schedulers in the world
 */
export abstract class Hook<I> {
    /**
     * Runs before a system runs a round of updates on a list of pre-known entities and their components
     * @param system The system that just ran
     * @param results An array of results which are matched by the system
     */
    onPreSystemUpdate?(
        system: System<I, Component<I>[]>,
        results: TableResult<I, Component<I>[]>[],
    ): void;

    /**
     * Runs after a system runs a round of updates on a list of pre-known entities and their components
     * @param system The system that just ran
     * @param results An array of results which are matched by the system
     */
    onPostSystemUpdate?(
        system: System<I, Component<I>[]>,
        results: TableResult<I, Component<I>[]>[],
    ): void;

    /**
     * Runs before everything else
     */
    onPreTick?(): void;

    /**
     * Runs after everything else
     */
    onPostTick?(): void;
}
