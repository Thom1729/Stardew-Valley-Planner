import './Options.scss';

import { type FC } from 'react';
import { usePropertyCallbacks, NumberInput, Checkbox, type ValueInput  } from './components';

export interface Options {
  farmingLevel: number,
  tiller: boolean,
  agriculturalist: boolean,
}

export const OptionsSelector: FC<ValueInput<Options>> = ({
  value,
  onChange,
}) => {
  const callbacks = usePropertyCallbacks(value, onChange);
  return <>
    <label>
      Farming Level
      <NumberInput
        value={value.farmingLevel}
        onChange={callbacks.farmingLevel}
        min={0}
      />
    </label>
    <label>
      Tiller
      <Checkbox
        value={value.tiller}
        onChange={callbacks.tiller}
      />
    </label>
    <label>
      Agriculturalist
      <Checkbox
        value={value.agriculturalist}
        onChange={callbacks.agriculturalist}
      />
    </label>
  </>
};
