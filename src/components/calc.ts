import type { Planting } from './types';
import { type Options } from "./Options";

import { Crop, crops, type Harvest } from '../data';
import { fertilizerTypes } from './fertilizer';

export interface Event {
  planting: Planting,
  day: number,
  type: 'planting' | 'harvest',
  revenue: number,
}

const cropQualityMultiplier = (farmingLevel: number, fertilizerLevel: number) => {
  const goldProbability = Math.min(1,
    0.2 * (farmingLevel / 10)
    + 0.2 * fertilizerLevel
    + ((farmingLevel + 2) / 12)
    + 0.01
  );
  const silverProbability = (fertilizerLevel === 3 ? 1 : Math.min(.75, 2 * goldProbability));
  const iridiumProbability = (fertilizerLevel === 3 ? goldProbability / 2 : 0);

  const x = [
    [2, iridiumProbability],
    [1.5, goldProbability],
    [1.25, silverProbability],
    [1, 1],
  ] as const;

  let remainder = 1;
  let multiplier = 0;
  for (const [m, p] of x) {
    const fraction = remainder * p;
    multiplier += fraction * m;
    remainder -= fraction;
  }

  return multiplier;
};

function cropPurchasePrice(crop: Crop): number {
  const vendor = crop.seed.vendor;

  return (
    vendor.generalStore?.price ??
    vendor.oasis?.price ??
    vendor.eggFestival?.price ??
    vendor.travelingCart?.minPrice ??
    // null
    0
  );
}

function averageQuantity(crop: Crop): number {
  if ((crop.harvest as any).minHarvest) {
    const { minHarvest, chanceForExtraCrops } = crop.harvest as Harvest;

    return minHarvest - (chanceForExtraCrops / (chanceForExtraCrops - 1));
  } else {
    return 1;
  }
}

function* _getEvents(planting: Planting, options: Options): Iterable<Event> {
  const crop = crops[planting.cropId];
  const fertilizer = planting.fertilizer ? fertilizerTypes[planting.fertilizer] : null;

  const regrowth = crop.regrowAfterHarvest === -1 ? Infinity : crop.regrowAfterHarvest;
  const harvestQuantity = averageQuantity(crop);

  const tillerMultiplier = options.tiller ? 1.1 : 1;
  const qualityMultiplier = cropQualityMultiplier(options.farmingLevel, fertilizer?.quality ?? 0);

  const totalGrowthTime = crop.phaseDays.reduce((a,b) => a+b);
  const growthMultiplier = (options.agriculturalist ? 1.1 : 1) + (fertilizer?.speed ?? 0);
  const growthTime = Math.round(totalGrowthTime / growthMultiplier);

  const revenue = planting.quantity * harvestQuantity * crop.sellPrice * tillerMultiplier * qualityMultiplier;

  const purchasePrice = cropPurchasePrice(crop);

  let day = planting.plantDate;

  yield {
    planting,
    day,
    type: 'planting',
    revenue: -planting.quantity * purchasePrice,
  };

  day += growthTime;

  while (day < 29) {
    yield {
      planting,
      day,
      type: 'harvest',
      revenue,
    };
    day += regrowth;
  }
}

export const getEvents = (planting: Planting, options: Options) => Array.from(_getEvents(planting, options));
