export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum BodyType {
  Ectomorph = 'ectomorph',
  Mesomorph = 'mesomorph',
  Endomorph = 'endomorph',
}

export enum ActivityType {
  Strength = 'strength',
  Aerobic = 'aerobic',
}

export enum Intensity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface ActivitySession {
  type: ActivityType;
  intensity: Intensity;
  durationMinutes: number;
  countPerWeek?: number;
}

export interface AdvancedNutritionInput {
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  bodyType: BodyType;
  sessions?: ActivitySession[];
  tefRatio?: number;
  neatOverride?: number;
  strengthEpocPercent?: number;
}

export interface AdvancedNutritionResult {
  bmr: number;
  tdee: number;
  bmi: number;
}

export interface SimplifiedNutritionInput {
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  activityFactor: number;
}

export interface SimplifiedNutritionResult {
  bmr: number;
  tdee: number;
  bmi: number;
}
