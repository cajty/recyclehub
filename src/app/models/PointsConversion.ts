export interface PointsConversion {
  points: number;
  amount: number;
}

export const AVAILABLE_CONVERSIONS: PointsConversion[] = [
  {
    points: 100,
    amount: 50
  },
  {
    points: 200,
    amount: 120
  },
  {
    points: 500,
    amount: 350
  }
];
