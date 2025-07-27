export interface ReadonlyCounter<T, out N extends number|bigint> extends ReadonlyMap<T, N> {
    get(key: T): N;
    elements(): Iterable<T>;
    readonly total: N;
    readonly pos: Counter<T, N>;
    readonly neg: Counter<T, N>;
}
export interface Counter<T, N extends number|bigint> extends ReadonlyCounter<T, N> {
    increment(key: T, value?: N): void;
    update(iterable?: Iterable<T> | Iterable<[T, N]>): void;
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
