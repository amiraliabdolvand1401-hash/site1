const fs = require('fs');
let content = fs.readFileSync('src/firebase.ts', 'utf8');
content = content.replace("export const app = initializeApp(firebaseConfig);", "console.log('firebaseConfig:', firebaseConfig);\nexport const app = initializeApp(firebaseConfig);");
fs.writeFileSync('src/firebase.ts', content);
