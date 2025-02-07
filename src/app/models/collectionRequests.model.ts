import { Waste } from './waste.model';
import {CollectionStatus} from './CollectionStatus';

export interface CollectionRequest {
  id: string;
  userId: number;
  collectorId: number | null;
  waste: Waste[];
  address: string;
  date: string;
  timeSlot: string;
  status: CollectionStatus;
}
