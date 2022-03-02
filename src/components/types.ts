import type { FertilizerType } from "./fertilizer";

export interface Planting {
  id: number,
  plantDate: number,
  quantity: number,
  cropId: number,
  fertilizer: FertilizerType | null,
}
