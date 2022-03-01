import type { FertilizerType } from "./fertilizer";

export interface Planting {
  plantDate: number,
  quantity: number,
  cropId: number,
  fertilizer: FertilizerType | null,
}
