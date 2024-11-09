import type { Identifiable } from "./identifiable.ts";

/**
 * A way to group systems together and run them in a specific order
 *
 * @template I type used to identify schedulers
 */
export abstract class Scheduler<I> implements Identifiable<I> {
    constructor(
        public identity: I,
        public order: number,
        public shouldRun: () => boolean,
    ) {
    }
}
