export function* range(min: number, max: number) {
    for (let i = min; i < max; i++) {
        yield i;
    }
}

export function* pairs<T>(itr: Iterable<T>): Iterable<[T, T]> {
    let first = true;
    let previous: T;
    for (const item of itr) {
        if (first) {
            first = false;
        } else {
            yield [previous!, item];
        }
        previous = item;
    }
}
