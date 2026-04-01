import fs from 'fs';
import Papa from 'papaparse';

const csvContent = fs.readFileSync('./public/data set/heart_disease.csv', 'utf8');
const results = Papa.parse(csvContent, { header: true, dynamicTyping: false, skipEmptyLines: true });
const rows = results.data.filter(r => r['Heart Disease Status'] === 'Yes' || r['Heart Disease Status'] === 'No');

const yes = rows.filter(r => r['Heart Disease Status'] === 'Yes');
const no =  rows.filter(r => r['Heart Disease Status'] === 'No');

const numericCols = ['Age', 'Blood Pressure', 'Cholesterol Level', 'BMI', 'Triglyceride Level', 'Fasting Blood Sugar', 'CRP Level', 'Homocysteine Level', 'Sleep Hours'];
const catCols = ['Smoking', 'Diabetes', 'Family Heart Disease', 'High Blood Pressure', 'Low HDL Cholesterol', 'High LDL Cholesterol'];

const avg = (arr, col) => {
  const vals = arr.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
};

const pct = (arr, col) => {
  const yes = arr.filter(r => r[col] === 'Yes').length;
  return ((yes / arr.length) * 100).toFixed(1) + '%';
};

const out = [];
out.push('=== Numeric Features (mean) ===');
out.push('Feature'.padEnd(30) + 'YES'.padEnd(12) + 'NO'.padEnd(12) + 'DIFF');
for (const col of numericCols) {
  const y = parseFloat(avg(yes, col));
  const n = parseFloat(avg(no, col));
  out.push(col.padEnd(30) + String(y).padEnd(12) + String(n).padEnd(12) + (y - n).toFixed(2));
}

out.push('\n=== Categorical Features (% Yes) ===');
out.push('Feature'.padEnd(30) + 'YES'.padEnd(12) + 'NO');
for (const col of catCols) {
  out.push(col.padEnd(30) + pct(yes, col).padEnd(12) + pct(no, col));
}

const report = out.join('\n');
fs.writeFileSync('./scripts/feature_analysis.txt', report);
console.log(report);
