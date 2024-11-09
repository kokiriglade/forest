import type { Component } from "./component.ts";
import type { Entity } from "./entity.ts";
import type { Table } from "./table.ts";
import type { TableResult } from "./table_result.ts";

export abstract class System<I, T extends Component<I>[]> {
    constructor(public table: Table<I>) {
    }

    abstract select(): TableResult<I, T>[];

    abstract update(entity: Entity, components: T): void | Promise<void>;
}
