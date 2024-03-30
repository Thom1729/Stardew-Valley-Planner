import type { Planting } from './types';
import { type Options } from "./Options";

import { Crop, crops, type Harvest } from '../data';
import { fertilizerTypes } from '../data';
import { range } from '../util';

export interface Event {
  planting: Planting,
  day: number,
  type: 'planting' | 'harvest',
  revenue: number,
}

const cropQualityMultiplier = (farmingLevel: number, fertilizerLevel: number) => {
  const goldProbability = Math.min(1,
    0.2 * (farmingLevel / 10)
    + (0.2 * fertilizerLevel * ((farmingLevel + 2) / 12))
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

const tillerCategories = new Set([
  'Basic -75',
  'Basic -79',
  'Basic -80',
]); // Vegetables and flowers
function getsTillerBonus(crop: Crop): boolean {
  return tillerCategories.has(crop.category);
}

function getGrowthPhases(crop: Crop, speedup: number): number[] {
  const { phaseDays } = crop;
  const baseDays = phaseDays.reduce((a,b) => a+b)
  const daysReduced = Math.ceil(baseDays * speedup);

  const firstRemovableDay = (phaseDays[0] > 1 ? 0 : 1);

  const ret = phaseDays.slice();
  for (const i of Array.from(range(firstRemovableDay, Math.min(firstRemovableDay + daysReduced, phaseDays.length)))) {
    ret[i] -= 1;
  }
  return ret;
}

function* _getEvents(planting: Planting, options: Options): Iterable<Event> {
  const crop = crops[planting.cropId];
  const fertilizer = planting.fertilizer ? fertilizerTypes[planting.fertilizer] : null;

  const regrowth = crop.regrowAfterHarvest === -1 ? Infinity : crop.regrowAfterHarvest;
  const harvestQuantity = averageQuantity(crop);

  const tillerMultiplier = (options.tiller && getsTillerBonus(crop)) ? 1.1 : 1;
  const qualityMultiplier = cropQualityMultiplier(options.farmingLevel, fertilizer?.quality ?? 0);

  const growthTime = getGrowthPhases(crop, (options.agriculturalist ? .1 : 0) + (fertilizer?.speed ?? 0)).reduce((a,b) => a+b);

  // Only the first item per harvest gets the quality bonus
  const baseRevenuePerCrop = (crop.sellPrice * qualityMultiplier) + (harvestQuantity - 1) * crop.sellPrice;
  const revenue = baseRevenuePerCrop * tillerMultiplier * planting.quantity;

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
