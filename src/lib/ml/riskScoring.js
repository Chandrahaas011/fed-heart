/**
 * Evidence-based cardiovascular risk scoring.
 * Based on Framingham Risk Score + ACC/AHA 2019 guidelines.
 *
 * @param {Object} params - raw patient values
 * @returns {number} risk score 0-1
 */
export function computeRiskScore(params) {
  const {
    age, gender, bp, cholesterol,
    exercise, smoking, familyHD, diabetes,
    bmi, highBP, lowHDL, highLDL,
    alcohol, stress, sleep, sugar,
    triglycerides, fastingBS, crp, homocysteine
  } = params;

  let score = 0;

  // === Critical overrides — any single critical indicator forces High Risk ===
  // BP ≥ 180 is hypertensive crisis; Cholesterol ≥ 300 indicates severe hypercholesterolemia
  const criticalBP = bp >= 180;
  const criticalChol = cholesterol >= 300;
  const severeMultiRisk = (bp >= 160 && cholesterol >= 240 && (smoking === 1 || diabetes === 1 || familyHD === 1));
  if (criticalBP || criticalChol || severeMultiRisk) {
    score += 35; // Immediate floor into High Risk territory
  }

  // === Age risk ===
  if (age >= 75) score += 20;
  else if (age >= 65) score += 15;
  else if (age >= 55) score += 10;
  else if (age >= 45) score += 6;
  else if (age >= 35) score += 3;
  else score += 1;

  // === Blood Pressure ===
  if (bp >= 180) score += 25;      // Hypertensive crisis
  else if (bp >= 160) score += 18; // Stage 2 hypertension
  else if (bp >= 140) score += 11; // Stage 1 hypertension
  else if (bp >= 130) score += 5;  // Elevated
  else if (bp >= 120) score += 2;  // Prehypertension

  // === Cholesterol (Total) ===
  if (cholesterol >= 400) score += 20;
  else if (cholesterol >= 300) score += 15;
  else if (cholesterol >= 240) score += 10;
  else if (cholesterol >= 200) score += 4;

  // === BMI ===
  if (bmi >= 40) score += 10;
  else if (bmi >= 35) score += 7;
  else if (bmi >= 30) score += 4;
  else if (bmi >= 25) score += 1;

  // === Binary risk factors ===
  if (smoking === 1) score += 12;
  if (diabetes === 1) score += 12;
  if (familyHD === 1) score += 8;
  if (highBP === 1) score += 7;
  if (lowHDL === 1) score += 6;
  if (highLDL === 1) score += 6;

  // === Triglycerides ===
  if (triglycerides >= 500) score += 10;
  else if (triglycerides >= 200) score += 5;
  else if (triglycerides >= 150) score += 2;

  // === Fasting Blood Sugar ===
  if (fastingBS >= 200) score += 8;
  else if (fastingBS >= 126) score += 5;
  else if (fastingBS >= 100) score += 2;

  // === Inflammation markers ===
  if (crp >= 10) score += 8;
  else if (crp >= 3) score += 5;
  else if (crp >= 1) score += 2;

  if (homocysteine >= 30) score += 6;
  else if (homocysteine >= 15) score += 4;
  else if (homocysteine >= 12) score += 2;

  // === Lifestyle ===
  if (exercise === 2) score -= 8;   // High exercise
  else if (exercise === 1) score -= 3;
  else score += 5;                   // Low exercise

  if (stress === 2) score += 6;
  else if (stress === 1) score += 2;

  if (sugar === 2) score += 4;
  else if (sugar === 1) score += 1;

  if (alcohol === 3) score += 6;
  else if (alcohol === 2) score += 3;

  if (sleep < 5 || sleep > 10) score += 4;
  else if (sleep >= 7 && sleep <= 9) score -= 2;

  // Gender: males <55 at slightly elevated baseline risk
  if (gender === 1 && age < 55) score += 3;

  // === Normalize: midpoint at 33 ===
  // Healthy baseline (~15-20pts) → ~20-30% Low Risk
  // Moderate risk factors (~28-40pts) → 40-65% Moderate Risk
  // Critical readings (35+ override + high BP/Chol → 70+pts) → 70%+ High Risk
  const normalized = 1 / (1 + Math.exp(-(score - 33) / 14));

  return Math.max(0.02, Math.min(0.98, normalized));
}
