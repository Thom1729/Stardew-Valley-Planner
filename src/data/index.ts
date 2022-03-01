import CROP_DATA from './parsed-crop-data.json';

export enum Season {
  spring = "spring",
  summer = "summer",
  fall = "fall",
  winter = "winter",
}

export interface Crop {
  name: string,
  description: string,
  id: number,
  category: string,
  sellPrice: number,
  edibility: number,
  rowInSpriteSheet: number,
  seasonsToGrowIn: Season[],
  phaseDays: number[],
  regrowAfterHarvest: number,
  scythe: boolean,
  trellis: boolean,
  canBeGiant: boolean,
  harvest: Harvest | Record<never, never>,
  seed: Seed,
  flowerColors: Color[],
}

export interface Harvest {
  minHarvest: number,
  maxHarvest: number,
  maxHarvestIncreasePerFarmingLevel: number,
  chanceForExtraCrops: number,
}

export interface Seed {
  name: string,
  description: string,
  id: number,
  category: string,
  sellPrice: number,
  edibility: number,
  vendor: {
    generalStore?: {
      price: number,
      yearAvailable: number,
    },
    jojaMart?: {
      price: number,
    },
    travelingCart?: {
      minPrice: number,
      maxPrice: number,
    },
    eggFestival?: {
      price: number,
    },
    oasis?: {
      price: number,
    },
  },
}

interface Color {
  red: number,
  green: number,
  blue: number,
}

export const crops = CROP_DATA as Record<string, Crop>;
