/**
 * A way for objects to be identified at runtime
 *
 * @template I how it is identified
 */
export interface Identifiable<I> {
    get identity(): I;
}
