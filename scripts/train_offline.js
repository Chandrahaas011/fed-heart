/**
 * Proper offline training using logistic regression with gradient descent.
 * This avoids the TF.js CPU convergence issues and produces clinically sensible predictions.
 */
import fs from 'fs';
import Papa from 'papaparse';

const MAPPINGS = {
  Gender: { 'Male': 1, 'Female': 0 },
  'Exercise Habits': { 'High': 0, 'Medium': 1, 'Low': 2 }, // inverted: low exercise = higher risk
  'Smoking': { 'Yes': 1, 'No': 0 },
  'Family Heart Disease': { 'Yes': 1, 'No': 0 },
  'Diabetes': { 'Yes': 1, 'No': 0 },
  'High Blood Pressure': { 'Yes': 1, 'No': 0 },
  'Low HDL Cholesterol': { 'Yes': 1, 'No': 0 },
  'High LDL Cholesterol': { 'Yes': 1, 'No': 0 },
  'Alcohol Consumption': { 'None': 0, 'Low': 1, 'Medium': 2, 'High': 3 },
  'Stress Level': { 'Low': 0, 'Medium': 1, 'High': 2 },
  'Sugar Consumption': { 'Low': 0, 'Medium': 1, 'High': 2 },
  'Heart Disease Status': { 'Yes': 1, 'No': 0 }
};

function rowToFeatures(row) {
  return [
    parseFloat(row['Age']) || 0,
    MAPPINGS.Gender[row['Gender']] ?? 0,
    parseFloat(row['Blood Pressure']) || 0,
    parseFloat(row['Cholesterol Level']) || 0,
    MAPPINGS['Exercise Habits'][row['Exercise Habits']] ?? 1,
    MAPPINGS['Smoking'][row['Smoking']] ?? 0,
    MAPPINGS['Family Heart Disease'][row['Family Heart Disease']] ?? 0,
    MAPPINGS['Diabetes'][row['Diabetes']] ?? 0,
    parseFloat(row['BMI']) || 0,
    MAPPINGS['High Blood Pressure'][row['High Blood Pressure']] ?? 0,
    MAPPINGS['Low HDL Cholesterol'][row['Low HDL Cholesterol']] ?? 0,
    MAPPINGS['High LDL Cholesterol'][row['High LDL Cholesterol']] ?? 0,
    MAPPINGS['Alcohol Consumption'][row['Alcohol Consumption']] ?? 0,
    MAPPINGS['Stress Level'][row['Stress Level']] ?? 1,
    parseFloat(row['Sleep Hours']) || 7,
    MAPPINGS['Sugar Consumption'][row['Sugar Consumption']] ?? 1,
    parseFloat(row['Triglyceride Level']) || 0,
    parseFloat(row['Fasting Blood Sugar']) || 0,
    parseFloat(row['CRP Level']) || 0,
    parseFloat(row['Homocysteine Level']) || 0,
  ];
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, x))));
}

function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function logisticTrain(X, y, lr = 0.1, epochs = 200, l2 = 0.001) {
  const n = X.length;
  const d = X[0].length;
  let w = new Array(d).fill(0);
  let b = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    let dw = new Array(d).fill(0);
    let db = 0;
    let loss = 0;

    for (let i = 0; i < n; i++) {
      const pred = sigmoid(dot(X[i], w) + b);
      const err = pred - y[i];
      for (let j = 0; j < d; j++) dw[j] += err * X[i][j];
      db += err;
      loss += y[i] === 1 ? -Math.log(pred + 1e-9) : -Math.log(1 - pred + 1e-9);
    }

    // L2 regularisation + gradient step
    for (let j = 0; j < d; j++) w[j] -= lr * ((dw[j] / n) + l2 * w[j]);
    b -= lr * (db / n);

    if ((epoch + 1) % 50 === 0) {
      const acc = X.reduce((s, xi, i) => s + ((sigmoid(dot(xi, w) + b) >= 0.5) === (y[i] === 1) ? 1 : 0), 0) / n;
      console.log(`  Epoch ${epoch + 1}/${epochs} — loss: ${(loss / n).toFixed(4)}, acc: ${(acc * 100).toFixed(2)}%`);
    }
  }

  return { w, b };
}

