import {
  ActivityType,
  AdvancedNutritionInput,
  AdvancedNutritionResult,
  BodyType,
  Gender,
  Intensity,
} from './types';

const strengthCaloriesPerMinute: Record<Intensity, number> = {
  [Intensity.Low]: 7,
  [Intensity.Medium]: 8,
  [Intensity.High]: 9,
};

const aerobicCaloriesPerMinute: Record<Intensity, number> = {
  [Intensity.Low]: 5,
  [Intensity.Medium]: 7.5,
  [Intensity.High]: 10,
};

const aerobicEPOCByIntensity: Record<Intensity, number> = {
  [Intensity.Low]: 5,
  [Intensity.Medium]: 35,
  [Intensity.High]: 180,
};

const neatByBodyType: Record<BodyType, number> = {
  [BodyType.Endomorph]: 300,
  [BodyType.Mesomorph]: 450,
  [BodyType.Ectomorph]: 800,
};

export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const sign = gender === Gender.Male ? 5 : -161;
  return round((9.99 * weightKg) + (6.25 * heightCm) - (4.92 * age) + sign);
}

export function calculateAdvancedTDEE(
  input: AdvancedNutritionInput,
): AdvancedNutritionResult {
  const {
    gender,
    age,
    weightKg,
    heightCm,
    bodyType,
    sessions = [],
    tefRatio = 0.1,
    neatOverride,
    strengthEpocPercent = 0.06,
  } = input;

  const bmr = calculateBMR(gender, weightKg, heightCm, age);

  const weeklyExerciseCalories = sessions.reduce((total, session) => {
    const countPerWeek = session.countPerWeek ?? 1;
    const caloriesPerMinute = session.type === ActivityType.Strength
      ? strengthCaloriesPerMinute[session.intensity]
      : aerobicCaloriesPerMinute[session.intensity];

    return total + caloriesPerMinute * session.durationMinutes * countPerWeek;
  }, 0);

  const weeklyEPOC = sessions.reduce((total, session) => {
    const countPerWeek = session.countPerWeek ?? 1;
    if (session.type === ActivityType.Strength) {
      return total + round(bmr * strengthEpocPercent) * countPerWeek;
    }

    return total + aerobicEPOCByIntensity[session.intensity] * countPerWeek;
  }, 0);

  const dailyTEA = round((weeklyExerciseCalories + weeklyEPOC) / 7);
  const neat = neatOverride ?? neatByBodyType[bodyType];
  const tdeeBeforeTef = round(bmr + dailyTEA + neat);
  const tef = round(tdeeBeforeTef * tefRatio);
  const tdee = round(tdeeBeforeTef + tef);
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
