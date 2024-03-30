import { crops, Season } from '../data';
import { Select, type ValueInput } from './components';
import { cmp } from '../util';

const cropOptions = Object.values(Season).map(season => ({
  label: season[0].toUpperCase() + season.slice(1),
  key: season,
  children: Object.values(crops)
    // .filter(c => c.seasonsToGrowIn.includes(season))
    .filter(c => c.seasonsToGrowIn[0] === season)
    .sort((a,b) => cmp(a.name, b.name))
    .map(crop => ({
      key: crop.id.toString(),
      label: crop.name,
      value: crop.id,
    })),
}));

export const CropSelector: React.FC<
  ValueInput<number>
> = ({
  value,
  onChange,
}) => {
  return <Select
    options={cropOptions}
    value={value}
    onChange={onChange}
  />;
};
