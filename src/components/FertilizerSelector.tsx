import { useCallback } from 'react';

import { fertilizerTypes, type FertilizerType } from './fertilizer';
import { type ValueInput } from './components';

export const FertilizerSelector: React.FC<
  ValueInput<FertilizerType | null>
> = ({
  value,
  onChange,
}) => {
  const callback = useCallback(
    e => { onChange(e.target.value || null); },
    [onChange],
  );
  return <select value={value ?? ''} onChange={callback}>
    <option value={''}>None</option>
    {Object.entries(fertilizerTypes).map(([key, f]) =>
      <option key={key} value={key}>{f.name}</option>
    )}
  </select>
};
