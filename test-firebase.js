import fs from 'fs';
const data = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
console.log(data.apiKey);
