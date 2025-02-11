import {WasteType} from './WasteType';

export interface Waste {
  type: WasteType;
  estimatedWeight: number;
  realWeight: number;
  wastePhotos: string;
  validWaste: boolean;
}
