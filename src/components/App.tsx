import './App.scss';

import { useSessionState } from '../useSessionState';
import { useObjectSubstates } from './substate';

import { OptionsSelector } from './Options';
import { Table } from './Table';
import type { State } from './state';

function App() {
  const [state, setState] = useSessionState<State>('Stardew-Valley-Planner', {
    options: {
      farmingLevel: 0,
      tiller: false,
      agriculturalist: false,
    },
    plantings: [
      { id: 1, plantDate: 1, quantity: 20, cropId: 24, fertilizer: null, },
      { id: 2, plantDate: 6, quantity: 20, cropId: 192, fertilizer: null, },
      { id: 3, plantDate: 13, quantity: 20, cropId: 400, fertilizer: null, },
    ],
  });

  const substates = useObjectSubstates(setState);

  return (
    <div className="App">
      <div className='Header'>
        <h1>Stardew Valley Crop Planner</h1>
        <OptionsSelector value={state.options} onChange={substates.set('options')} />
        <a href="https://github.com/Thom1729/Stardew-Valley-Planner">GitHub</a>
      </div>
      <Table
        plantings={state.plantings}
        setPlantings={substates.set('plantings')}
        options={state.options}
      />
    </div>
  );
}

export default App;
