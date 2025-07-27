export interface ReadonlyCounter<T, out N extends number|bigint> extends ReadonlyMap<T, N> {
    /**
     * Returns the count of the given key, or 0 if not present.
     */
    get(key: T): N;
    /**
     * Returns an iterable of all elements, each key repeated by its count.
     */
    elements(): Iterable<T>;
    /**
     * Returns the total count of all keys.
     */
    readonly total: N;
    /**
     * Returns a new mutable Counter with only the positive counts.
     */
    readonly pos: Counter<T, N>;
    /**
     * Returns a new mutable Counter with only the negative counts, inverted to positive values.
     */
    readonly neg: Counter<T, N>;
}
export interface Counter<T, N extends number|bigint> extends ReadonlyCounter<T, N> {
    // no public constructor
    // static fromKeys(keys: Iterable<T>, value: N = 1): Counter<T, N>;
    // static fromEntries(entries: Iterable<[T, N]>): Counter<T, N>;
    /**
     * Sets the count of each key to the corresponding value.
     */
    update(iterable: Iterable<[T, N]>): void;
    /**
     * Increments the count of the given key by value (default 1).
     */
    increment(key: T, value?: N): void;
    /**
     * Updates the counts by incrementing each key by the corresponding value.
     */
    updateBy(iterable: Iterable<[T, N]>): void;
    /**
     * Increments the count of each passed key by 1.
     */
    add(iterable: Iterable<T>): void;
    /**
     * Decrements the count of each passed key by 1.
     */
    subtract(iterable: Iterable<T>): void;
}


export class DefaultMap<K, V> extends Map<K, V> {
    constructor(public factory: (key: K) => V, iterable?: Iterable<[K, V]>) {
        super(iterable);
    }

    override get(key: K): V {
        if (!this.has(key)) {
            this.set(key, this.factory(key));
        }
        return super.get(key)!;
    }
}
