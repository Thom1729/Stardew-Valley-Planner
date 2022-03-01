import { useCallback } from 'react';

import { crops } from '../data';
import { type ValueInput } from './components';

export const CropSelector: React.FC<
  ValueInput<number>
> = ({
  value,
  onChange,
}) => {
  const callback = useCallback(
    e => { onChange(Number(e.target.value)); },
    [onChange],
  );
  return <select value={value} onChange={callback}>
    {Object.values(crops).map(crop =>
      <option key={crop.id} value={crop.id}>{crop.name}</option>
    )}
  </select>
};
