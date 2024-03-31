import type { FertilizerType } from "../data";

export interface Options {
  farmingLevel: number;
  tiller: boolean;
  agriculturalist: boolean;
}

export interface Planting {
  id: number,
  plantDate: number,
  quantity: number,
  cropId: number,
  fertilizer: FertilizerType | null,
}

export interface State {
  options: Options;
  plantings: readonly Planting[];
}
