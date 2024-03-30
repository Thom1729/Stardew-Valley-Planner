import './components.scss';

import { ChangeEvent, useMemo } from 'react';
import type { FC } from 'react';

type ExtendBuiltin<
  TElementName extends keyof JSX.IntrinsicElements,
  TAdditional extends object = {},
  TOmit extends string = never,
> = TAdditional & Omit<JSX.IntrinsicElements[TElementName], keyof TAdditional | TOmit>;

function useWrappedHandler<TEvent, TReturn>(
  callback: undefined | ((value: TReturn) => void),
  convert: (event: TEvent) => TReturn,
  dependencies: readonly unknown[],
) {
  return useMemo(
    () => callback && ((event: TEvent) => {
      callback(convert(event));
    }),
    [dependencies], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

//////////

export const usePropertyCallbacks = <ValueType extends object>(
  value: ValueType,
  onChange: (value: ValueType) => void,
): {
  [k in keyof ValueType]: (value: ValueType[k]) => void
} => {
  return useMemo<{[k in keyof ValueType]: (value: ValueType[k]) => void}>(
    () => {
      return Object.fromEntries(
        (Object.keys(value) as (keyof ValueType)[]).map(
          p => [p, (v: ValueType[typeof p]) => onChange({ ...value, [p]: v })]
        )
      ) as any;
    },
    [value, onChange],
  );
};

export const Button: FC<ExtendBuiltin<'button'>> = ({
  type = 'button',
  ...rest
}) => {
  return <button type={type} {...rest} />
};

export interface ValueInput<ValueType> {
  value: ValueType,
  onChange: ((value: ValueType) => void),
}

export const NumberInput: FC<ExtendBuiltin<'input', {
  value: number,
  onChange: ((value: number) => void) | undefined,
}>> = ({
  value,
  onChange,
  ...rest
}) => {
  const changeCallback = useWrappedHandler<ChangeEvent<HTMLInputElement>, number>(
    onChange,
    event => event.currentTarget.valueAsNumber,
    [onChange],
  );

  return <input
    className="NumberInput"
    type="number"
    value={value}
    onChange={changeCallback}
    {...rest}
  />;
};

export const Checkbox: FC<ExtendBuiltin<'input', {
  value: boolean,
  onChange: ((value: boolean) => void) | undefined,
}, 'checked'>> = ({
  value,
  onChange,
  ...rest
}) => {
  const changeCallback = useWrappedHandler<ChangeEvent<HTMLInputElement>, boolean>(
    onChange,
    event => event.currentTarget.checked,
    [onChange],
  );

  return <input
    className='Checkbox'
    type="checkbox"
    checked={value}
    onChange={changeCallback}
    {...rest}
  />
};

//////////

type SelectOptionLeaf<TValue> = {
  label: string,
  key: string,
  value: TValue,
  children?: undefined,
};

export type SelectOption<TValue> =
| SelectOptionLeaf<TValue>
| {
  label: string,
  key: string,
  value?: undefined,
  children: readonly SelectOption<TValue>[],
};

function *iterateOptions<TValue>(
  options: readonly SelectOption<TValue>[],
): Iterable<SelectOptionLeaf<TValue>> {
  for (const option of options) {
    if (option.children !== undefined) {
      yield* iterateOptions(option.children);
    } else {
      yield option;
    }
  }
}

export function Select<TValue>({
  options,
  value,
  onChange,
  ...rest
}: ExtendBuiltin<
  'select',
  {
    options: readonly SelectOption<TValue>[],
    value: TValue,
    onChange?: ((value: TValue) => void) | undefined,
  },
  'children'
>) {
  const keyToValue = useMemo(() => {
    return new Map(
      Array.from(iterateOptions(options)).map(({ key, value }) => [key, value])
    );
  }, [options]);

  const valueToKey = useMemo(() => {
    return new Map(
      Array.from(iterateOptions(options)).map(({ key, value }) => [value, key])
    );
  }, [options]);

  const onChangeCallback = useWrappedHandler<ChangeEvent<HTMLSelectElement>, TValue>(
    onChange,
    event => {
      const result = keyToValue.get(event.currentTarget.value);
      if (result === undefined) throw new TypeError(typeof event.currentTarget.value);
      return result;
    },
    [onChange, keyToValue],
  );

  const selectedKey = valueToKey.get(value);
  if (selectedKey === undefined) throw new TypeError();

  return <select
    onChange={onChangeCallback}
    value={selectedKey}
    {...rest}
  >
    <SelectOptions options={options} />
  </select>;
};

function SelectOptions<TValue>({
  options,
}: {
  options: readonly SelectOption<TValue>[],
}) {
  return <>
    {options.map(option => {
      if (option.children !== undefined) {
        return <optgroup
          key={option.key}
          label={option.label}
        >
          <SelectOptions options={option.children}/>
        </optgroup>
      } else {
        return <option
          key={option.key}
          value={option.key}
        >
          {option.label}
        </option>;
      }
    })}
  </>;
}
