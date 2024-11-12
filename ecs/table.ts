// deno-lint-ignore-file no-explicit-any
import type { Component, ComponentConstructor } from "./component.ts";
import type { Entity } from "./entity.ts";
import { from, none, type Option } from "@gnome/monads";
import type { TableResult } from "./table_result.ts";

/**
 * A map of entities to sets of components
 *
 * Provides methods for managing components associated with each entity
 */
export class Table<I> {
    private _table: Map<Entity, Map<ComponentConstructor<any>, Component<I>>> =
        new Map();
    private _componentIndex: Map<ComponentConstructor<any>, Set<Entity>> =
        new Map();
    private _componentEntityMap: Map<
        ComponentConstructor<any>,
        Map<Entity, Component<I>>
    > = new Map();

    /**
     * Adds a component to the specified entity's component set
     *
     * If the entity doesn't already have any components, a new entry is created
     *
     * @param {Entity} entity The entity to which the component is added
     * @param {Component<I>} component The component to add to the entity
     */
    public add(entity: Entity, component: Component<I>) {
        let components = this._table.get(entity);

        if (!components) {
            components = new Map();
            this._table.set(entity, components);
        }

        components.set(
            component.constructor as ComponentConstructor<any>,
            component,
        );

        const componentType = component.constructor as ComponentConstructor<
            any
        >;
        if (!this._componentIndex.has(componentType)) {
            this._componentIndex.set(componentType, new Set());
        }
        this._componentIndex.get(componentType)!.add(entity);

        if (!this._componentEntityMap.has(componentType)) {
            this._componentEntityMap.set(componentType, new Map());
        }
        this._componentEntityMap.get(componentType)!.set(entity, component);
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
        let components = this._table.get(entity);

        if (!components) {
            components = new Map();
            this._table.set(entity, components);
        }

        for (const component of newComponents) {
            components.set(
                component.constructor as ComponentConstructor<any>,
                component,
            );
        }

        for (const component of newComponents) {
            const componentType = component.constructor as ComponentConstructor<
                any
            >;
            if (!this._componentIndex.has(componentType)) {
                this._componentIndex.set(componentType, new Set());
            }
            this._componentIndex.get(componentType)!.add(entity);

            if (!this._componentEntityMap.has(componentType)) {
                this._componentEntityMap.set(componentType, new Map());
            }
            this._componentEntityMap.get(componentType)!.set(entity, component);
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
     * Checks if an entity has a specific component.
     *
     * @param {Entity} entity The entity to check.
     * @param {ComponentConstructor<I>} component The component type to check for.
     * @return {boolean} True if the entity has the component, false otherwise.
     */
    public has<T extends Component<I>>(
        entity: Entity,
        component: ComponentConstructor<T>,
    ): boolean {
        const components = this._table.get(entity);
        return components ? components.has(component) : false;
    }

    /**
     * Checks if an entity has all specified components.
     *
     * @param {Entity} entity The entity to check.
     * @param {ComponentConstructor<I>[]} requiredComponents The component types to check for.
     * @return {boolean} True if the entity has all components, false otherwise.
     */
    public hasAll<T extends Component<I>[]>(
        entity: Entity,
        ...requiredComponents: { [K in keyof T]: ComponentConstructor<T[K]> }
    ): boolean {
        const components = this._table.get(entity);
        if (!components) {
            return false;
        }

        return requiredComponents.every((component) =>
            components.has(component)
        );
    }

    /**
     * Retrieves a specific component from an entity.
     *
     * @param {Entity} entity The entity to retrieve the component from.
     * @param {ComponentConstructor<T>} component The type of component to retrieve.
     * @return {Option<T>} The component if found, or `none` if not.
     */
    public get<T extends Component<I>>(
        entity: Entity,
        component: ComponentConstructor<T>,
    ): Option<T> {
        const components = this._table.get(entity);

        if (components && components.has(component)) {
            return from(components.get(component) as T);
        }

        return none();
    }

    /**
     * Retrieves all components associated with an entity
     *
     * @param {Entity} entity The entity to retrieve components from
     * @return {Option<Component<I>[]>} The components if found, or `none` if not
     */
    public getAll(entity: Entity): Option<Component<I>[]> {
        const components = this._table.get(entity);

        if (components) {
            return from(Array.from(components.values()));
        }

        return none();
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
        if (requiredComponents.length === 0) {
            return [];
        }

        // Get sets of entities for each required component
        const entitySets = requiredComponents.map((component) => {
            return this._componentIndex.get(component) || new Set<Entity>();
        });

        // Find the intersection of all entity sets
        const resultEntities = this.intersectSets(entitySets);
        if (resultEntities.size === 0) {
            return [];
        }

        // Retrieve the matching components for each entity using _componentEntityMap
        const results: TableResult<I, T>[] = [];
        for (const entity of resultEntities) {
            const components = requiredComponents.map((component) => {
                return this._componentEntityMap.get(component)!.get(
                    entity,
                )! as T[number];
            }) as T;
            results.push({ entity, components });
        }

        return results;
    }

    private intersectSets(sets: Set<Entity>[]): Set<Entity> {
        if (sets.length === 0) {
            return new Set<Entity>();
        }

        // Sort sets to start with the smallest
        sets.sort((a, b) => a.size - b.size);

        const result = new Set<Entity>(sets[0]);
        for (let i = 1; i < sets.length; i++) {
            const set = sets[i];
            for (const entity of result) {
                if (set && !set.has(entity)) {
                    result.delete(entity);
                }
            }
            if (result.size === 0) {
                break;
            }
        }
        return result;
    }

    /**
     * Removes an entity and all its components from the table
     *
     * @param {Entity} entity The entity to remove
     */
    public remove(entity: Entity) {
        const components = this._table.get(entity);
        if (components) {
            for (const [componentType] of components) {
                const entities = this._componentIndex.get(componentType);
                if (entities) {
                    entities.delete(entity);
                    if (entities.size === 0) {
                        this._componentIndex.delete(componentType);
                    }
                }

                const componentEntityMap = this._componentEntityMap.get(
                    componentType,
                );
                if (componentEntityMap) {
                    componentEntityMap.delete(entity);
                    if (componentEntityMap.size === 0) {
                        this._componentEntityMap.delete(componentType);
                    }
                }
            }
            this._table.delete(entity);
        }
    }
}
