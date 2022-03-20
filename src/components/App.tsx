import './App.scss';

import { useSessionState } from '../useSessionState';

import { OptionsSelector, type Options } from './Options';
import { Table } from './Table';

function App() {
  const [options, setOptions] = useSessionState<Options>('options', {
    farmingLevel: 0,
    tiller: false,
    agriculturalist: false,
  });

  return (
    <div className="App">
      <div className='Header'>
        <h1>Stardew Valley Crop Planner</h1>
        <OptionsSelector value={options} onChange={setOptions} />
        <a href="https://github.com/Thom1729/Stardew-Valley-Planner">GitHub</a>
      </div>
      <Table
        options={options}
      />
    </div>
  );
}

export default App;
