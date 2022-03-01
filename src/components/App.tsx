import './App.scss';

import { useState } from 'react';

import type { Planting } from './types';
import { OptionsSelector, type Options } from './Options';
import { Table } from './Table';

function App() {
  const [plantings, setPlantings] = useState<Planting[]>([
    { plantDate: 1, quantity: 20, cropId: 24, fertilizer: null, },
    { plantDate: 6, quantity: 20, cropId: 192, fertilizer: null, },
    { plantDate: 13, quantity: 20, cropId: 400, fertilizer: null, },
  ]);

  const [options, setOptions] = useState<Options>({
    farmingLevel: 0,
    tiller: false,
    agriculturalist: false,
  });

  return (
    <div className="App">
      <div className='Header'>
        <h1>Stardew Valley Crop Planner</h1>
        <OptionsSelector value={options} onChange={setOptions} />
      </div>
      <Table
        value={plantings}
        onChange={setPlantings}
        options={options}
      />
    </div>
  );
}

export default App;
