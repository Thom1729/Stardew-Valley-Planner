import type { FC, HTMLAttributes } from 'react';
import classNames from 'classnames';

export const Cell: FC<{
  row?: string | number,
  column?: string | number,
  group?: boolean,
} & HTMLAttributes<HTMLDivElement>> = ({
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
