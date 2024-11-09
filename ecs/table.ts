import type { Component, ComponentConstructor } from "./component.ts";
import type { Entity } from "./entity.ts";
import { from, none, type Option } from "@gnome/monads";
import { assertExists } from "@std/assert";
import type { TableResult } from "./table_result.ts";

/**
 * A map of entities to sets of components
 *
 * Provides methods for managing components associated with each entity
 */
export class Table<I> {
    private _table: Map<Entity, Component<I>[]> = new Map();

    /**
     * Adds a component to the specified entity's component set
     *
     * If the entity doesn't already have any components, a new entry is created
     *
     * @param {Entity} entity The entity to which the component is added
     * @param {Component<I>} component The component to add to the entity
     */
    public add(entity: Entity, component: Component<I>) {
        const components = this._table.get(entity);

        if (!components) {
            this._table.set(entity, [component]);
        } else {
            components.push(component);
        }
    }

    /**
     * Adds multiple components to the specified entity's component set
     *
     * If the entity doesn't already have any components, a new entry is created
     *
     * @param {Entity} entity The entity to which components are added
     * @param {Component<I>[]} newComponents The components to add to the entity
     */
    public addAll(entity: Entity, newComponents: Component<I>[]) {
        const components = this._table.get(entity);

        if (!components) {
            this._table.set(entity, newComponents);
        } else {
            components.push(...newComponents);
        }
    }

    /**
     * Checks if an entity exists in the table
     *
     * @param {Entity} entity The entity to check
     * @return {boolean} True if the entity exists, false otherwise
     */
    public exists(entity: Entity): boolean {
        return this._table.has(entity);
    }

    /**
     * Checks if an entity has a specific component
     *
     * @param {Entity} entity The entity to check
     * @param {ComponentConstructor<I>} component The component type to check for
     * @return {boolean} True if the entity has the component, false otherwise
     */
    public has<T extends Component<I>>(
        entity: Entity,
        component: ComponentConstructor<T>,
    ): boolean {
        const components = this._table.get(entity);

        if (!components) {
            return false;
        }

        return components.some((c) => c instanceof component);
    }

    /**
     * Checks if an entity has all specified components
     *
     * @param {Entity} entity The entity to check
     * @param {ComponentConstructor<I>[]} requiredComponents The component types to check for
     * @return {boolean} True if the entity has all components, false otherwise
     */
    public hasAll<T extends Component<I>[]>(
        entity: Entity,
        ...requiredComponents: { [K in keyof T]: ComponentConstructor<T[K]> }
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

    /**
     * Retrieves a specific component from an entity
     *
     * @param {Entity} entity The entity to retrieve the component from
     * @param {ComponentConstructor<T>} component The type of component to retrieve
     * @return {Option<T>} The component if found, or `none` if not
     */
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

    /**
     * Retrieves all components associated with an entity
     *
     * @param {Entity} entity The entity to retrieve components from
     * @return {Option<Component<I>[]>} The components if found, or `none` if not
     */
    public getAll(entity: Entity): Option<Component<I>[]> {
        assertExists(entity);

        return from(this._table.get(entity));
    }

    /**
     * Finds entities that have all specified components
     *
     * @param {...{[K in keyof T]: ComponentConstructor<T[K]>}} requiredComponents The component types to find
     * @return {TableResult<I, T>[]} Array of results with entities and matching components
     */
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

    /**
     * Removes an entity and all its components from the table
     *
     * @param {Entity} entity The entity to remove
     */
    public remove(entity: Entity) {
        this._table.delete(entity);
    }
}
