import type { Component } from "./component.ts";
import type { Entity } from "./entity.ts";
import type { Table } from "./table.ts";
import type { TableResult } from "./table_result.ts";

/**
 * Represents a system in an entity-component-system (ECS) framework
 * Responsible for selecting and updating entities with specific components
 *
 * @template I Type identifier for components in the system
 * @template T Array of components required by this system
 */
export abstract class System<I, T extends Component<I>[]> {
    /**
     * Constructs a new system with a reference to the entity-component table
     *
     * @param {Table<I>} table The table holding components for entities
     */
    constructor(public table: Table<I>) {
    }

    /**
     * Selects entities with the specific components required by this system
     * Implementations should define selection criteria based on component types
     *
     * @return {TableResult<I, T>[]} Array of table results with entities and matching components
     */
    abstract select(): TableResult<I, T>[];

    /**
     * Updates the specified entity with its associated components
     * Implementations should define the logic for updating each entity and its components
     *
     * @param {Entity} entity The entity to update
     * @param {T} components Array of components associated with the entity
     * @return {void | Promise<void>} Optionally returns a promise for asynchronous updates
     */
    abstract update(entity: Entity, components: T): void | Promise<void>;
}
