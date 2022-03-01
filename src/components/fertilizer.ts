export interface Fertilizer {
  name: string,
  cost: number,
  quality?: number,
  speed?: number,
};

const _fertilizerTypes = {
  basicFertilizer: {
    name: 'Basic Fertilizer',
    cost: 100,
    quality: 1,
  },
  qualityFertilizer: {
    name: 'Quality Fertilizer',
    cost: 150,
    quality: 2,
  },
  deluxeFertilizer: {
    cost: 0,
    name: 'Deluxe Fertilizer',
    quality: 3,
  },
  speedGro: {
    name: 'Speed-Gro',
    cost: 100,
    speed: 0.1,
  },
  deluxeSpeedGro: {
    name: 'Deluxe Speed-Gro',
    cost: 150,
    speed: 0.25,
  },
  hyperSpeedGro: {
    name: 'Hyper Speed-Gro',
    cost: 0,
    speed: 1/3,
  },
} as const;

export type FertilizerType = keyof typeof _fertilizerTypes;

export const fertilizerTypes: Record<FertilizerType, Fertilizer> = _fertilizerTypes;
