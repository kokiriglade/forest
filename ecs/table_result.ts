import type { Component } from "./component.ts";
import type { Entity } from "./entity.ts";

/**
 * A result from the entity-component table. Contains a component and the entity that owns the component
 */
export class TableResult<I, T extends Component<I>[]> {
    constructor(public entity: Entity, public components: T) {
    }
}
