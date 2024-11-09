/**
 * This module provides an entity-component-system (ECS) framework for building and managing complex,
 * component-based systems
 *
 * @example
 * ```typescript
 * import { Component, type Entity, Scheduler, System, World, type TableResult } from "@forest/ecs";
 * import { assertEquals } from "@std/assert";
 *
 * // a position component
 * class PositionComponent extends Component<string> {
 *     constructor(public x: number, public y: number) {
 *         super("position");
 *     }
 * }
 *
 * // a system that operates on entities with a `PositionComponent`
 * class MovementSystem extends System<string, [PositionComponent]> {
 *     override select(): TableResult<string, [PositionComponent]>[] {
 *         return this.table.find(PositionComponent);
 *     }
 *
 *     update(_entity: Entity, [position]: [PositionComponent]) {
 *         position.x += 1;
 *         position.y += 1;
 *     }
 * }
 *
 * // a basic scheduler that runs every step
 * class BasicScheduler extends Scheduler<string> {
 *     constructor() {
 *         super("basic", 1, () => true);
 *     }
 * }
 *
 * // create the world and add an entity, component, system, and scheduler
 * const world = new World<string>();
 * const scheduler = new BasicScheduler();
 *
 * const entityId = 1n;
 *
 * world.addEntity(entityId, new PositionComponent(0, 0))
 *     .addSystem(scheduler, MovementSystem);
 *
 * // step through the each system once
 * await world.step(scheduler);
 *
 * const position = world.table.get(entityId, PositionComponent);
 * if (position.isSome) {
 *     assertEquals(position.unwrap().x, 1);
 *     assertEquals(position.unwrap().y, 1);
 * }
 * ```
 *
 * @module
 */
export * from "./entity.ts";
export * from "./component.ts";
export * from "./system.ts";
export * from "./scheduler.ts";
export * from "./world.ts";
export * from "./table_result.ts";
export * from "./identifiable.ts";
export * from "./table.ts";
