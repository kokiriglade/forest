import type { Component, ComponentConstructor } from "./component.ts";
import type { Entity } from "./entity.ts";
import { from, none, type Option } from "@gnome/monads";
import { assertExists } from "@std/assert";
import type { TableResult } from "./table_result.ts";

/**
 * A map of entities to sets of components
 */
export class Table<I> {
    private _table: Map<Entity, Component<I>[]> = new Map();

    public add(entity: Entity, component: Component<I>) {
        const components = this._table.get(entity);

        if (!components) {
            this._table.set(entity, [component]);
        } else {
            components.push(component);
        }
    }

    public addAll(entity: Entity, newComponents: Component<I>[]) {
        const components = this._table.get(entity);

        if (!components) {
            this._table.set(entity, newComponents);
        } else {
            components.push(...components);
        }
    }

    public exists(entity: Entity): boolean {
        return this._table.has(entity);
    }

    public has(entity: Entity, component: ComponentConstructor<I>): boolean {
        const components = this._table.get(entity);

        if (!components) {
            return false;
        }

        return components.some((c) => c instanceof component);
    }

    public hasAll(
        entity: Entity,
        requiredComponents: ComponentConstructor<I>[],
    ): boolean {
        assertExists(entity);
        assertExists(requiredComponents);

        const components = this._table.get(entity);

        if (!components) {
            return false;
        }

        return requiredComponents.every((component) =>
            components.some((c) => c instanceof component)
        );
    }

    public get<T extends Component<I>>(
        entity: Entity,
        component: ComponentConstructor<T>,
    ): Option<T> {
        assertExists(entity);
        assertExists(component);

        const components = this._table.get(entity);

        if (!components) {
            return none();
        }

        assertExists(components);

        return from(components.find((c) => c instanceof component) as T);
    }

    public getAll(entity: Entity): Option<Component<I>[]> {
        assertExists(entity);

        return from(this._table.get(entity));
    }

    public find<T extends Component<I>[]>(
        ...requiredComponents: { [K in keyof T]: ComponentConstructor<T[K]> }
    ): TableResult<I, T>[] {
        const results: TableResult<I, T>[] = [];

        for (const [entity, components] of this._table) {
            const matching = requiredComponents.map((component) =>
                components.find((c) => c instanceof component)
            );

            if (matching.every((c) => c !== undefined)) {
                results.push({
                    entity,
                    components: matching as T,
                });
            }
        }

        return results;
    }

    public remove(entity: Entity) {
        this._table.delete(entity);
    }
}
