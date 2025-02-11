export enum WasteType {
  Plastic = 'plastic',
  Paper = 'paper',
  Glass = 'glass',
  Metal = 'metal',
}

export const wastePoints: { [key in WasteType]: number } = {
  [WasteType.Plastic]: 2,
  [WasteType.Paper]: 1,
  [WasteType.Glass]: 1,
  [WasteType.Metal]: 5
};
