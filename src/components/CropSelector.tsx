import { useCallback } from 'react';

import { crops, Season } from '../data';
import { type ValueInput } from './components';
import { cmp } from '../util';

const cropsBySeason = Object.values(Season).map(season => ({
  season,
  crops: Object.values(crops)
    .filter(c => c.seasonsToGrowIn.includes(season))
    .sort((a,b) => cmp(a.name, b.name)),
}));

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
    {cropsBySeason.map(({ season, crops }) =>
      <optgroup key={season} label={season[0].toUpperCase() + season.slice(1)}>
        {crops.map(crop =>
          <option key={crop.id} value={crop.id}>{crop.name}</option>
        )}
      </optgroup>
    )}
  </select>
};
