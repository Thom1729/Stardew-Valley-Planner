import './Table.scss';

import type { FC } from 'react';

import { StateUpdater, } from './substate';

import { Star } from './svg';
import { range } from '../util';

import type { Planting, Options } from './state';

import { getEvents, type Event } from './calc';
import { Cell, formatGold } from './DisplayHelpers';
import { PlantingsControls } from './PlantingControls';
import { percentFormat, G } from './DisplayHelpers';

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
  return DAYS_OF_MONTH.map(day => {
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

const DAYS_OF_MONTH = Array.from(range(1, 29));

export const Table: FC<{
  plantings: readonly Planting[],
  setPlantings: StateUpdater<readonly Planting[]>,
  options: Options,
}> = ({
  plantings,
  setPlantings,
  options,
}) => {
  const eventsByPlanting = Object.fromEntries(
    plantings.map(planting => [planting.id, getEvents(planting, options)])
  );

  const aggregatesByPlanting = Object.fromEntries(
    Object.entries(eventsByPlanting).map(([id, events]) => [id, aggregateEvents(events, plantingAggregates)])
  );

  const allEvents = Object.values(eventsByPlanting).flatMap(x => x);
  allEvents.sort((a,b) => a.day - b.day);

  const aggregates = aggregateEvents(allEvents, aggregateFunctions);

  return <div
    className='Planting-Table'
    style={{
      '--planting-count': plantings.length,
      '--aggregate-count': Object.keys(aggregateFunctions).length,
      '--planting-aggregate-count': Object.keys(plantingAggregates).length,
    }}
  >
    <Cell group row='header' className='Planting-Table-Headers'>
      {DAYS_OF_MONTH.map(day =>
        <Cell key={day} column={`day ${day} / span 2`}>{day}</Cell>
      )}
    </Cell>

    <Cell group row="planting / aggregate-header">
      {DAYS_OF_MONTH.map(day =>
        <Cell group key={day} column={`day ${day} / span 2`}>
          <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="Planting-Table-Gridline">
            <rect stroke="currentColor" x1={0} y1={0} width={1} height={1} />
          </svg>
        </Cell>
      )}
    </Cell>

    <PlantingsControls value={plantings} onChange={setPlantings} />

    <>
      {plantings.map((planting, i) => {
        const plantingEvents = eventsByPlanting[planting.id];
        const circleRadius = 15;

        return <Cell group
          key={`planting-${planting.id}`}
          row={`planting ${i+1}`}
        >
          <Cell
            key={plantingEvents[0].day}
            column={`day-center ${plantingEvents[0].day} / day-center ${plantingEvents[plantingEvents.length - 1].day}`}
            className='Event-Line'
          />

          {plantingEvents.map(event =>
            <Cell key={event.day} column={`day ${event.day} / day-end ${event.day}`} className='Event'>
              <svg viewBox={`-${circleRadius} -${circleRadius} ${2*circleRadius} ${2*circleRadius}`}>
                <defs>
                  <clipPath id="clip">
                    <circle r={circleRadius} />
                  </clipPath>
                </defs>
                <circle r={circleRadius} clipPath="url(#clip)" />
                <Star points={5} r1={5} r2={11} fill="white" stroke="none" />
                <foreignObject x={0} y={circleRadius} height={0} width={'100%'}>
                  <EventTooltip
                    event={event}
                    aggregates={aggregatesByPlanting[planting.id][event.day - 1]}
                  />
                </foreignObject>
              </svg>
            </Cell>
          )}
        </Cell>;
      })}
    </>

    <Cell group className='Planting-Table-Aggregates'>
      {Object.keys(plantingAggregates).map((name, j) =>
        <Cell group key={name} column={`planting-aggregate ${j+1}`}>
          <Cell row='header' className='Cell-Heading'>{name}</Cell>
          {plantings.map((planting, i) =>
            <Cell key={i} row={`planting ${i+1}`}>
              <G g={aggregatesByPlanting[planting.id].map(x => x[name]).reduce((a,b) => a+b)} />
            </Cell>
          )}
        </Cell>
      )}
    </Cell>

    <Cell group row='aggregate-header' className='Planting-Table-Headers'>
      {DAYS_OF_MONTH.map(day =>
        <Cell key={day} column={`day ${day} / day-end ${day}`}>{day}</Cell>
      )}
    </Cell>

    <Cell group className='Planting-Table-Aggregates'>
      {Object.keys(aggregateFunctions).map((name, i) =>
        <Cell group key={name} row={`aggregate ${i+1}`}>
          <Cell column='left-start / left-end' className='Cell-Heading'>{name}</Cell>
          {DAYS_OF_MONTH.map(day =>
            <Cell key={day} column={`day ${day} / day-end ${day}`}>
              <G g={aggregates[day - 1][name]} />
            </Cell>
          )}
        </Cell>
      )}
    </Cell>
  </div>;
};

const QUALITIES = [
  ['Iridium', 3],
  ['Gold', 2],
  ['Silver', 1],
  ['Regular', 0],
] as const;

const EventTooltip: FC<{
  event: Event,
  aggregates: Record<string, number>,
}> = ({
  event,
  aggregates,
}) => {
  const stuff = [
    ...Object.entries(aggregates)
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => [key, formatGold(value)] as const),

    ...QUALITIES
      .map(([key, index]) => [key, event.qualityDistribution?.[index] ?? 0] as const)
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => [key, percentFormat.format(value)] as const)
  ];

  return <div>
    <div>Day {event.day}</div>
    <table>
      <tbody>
        {stuff.map(([key, value]) =>
          <tr key={key}>
            <th>{key}</th>
            <td>{value}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
};
