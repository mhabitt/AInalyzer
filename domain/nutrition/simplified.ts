import {
  Gender,
  SimplifiedNutritionInput,
  SimplifiedNutritionResult,
} from './types';

export function calculateBMRStJeor(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const sign = gender === Gender.Male ? 5 : -161;
  return round((10 * weightKg) + (6.25 * heightCm) - (5 * age) + sign);
}

export function calculateSimplifiedTDEE(
  input: SimplifiedNutritionInput,
): SimplifiedNutritionResult {
  const { gender, age, weightKg, heightCm, activityFactor } = input;
  const bmr = calculateBMRStJeor(gender, weightKg, heightCm, age);
  const tdee = round(bmr * activityFactor);
  const bmi = calculateBMI(weightKg, heightCm);

  return {
    bmr,
    tdee,
    bmi,
  };
}

function calculateBMI(weightKg: number, heightCm: number): number {
  const heightMeters = heightCm / 100;
  return Number((weightKg / (heightMeters * heightMeters)).toFixed(1));
}

function round(value: number): number {
  return Math.round(value);
}
