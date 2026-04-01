import fs from 'fs';
const content = fs.readFileSync('./public/data set/heart_disease.csv', 'utf8');
const rows = content.split(/\r?\n/);

const header = rows[0].split(',');
const row1 = rows[1].split(',');
const row2 = rows[2].split(',');

const yesCount = rows.filter(r => r.split(',').pop()?.trim() === 'Yes').length;
const noCount = rows.filter(r => r.split(',').pop()?.trim() === 'No').length;

const output = [
  'HEADER (' + header.length + ' cols): ' + JSON.stringify(header),
  '',
  'ROW1: ' + JSON.stringify(row1),
  '',
  'ROW2: ' + JSON.stringify(row2),
  '',
  'Total rows: ' + (rows.length - 1),
  'YES labels: ' + yesCount,
  'NO labels:  ' + noCount,
].join('\n');

fs.writeFileSync('./scripts/csv_debug.txt', output);
console.log('Done. Written to scripts/csv_debug.txt');
