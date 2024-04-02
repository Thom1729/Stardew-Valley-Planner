import classNames from 'classnames';

import type { FC } from 'react';
import type { ExtendBuiltin } from './components';

export const Cell: FC<
  ExtendBuiltin<'div', {
    row?: string | number,
    column?: string | number,
    group?: boolean,
  }>
> = ({
  row = 'inherit',
  column = 'inherit',
  group = false,
  style,
  ...props
}) => {
  return <div
    className={classNames({
      'Cell-Group': group,
    })}
    style={{
      gridRow: row,
      gridColumn: column,
      display: group ? 'contents' : undefined,
      ...style,
    }}
    {...props}
  />;
};

const goldFormat = new Intl.NumberFormat('en-us', {
  useGrouping: true,
  maximumFractionDigits: 0,
});

export function formatGold(n: number) {
  return goldFormat.format(n) + 'g';
}

export const percentFormat = new Intl.NumberFormat('en-us', {
  style: 'percent',
});

export const G: React.FC<{
  g: number,
}> = ({
  g,
}) => <span>{goldFormat.format(g)}g</span>;
