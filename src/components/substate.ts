import { useMemo } from 'react';

export type StateUpdater<TState, TPrevState = TState> = (value: TState | ((prevState: TPrevState) => TState)) => void;

export function useObjectSubstates<TBase extends object>(
  setState: StateUpdater<TBase>,
) {
  return useMemo(() => new ObjectSubstateProvider(setState), [setState]);
}

export function useArraySubstates<TItem>(
  setState: StateUpdater<TItem[], readonly TItem[]>,
) {
  return useMemo(() => new ArraySubstateProvider(setState), [setState]);
}

//////////

export class ObjectSubstateProvider<TBase extends object> {
  private readonly setState: StateUpdater<TBase>;

  constructor(setState: StateUpdater<TBase>) {
    this.setState = setState;
  }

  set = cached(<TKey extends keyof TBase>(key: TKey): StateUpdater<TBase[TKey]> =>
    value => this.setState(prevState => ({
      ...prevState,
      [key]: applyStateUpdater(value, prevState[key]),
    }))
  );

  delete = cached((key: OptionalKeyOf<TBase>) =>
    () => this.setState(({
      [key]: _,
      ...rest
    }) => rest as TBase)
  );
}

export class ArraySubstateProvider<TItem> {
  private readonly setState: StateUpdater<TItem[], readonly TItem[]>;
  
  constructor(setState: StateUpdater<TItem[], readonly TItem[]>) {
    this.setState = setState;
  }

  set = cached((index: number): StateUpdater<TItem> =>
    value => this.setState(prevState => [
      ...prevState.slice(0, index),
      applyStateUpdater(value, prevState[index]),
      ...prevState.slice(index + 1),
    ])
  );

  delete = cached((index: number) =>
    () => this.setState(prevState => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ])
  );

  moveTo = cached((index: number) =>
    (newIndex: number) => this.setState(prevState => {
      const rest = [
        ...prevState.slice(0, index),
        ...prevState.slice(index + 1),
      ];
      return [
        ...rest.slice(0, newIndex),
        prevState[index],
        ...rest.slice(newIndex),
      ];
    })
  );

  moveBy = cached((index: number) => {
    const moveTo = this.moveTo(index);
    return (diff: number) => moveTo(index + diff);
  });

  append: StateUpdater<TItem, readonly TItem[]> =
    value => this.setState(prevState => [
      ...prevState,
      applyStateUpdater(value, prevState),
    ]);

  prepend: StateUpdater<TItem, readonly TItem[]> =
    value => this.setState(prevState => [
      applyStateUpdater(value, prevState),
      ...prevState,
    ]);
}

export type OptionalKeyOf<T extends object> = keyof {
  [K in keyof T as T extends Record<K, T[K]> ? never : K]: K
}

function applyStateUpdater<TState, TPrevState>(
  value: TState | ((prevState: TPrevState) => void),
  prevState: TPrevState,
) {
  if (typeof value === 'function') {
    return (value as (prevState: TPrevState) => TState)(prevState);
  } else {
    return value;
  }
}

function cached<T extends (key: never) => unknown>(
  originalMethod: T,
  _context?: unknown,
): T {
  type TKey = Parameters<T>[0];
  type TValue = ReturnType<T>;

  const cache = new Map<TKey, TValue>();
  return function (this: any, key: TKey): TValue {
    if (cache.has(key)) {
      return cache.get(key)!;
    } else {
      const result = originalMethod.call(this, key) as TValue;
      cache.set(key, result);
      return result;
    }
  } as T;
}
