import { from, type Option } from "@gnome/monads";
import type { Component } from "./component.ts";
import type { Scheduler } from "./scheduler.ts";
import type { System } from "./system.ts";
import { Table } from "./table.ts";
import { assertExists } from "@std/assert";

type SystemWrapper<I> = {
    scheduler: Scheduler<I>;
    system: System<I, Component<I>[]>;
};

/**
 * Manages entities, systems, and their lifecycle
 *
 * @template I Type identifier used to identify components and schedulers in the world
 */
export class World<I> {
    /**
     * Internal table managing component data for entities
     */
    private _table: Table<I> = new Table();

    /**
     * Collection of systems and their associated schedulers
     */
    private _systems: SystemWrapper<I>[] = [];

    /**
     * ID of the most recently added entity Used to auto-generate entity IDs
     */
    private _mostRecentEntityId: bigint = 0n;

    /**
     * The scheduler currently in control of the world's execution flow
     */
    private _currentlyRunningScheduler: Scheduler<I> | null = null;

    /**
     * Returns the entity-component table which stores component data for all entities
     *
     * @return {Readonly<Table<I>>} Read-only view of the component table
     */
    public get table(): Readonly<Table<I>> {
        return Object.freeze(this._table);
    }

    /**
     * Returns the systems within the world
     *
     * @return the systems
     */
    public get systems(): SystemWrapper<I>[] {
        return this._systems;
    }

    /**
     * Returns the scheduler currently running or `None` if none is active
     *
     * @return {Option<Scheduler<I>>} Option-wrapped scheduler currently in control
     */
    public get currentScheduler(): Option<Scheduler<I>> {
        return from(this._currentlyRunningScheduler);
    }

    /**
     * Adds a new entity with the specified components to the entity table If `id` is null, a new ID is generated
     *
     * Throws an error if an entity with the specified ID already exists
     *
     * @param {bigint | null} id Entity ID, or `null` to auto-generate one
     * @param {Component<I>[]} components Components to associate with the entity
     * @return {this} Returns the `World` instance for chaining
     */
    public addEntity(id: bigint | null, ...components: Component<I>[]): this {
        if (id === null) {
            id = this._mostRecentEntityId++;
        }

        assertExists(id);

        if (this._table.exists(id)) {
            throw new Error(`An entity with ID ${id} already exists`);
        }

        this._table.addAll(id, components);

        return this;
    }

    /**
     * Adds a new system with an associated scheduler to the world
     *
     * Throws an error if the scheduler or system is null
     *
     * @param {Scheduler<I>} scheduler Scheduler controlling when the system executes
     * @param {new (table: Table<I>) => System<I, T>} system System class to manage
     * @return {this} Returns the `World` instance for chaining
     */
    public addSystem<T extends Component<I>[]>(
        scheduler: Scheduler<I>,
        system: new (table: Table<I>) => System<I, T>,
    ): this {
        assertExists(scheduler);
        assertExists(system);

        const instance = new system(this._table);

        this._systems.push({
            scheduler,
            system: instance,
        });

        return this;
    }

    /**
     * Executes a single step of all systems managed by the specified scheduler
     *
     * @param {Scheduler<I>} scheduler Scheduler governing the systems to execute
     * @return {Promise<void>} A promise that resolves when all systems in the step have executed
     */
    public step(scheduler: Scheduler<I>) {
        assertExists(scheduler);

        const matchingSystems = this._systems.filter((wrapper) =>
            wrapper.scheduler === scheduler
        );

        for (const systemWrapper of matchingSystems) {
            const results = systemWrapper.system.select();

            if (results.length === 0) {
                continue;
            }

            for (const result of results) {
                systemWrapper.system.update(
                    result.entity,
                    result.components,
                );
            }
        }
    }

    /**
     * Advances the scheduler to the next available system in the sequence
     *
     * Throws an error if no systems are available to run
     */
    public advance() {
        if (this._systems.length === 0) {
            throw new Error("No systems to run");
        }

        const schedulers: Scheduler<I>[] = this._systems.map((wrapper) =>
            wrapper.scheduler
        );

        if (this._currentlyRunningScheduler === null) {
            schedulers.sort((a, b) => a.order - b.order);

            this._currentlyRunningScheduler = schedulers[0] ?? null;
        } else {
            this._currentlyRunningScheduler = schedulers[
                schedulers.indexOf(this._currentlyRunningScheduler) + 1
            ] ?? null;
        }
    }

    /**
     * Tick the world once
     *
     * @returns {boolean} `false` if there are no more schedulers to run
     */
    public tick(): boolean {
        this.advance();

        if (this.currentScheduler.isNone) {
            return false;
        }

        const scheduler: Scheduler<I> = this.currentScheduler.unwrap();

        if (scheduler.shouldRun()) {
            this.step(scheduler);
        } else {
            this.advance();
        }

        return true;
    }
}
