import './Table.scss';

import { useState } from 'react';

import { useCallback } from 'react';
import type { FC, HTMLAttributes } from 'react';
import classNames from 'classnames';

import { usePropertyCallbacks, Button, NumberInput, type ValueInput } from './components';
import { CropSelector } from './CropSelector';

import { Star } from './svg';
import { range, pairs } from '../util';

import type { Planting } from './types';

import { getEvents, type Event } from './calc';
import { Options } from './Options';
import { FertilizerSelector } from './FertilizerSelector';

type AggregateFunction = (event: Event) => number;

const aggregateFunctions = {
  Revenue: (event: Event) => Math.max(0, event.revenue),
  Expenses: (event: Event) => -Math.min(0, event.revenue),
  Profit: (event: Event) => event.revenue,
};

const plantingAggregates = {
  Profit: (event: Event) => event.revenue,
};

const aggregateEvents = (
  events: Event[],
  functions: Record<string, AggregateFunction>
): Record<string, number>[] => {
  let eventIndex = 0;
  return Array.from(range(1, 29)).map(day => {
    const ret = Object.fromEntries(
      Object.keys(functions).map((name: string) => [name, 0])
    );
    while (events[eventIndex]?.day === day) {
      for (const [name, f] of Object.entries(functions)) {
        ret[name] += f(events[eventIndex]);
      };
      eventIndex++;
    }
    return ret;
  });
};

export const Table: FC<{
  options: Options,
}> = ({
  options,
}) => {
  const [value, onChange] = useState<Planting[]>([
    { id: 1, plantDate: 1, quantity: 20, cropId: 24, fertilizer: null, },
    { id: 2, plantDate: 6, quantity: 20, cropId: 192, fertilizer: null, },
    { id: 3, plantDate: 13, quantity: 20, cropId: 400, fertilizer: null, },
  ]);

  const eventsByPlanting = Object.fromEntries(
    value.map((planting, i) => [i, getEvents(planting, options)])
  );

  const aggregatesByPlanting = Object.fromEntries(
    Object.entries(eventsByPlanting).map(([i, events]) => [i, aggregateEvents(events, plantingAggregates)])
  );

  const allEvents = Object.values(eventsByPlanting).flatMap(x => x);
  allEvents.sort((a,b) => a.day - b.day);

  const aggregates = aggregateEvents(allEvents, aggregateFunctions);

  const month = Array.from(range(1, 29));

  return <div
    className='Planting-Table'
    style={{
      '--planting-count': value.length,
      '--aggregate-count': Object.keys(aggregateFunctions).length,
      '--planting-aggregate-count': Object.keys(plantingAggregates).length,
    }}
  >
    <Cell group row='header' className='Planting-Table-Headers'>
      {month.map(day =>
        <Cell key={day} column={`day ${day} / span 2`}>{day}</Cell>
      )}
    </Cell>

    <Cell group row="planting / aggregate-header">
      {month.map(day =>
        <Cell group key={day} column={`day ${day} / span 2`}>
          <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="Planting-Table-Gridline">
            <rect stroke="currentColor" x1={0} y1={0} width={1} height={1} />
          </svg>
        </Cell>
      )}
    </Cell>

    <PlantingsControls value={value} onChange={onChange} />

    <Cell group>
      {value.map((planting, i) =>
        <Cell group
          key={`planting-${planting.id}`}
          row={`planting ${i+1}`}
        >
          {Array.from(pairs(eventsByPlanting[i])).map(([previous, event]) => {
            return <Cell
              key={previous.day}
              column={`day-center ${previous.day} / day-center ${event.day}`}
              className='Event-Line'
            />;
          })}

          {eventsByPlanting[i].map(event =>
            <Cell key={event.day} column={`day ${event.day} / day-end ${event.day}`} className='Event'>
              <svg viewBox='-15 -15 30 30'>
                <defs>
                  <clipPath id="clip">
                    <circle r={15} />
                  </clipPath>
                </defs>
                <circle r={15} clipPath="url(#clip)" />
                <Star points={5} r1={5} r2={11} fill="white" stroke="none" />
                <foreignObject x={0} y={15} height={0} width={'100%'}>
                  <div>Hello, World!</div>
                </foreignObject>
              </svg>
            </Cell>
          )}
        </Cell>
      )}
    </Cell>

    <Cell group className='Planting-Table-Aggregates'>
      {Object.keys(plantingAggregates).map((name, j) =>
        <Cell group key={name} column={`planting-aggregate ${j+1}`}>
          <Cell row='header' className='Cell-Heading'>{name}</Cell>
          {value.map((_, i) =>
            <Cell key={i} row={`planting ${i+1}`}>
              <G g={aggregatesByPlanting[i].map(x => x[name]).reduce((a,b) => a+b)} />
            </Cell>
          )}
        </Cell>
      )}
    </Cell>

    <Cell group row='aggregate-header' className='Planting-Table-Headers'>
      {month.map(day =>
        <Cell key={day} column={`day ${day} / day-end ${day}`}>{day}</Cell>
      )}
    </Cell>

    <Cell group className='Planting-Table-Aggregates'>
      {Object.keys(aggregateFunctions).map((name, i) =>
        <Cell group key={name} row={`aggregate ${i+1}`}>
          <Cell column='left-start / left-end' className='Cell-Heading'>{name}</Cell>
          {month.map(day =>
            <Cell key={day} column={`day ${day} / day-end ${day}`}>
              <G g={aggregates[day - 1][name]} />
            </Cell>
          )}
        </Cell>
      )}
    </Cell>
  </div>;
};

