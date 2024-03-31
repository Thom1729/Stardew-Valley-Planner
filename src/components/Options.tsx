import './Options.scss';

import { type FC } from 'react';
import { NumberInput, Checkbox  } from './components';
import { useObjectSubstates, type StateUpdater } from './substate';

export interface Options {
  farmingLevel: number,
  tiller: boolean,
  agriculturalist: boolean,
}

export const OptionsSelector: FC<{
  value: Options,
  onChange: StateUpdater<Options>,
}> = ({
  value,
  onChange,
}) => {
  const substates = useObjectSubstates(onChange);
  return <>
    <label>
      Farming Level
      <NumberInput
        value={value.farmingLevel}
        onChange={substates.set('farmingLevel')}
        min={0}
      />
    </label>
    <label>
      Tiller
      <Checkbox
        value={value.tiller}
        onChange={substates.set('tiller')}
      />
    </label>
    <label>
      Agriculturalist
      <Checkbox
        value={value.agriculturalist}
        onChange={substates.set('agriculturalist')}
      />
    </label>
  </>
};
