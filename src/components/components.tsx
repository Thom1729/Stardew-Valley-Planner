import './components.scss';

import { useCallback, useMemo } from 'react';
import type { FC, HTMLAttributes } from 'react';

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

export const Button: FC<HTMLAttributes<HTMLButtonElement>> = ({
    type = 'button',
    ...props
}) => {
    return <button type={type} {...props} />
};

export interface ValueInput<ValueType> {
    value: ValueType,
    onChange: (value: ValueType) => void,
}

export const NumberInput: FC<
    Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> &
    ValueInput<number>
> = ({
    value,
    onChange,
    ...rest
}) => {
    const changeCallback = useCallback(
        (e) => onChange(e.target.valueAsNumber),
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

export const Checkbox: FC<
    Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> &
    ValueInput<boolean>
> = ({
    value,
    onChange,
    ...rest
}) => {
    return <input
        className='Checkbox'
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
    />
};
