export interface BaseAsset {
  id: string;
  type: 'Car' | 'House' | 'Business';
  name: string;
  cost: number;
  resaleValue: number;
  happinessBoost?: number;
  requiredAge?: number;
}

export interface Car extends BaseAsset {
  type: 'Car';
}

export interface House extends BaseAsset {
  type: 'House';
  maintenanceCost: number;
}

export interface Business extends BaseAsset {
  type: 'Business';
  incomePerYear: number;
}

export type Asset = Car | House | Business;