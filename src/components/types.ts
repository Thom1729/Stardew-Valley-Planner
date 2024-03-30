import type { FertilizerType } from "../data";

export interface Planting {
  id: number,
  plantDate: number,
  quantity: number,
  cropId: number,
  fertilizer: FertilizerType | null,
}
