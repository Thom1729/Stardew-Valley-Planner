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
