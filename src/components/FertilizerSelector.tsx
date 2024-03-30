import { fertilizerTypes, type FertilizerType } from '../data';
import { Select, type ValueInput } from './components';

const fertilizerOptions = [
  {
    key: '',
    label: 'None',
    value: null,
  },
  ...Object.entries(fertilizerTypes)
    .map(([type, fertilizer]) => ({
      key: type,
      label: fertilizer.name,
      value: type as FertilizerType,
    }))
];

export const FertilizerSelector: React.FC<
  ValueInput<FertilizerType | null>
> = ({
  value,
  onChange,
}) => {
  return <Select
    options={fertilizerOptions}
    value={value}
    onChange={onChange}
  />;
};
