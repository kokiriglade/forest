import { from, type Option } from "@gnome/monads";
import type { Component } from "./component.ts";
import type { Scheduler } from "./scheduler.ts";
import type { System } from "./system.ts";
import { Table } from "./table.ts";
import { assertExists } from "@std/assert";

/**
 * Responsible for managing entities and systems
 *
 * @template I type used to identify components and schedulers in the world
 */
export class World<I> {
    private _table: Table<I> = new Table();

    private _systems: {
        scheduler: Scheduler<I>;
        system: System<I, Component<I>[]>;
    }[] = [];

    private _mostRecentEntityId: bigint = 0n;

    private _currentlyRunningScheduler: Scheduler<I> | null = null;

    public get table(): Readonly<Table<I>> {
        return Object.freeze(this._table);
    }

    public get currentScheduler(): Option<Scheduler<I>> {
        return from(this._currentlyRunningScheduler);
    }

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

    public async step(scheduler: Scheduler<I>): Promise<void> {
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
                const res = systemWrapper.system.update(
                    result.entity,
                    result.components,
                );

                if (res instanceof Promise) {
                    await res;
                }
            }
        }
    }

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
}
