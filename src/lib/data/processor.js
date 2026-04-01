import Papa from 'papaparse';

export const CATEGORICAL_MAPPINGS = {
  Gender: { 'Male': 1, 'Female': 0 },
  'Exercise Habits': { 'High': 2, 'Medium': 1, 'Low': 0 },
  'Smoking': { 'Yes': 1, 'No': 0 },
  'Family Heart Disease': { 'Yes': 1, 'No': 0 },
  'Diabetes': { 'Yes': 1, 'No': 0 },
  'High Blood Pressure': { 'Yes': 1, 'No': 0 },
  'Low HDL Cholesterol': { 'Yes': 1, 'No': 0 },
  'High LDL Cholesterol': { 'Yes': 1, 'No': 0 },
  'Alcohol Consumption': { 'High': 2, 'Medium': 1, 'Low': 0, 'None': 0 },
  'Stress Level': { 'High': 2, 'Medium': 1, 'Low': 0 },
  'Sugar Consumption': { 'High': 2, 'Medium': 1, 'Low': 0 },
  'Heart Disease Status': { 'Yes': 1, 'No': 0 }
};

export async function loadAndProcessData(csvPath, maxRows = 10000) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data.filter(row => row['Heart Disease Status'] !== undefined).slice(0, maxRows);
        const processed = data.map(row => {
          const features = [
            row.Age || 0,
            CATEGORICAL_MAPPINGS.Gender[row.Gender] ?? 0,
            row['Blood Pressure'] || 0,
            row['Cholesterol Level'] || 0,
            CATEGORICAL_MAPPINGS['Exercise Habits'][row['Exercise Habits']] ?? 0,
            CATEGORICAL_MAPPINGS['Smoking'][row.Smoking] ?? 0,
            CATEGORICAL_MAPPINGS['Diabetes'][row.Diabetes] ?? 0,
            row.BMI || 0,
            CATEGORICAL_MAPPINGS['Stress Level'][row['Stress Level']] ?? 0,
            CATEGORICAL_MAPPINGS['Sugar Consumption'][row['Sugar Consumption']] ?? 0,
          ];
          const label = CATEGORICAL_MAPPINGS['Heart Disease Status'][row['Heart Disease Status']] ?? 0;
          return { features, label };
        });

        // Simple Normalization (Min-Max)
        const featureCount = processed[0].features.length;
        const mins = new Array(featureCount).fill(Infinity);
        const maxs = new Array(featureCount).fill(-Infinity);

        processed.forEach(p => {
          p.features.forEach((v, i) => {
            if (v < mins[i]) mins[i] = v;
            if (v > maxs[i]) maxs[i] = v;
          });
        });

        const normalized = processed.map(p => ({
          features: p.features.map((v, i) => (maxs[i] - mins[i] === 0) ? 0 : (v - mins[i]) / (maxs[i] - mins[i])),
          label: p.label
        }));

        resolve({
          data: normalized,
          stats: { mins, maxs }
        });
      },
      error: (err) => reject(err)
    });
  });
}

export function splitDataForHospitals(data, hospitalCount = 3) {
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  const size = Math.floor(shuffled.length / hospitalCount);
  const splits = [];
  for (let i = 0; i < hospitalCount; i++) {
    splits.push(shuffled.slice(i * size, (i + 1) * size));
  }
  return splits;
}
