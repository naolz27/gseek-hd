const fs = require('fs');
const css = fs.readFileSync('C:/Users/HP/Documents/mudin/original.txt', 'utf8');
fs.writeFileSync('C:/Users/HP/Documents/mudin/index.html', css);
console.log('CSS written');