function run() {
  console.log('Loading dataset...');
  const csvContent = fs.readFileSync('./public/data set/heart_disease.csv', 'utf8');
  const results = Papa.parse(csvContent, { header: true, dynamicTyping: false, skipEmptyLines: true });
  const rows = results.data.filter(r => r['Heart Disease Status'] === 'Yes' || r['Heart Disease Status'] === 'No');
  console.log(`Valid rows: ${rows.length}`);

  const pos = rows.filter(r => r['Heart Disease Status'] === 'Yes');
  const neg = rows.filter(r => r['Heart Disease Status'] === 'No');
  console.log(`Class distribution — Yes:${pos.length}, No:${neg.length}`);

  // Oversample minority class to balance
  const balanced = [...neg];
  const factor = Math.ceil(neg.length / pos.length);
  for (let i = 0; i < factor; i++) balanced.push(...pos);
  for (let i = balanced.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [balanced[i], balanced[j]] = [balanced[j], balanced[i]];
  }
  console.log(`Balanced dataset: ${balanced.length} rows`);

  const rawFeatures = balanced.map(r => rowToFeatures(r));
  const labels = balanced.map(r => r['Heart Disease Status'] === 'Yes' ? 1 : 0);
  const featureCount = rawFeatures[0].length;

  // Min-Max normalization
  const mins = new Array(featureCount).fill(Infinity);
  const maxs = new Array(featureCount).fill(-Infinity);
  rawFeatures.forEach(f => f.forEach((v, i) => {
    if (v < mins[i]) mins[i] = v;
    if (v > maxs[i]) maxs[i] = v;
  }));

  const X = rawFeatures.map(f => f.map((v, i) => (maxs[i] - mins[i] === 0) ? 0 : (v - mins[i]) / (maxs[i] - mins[i])));

  console.log('\nTraining Logistic Regression (200 epochs)...');
  const { w, b } = logisticTrain(X, labels, 0.1, 200, 0.001);

  // Final accuracy
  const acc = X.reduce((s, xi, i) => s + ((sigmoid(dot(xi, w) + b) >= 0.5) === (labels[i] === 1) ? 1 : 0), 0) / X.length;
  console.log(`\nFinal Accuracy: ${(acc * 100).toFixed(2)}%`);

  // Validate with known test cases
  const normalize = (features) => features.map((v, i) => (maxs[i] - mins[i] === 0) ? 0 : (v - mins[i]) / (maxs[i] - mins[i]));

  const testCases = [
    {
      desc: 'Healthy 20yr male (Low Risk)',
      // age, gender, bp, chol, exercise(low risk=0=High), smoking, familyHD, diabetes, bmi, highBP, lowHDL, highLDL, alcohol, stress, sleep, sugar, triglycerides, fastingBS, crp, homocysteine
      features: [20, 1, 110, 160, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 8, 0, 100, 85, 0.5, 7]
    },
    {
      desc: 'High-Risk: BP=200, Chol=500, smoker, diabetic, family history',
      features: [60, 1, 200, 500, 2, 1, 1, 1, 34, 1, 1, 1, 3, 2, 5, 2, 450, 200, 8, 25]
    },
    {
      desc: 'Moderate risk 45yr',
      features: [45, 0, 140, 240, 1, 0, 1, 0, 27, 0, 1, 0, 1, 1, 6, 1, 200, 110, 2.5, 12]
    }
  ];

  console.log('\n--- Validation Predictions ---');
  for (const tc of testCases) {
    const nf = normalize(tc.features);
    const risk = sigmoid(dot(nf, w) + b);
    console.log(`  ${tc.desc}: ${(risk * 100).toFixed(1)}% heart disease risk`);
  }

  // Save model
  const modelData = {
    type: 'logistic_regression',
    accuracy: acc,
    featureCount,
    weights: w,
    bias: b,
    stats: { mins, maxs }
  };

  if (!fs.existsSync('./public/model')) fs.mkdirSync('./public/model', { recursive: true });
  fs.writeFileSync('./public/model/pretrained_weights.json', JSON.stringify(modelData));
  console.log('\nModel saved to /public/model/pretrained_weights.json');
}

run();
