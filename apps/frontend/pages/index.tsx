"use client";

import { useState } from 'react';
import {
  calculateAdvancedTDEE,
  ActivityType,
  BodyType,
  Gender,
  Intensity,
} from 'domain/nutrition';

export default function Home() {
  const [health, setHealth] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/health');
      const data = await response.json();

      setHealth(JSON.stringify(data));
    } catch (err) {
      setError('Failed to call backend');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  const calories = calculateAdvancedTDEE({
    gender: Gender.Male,
    age: 25,
    weightKg: 70,
    heightCm: 175,
    bodyType: BodyType.Mesomorph,
    sessions: [
      { type: ActivityType.Strength, intensity: Intensity.High, durationMinutes: 45, countPerWeek: 3 },
    ],
  });


  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>AInalyzer frontend</h1>
      <p>Click the button to call the backend health endpoint.</p>
      <button onClick={fetchHealth} disabled={loading} style={{ padding: '0.75rem 1.25rem', fontSize: '1rem' }}>
        {loading ? 'Calling backend...' : 'Call backend'}
      </button>
      {health && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <strong>Backend response:</strong>
          <div>{health}</div>
          <strong>Calories estimate:</strong>
          <pre>{calories.bmi}, {calories.bmr}, {calories.tdee}</pre>
        </div>
      )}
      {error && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          {error}
        </div>
      )}
    </main>
  );
}
