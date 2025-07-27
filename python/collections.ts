import { sum } from "../python";

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

abstract class BaseCounter<T, N extends number|bigint> extends Map<T, N> {
    *elements(): Iterable<T> {
        for (const [key, count] of this) {
            for (let i = 0; i < count; i++) {
                yield key;
            }
        }
    }

    update(iterable: Iterable<[T, N]>): void {
        for (const [item, count] of iterable) {
            this.set(item, count);
        }
    }

    abstract increment(key: T, value?: N): void;

    updateBy(iterable: Iterable<[T, N]>): void {
        for (const [item, count] of iterable) {
            this.increment(item, count);
        }
    }
}

export class NumberCounter<T> extends BaseCounter<T, number> implements Counter<T, number> {
    // only to render the constructor private
    private constructor(iterable: Iterable<[T, number]> = []) {
        super(iterable);
    }

    static fromKeys<T>(keys: Iterable<T>, value = 1): NumberCounter<T> {
        return new NumberCounter<T>(Array.from(keys, key => [key, value] as [T, number]));
    }

    static fromEntries<T>(entries: Iterable<[T, number]>): NumberCounter<T> {
        return new NumberCounter<T>(entries);
    }

    override get(key: T): number {
        return super.get(key) || 0;
    }

    get total(): number {
        return sum(this.values());
    }

    get pos(): NumberCounter<T> {
        const copy = new NumberCounter<T>();
        for (const [key, value] of this) {
            if (value > 0) {
                copy.set(key, value);
            }
        }
        return copy;
    }

    get neg(): NumberCounter<T> {
        const copy = new NumberCounter<T>();
        for (const [key, value] of this) {
            if (value < 0) {
                copy.set(key, -value);
            }
        }
        return copy;
    }

    increment(key: T, value = 1): void {
        this.set(key, this.get(key) + value);
    }

    add(iterable: Iterable<T>): void {
        for (const item of iterable) {
            this.increment(item, 1);
        }
    }

    subtract(iterable: Iterable<T>): void {
        for (const item of iterable) {
            this.increment(item, -1);
        }
    }
}

export class BigIntCounter<T> extends BaseCounter<T, bigint> implements Counter<T, bigint> {
    // only to render the constructor private
    private constructor(iterable: Iterable<[T, bigint]> = []) {
        super(iterable);
    }

    static fromKeys<T>(keys: Iterable<T>, value = 1n): BigIntCounter<T> {
        return new BigIntCounter<T>(Array.from(keys, key => [key, value] as [T, bigint]));
    }

    static fromEntries<T>(entries: Iterable<[T, bigint]>): BigIntCounter<T> {
        return new BigIntCounter<T>(entries);
    }

    override get(key: T): bigint {
        return super.get(key) || 0n;
    }

    get total(): bigint {
        return sum(this.values(), 0n);
    }

    get pos(): BigIntCounter<T> {
        const copy = new BigIntCounter<T>();
        for (const [key, value] of this) {
            if (value > 0n) {
                copy.set(key, value);
            }
        }
        return copy;
    }

    get neg(): BigIntCounter<T> {
        const copy = new BigIntCounter<T>();
        for (const [key, value] of this) {
            if (value < 0n) {
                copy.set(key, -value);
            }
        }
        return copy;
    }

    increment(key: T, value = 1n): void {
        this.set(key, this.get(key) + value);
    }

    add(iterable: Iterable<T>): void {
        for (const item of iterable) {
            this.increment(item, 1n);
        }
    }

    subtract(iterable: Iterable<T>): void {
        for (const item of iterable) {
            this.increment(item, -1n);
        }
    }
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
