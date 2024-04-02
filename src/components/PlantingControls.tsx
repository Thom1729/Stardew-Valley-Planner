import { useCallback } from 'react';
import type { FC } from 'react';

import { Button, NumberInput } from './components';
import { StateUpdater, useArraySubstates, useObjectSubstates } from './substate';
import { CropSelector } from './CropSelector';
import { Cell } from './DisplayHelpers';
import { FertilizerSelector } from './FertilizerSelector';

import type { Planting } from './state';

export const PlantingsControls: FC<{
  value: readonly Planting[],
  onChange: StateUpdater<readonly Planting[]>,
}> = ({
  value,
  onChange,
}) => {
  const substates = useArraySubstates(onChange);

  const newPlanting = useCallback(
    () => substates.append(plantings => ({
      id: 1 + Math.max(0, ...plantings.map(p => p.id)),
      plantDate: 1,
      quantity: 1,
      cropId: 24,
      fertilizer: null,
    })),
    [substates],
  );

  return <Cell group>
    <Cell group
      className='Planting-Table-Headers'
      row='header'
    >
      <Cell column='planting-quantity'>Qty</Cell>
      <Cell column='planting-crop'>Crop</Cell>
      <Cell column='planting-start'>Date</Cell>
      <Cell column='planting-fertilizer'>Fertilizer</Cell>
    </Cell>

    {value.map((planting, index) =>
      <Cell group
        key={`planting-${planting.id}`}
        row={`planting ${index+1}`}
      >
        <PlantingControls
          planting={planting}
          plantingChanged={substates.set(index)}
          deletePlanting={value.length > 1 ? substates.delete(index) : undefined}
          move={substates.moveBy(index)}
        />
      </Cell>
    )}

    <Cell group row='planting-new' column='left-start / left-end'>
      <Button style={{ justifySelf: 'end' }} onClick={newPlanting}>New</Button>
    </Cell>
  </Cell>;
};

const PlantingControls: React.FC<{
  planting: Planting,
  plantingChanged: StateUpdater<Planting>,
  deletePlanting: (() => void) | undefined,
  move: (diff: number) => void,
}> = ({
  planting,
  plantingChanged,
  deletePlanting,
  move,
}) => {
  const substates = useObjectSubstates(plantingChanged);
  return <>
    <Cell group column='planting-delete'>
      <Button onClick={deletePlanting} disabled={deletePlanting === undefined}>Delete</Button>
    </Cell>
    <Cell group column='planting-quantity'>
      <NumberInput value={planting.quantity} onChange={substates.set('quantity')} min={0} step={1} />
    </Cell>
    <Cell group column='planting-crop'>
      <CropSelector value={planting.cropId} onChange={substates.set('cropId')} />
    </Cell>
    <Cell group column='planting-start'>
      <NumberInput value={planting.plantDate} onChange={substates.set('plantDate')} min={1} max={28} step={1} />
    </Cell>
    <Cell group column='planting-fertilizer'>
      <FertilizerSelector value={planting.fertilizer} onChange={substates.set('fertilizer')} />
    </Cell>
    <Cell column="planting-move">
      {/*<Button onClick={() => { move(-1); }}>↑</Button>*/}
      <Button onClick={() => { move(1); }}>↓</Button>
    </Cell>
  </>;
};
