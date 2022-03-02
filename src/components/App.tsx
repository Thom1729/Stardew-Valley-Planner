import './App.scss';

import { useState } from 'react';

import { OptionsSelector, type Options } from './Options';
import { Table } from './Table';

function App() {
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
        options={options}
      />
    </div>
  );
}

export default App;