const PlantingsControls: React.FC<ValueInput<Planting[]>> = ({
  value,
  onChange,
}) => {
  const newPlanting = useCallback(
    () => {
      onChange([...value,
        { id: (1 + Math.max(0, ...value.map(p => p.id))), plantDate: 1, quantity: 1, cropId: 24, fertilizer: null, }
      ]);
    },
    [onChange, value],
  );

  const deletePlanting = useCallback(
    (id: number) => {
      onChange(value.filter(p => p.id !== id));
    },
    [onChange, value],
  );

  const modifyPlanting = useCallback(
    (planting: Planting) => {
      onChange(value.map(p => (p.id === planting.id) ? planting : p));
    },
    [onChange, value],
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

    {value.map((planting, i) =>
      <Cell group
        key={`planting-${planting.id}`}
        row={`planting ${i+1}`}
      >
        <PlantingControls
          planting={planting}
          plantingChanged={modifyPlanting}
          deletePlanting={deletePlanting}
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
  plantingChanged: (value: Planting) => void,
  deletePlanting: (i: number) => void,
}> = ({
  planting,
  plantingChanged,
  deletePlanting,
}) => {
  const callbacks = usePropertyCallbacks(planting, plantingChanged);
  return <>
    <Cell group column='planting-delete'>
      <Button onClick={() => { deletePlanting(planting.id); }}>Delete</Button>
    </Cell>
    <Cell group column='planting-quantity'>
      <NumberInput value={planting.quantity} onChange={callbacks.quantity} min={0} step={1} />
    </Cell>
    <Cell group column='planting-crop'>
      <CropSelector value={planting.cropId} onChange={callbacks.cropId} />
    </Cell>
    <Cell group column='planting-start'>
      <NumberInput value={planting.plantDate} onChange={callbacks.plantDate} min={1} max={28} step={1} />
    </Cell>
    <Cell group column='planting-fertilizer'>
      <FertilizerSelector value={planting.fertilizer} onChange={callbacks.fertilizer} />
    </Cell>
  </>;
};

const Cell: FC<{
  row?: string | number,
  column?: string | number,
  group?: boolean,
} & HTMLAttributes<HTMLDivElement>> = ({
  row = 'inherit',
  column = 'inherit',
  group = false,
  style,
  ...props
}) => {
  return <div
    className={classNames({
      'Cell-Group': group,
    })}
    style={{
      gridRow: row,
      gridColumn: column,
      display: group ? 'contents' : undefined,
      ...style,
    }}
    {...props}
  />;
};

const gFormat = new Intl.NumberFormat('en-us', {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const G: React.FC<{
  g: number,
}> = ({
  g,
}) => <span>{gFormat.format(g)}g</span>;
