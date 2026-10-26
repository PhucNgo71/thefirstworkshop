const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const entries=require('./product-details-en.json');
fs.writeFileSync(path.join(root,'dist/detail-translations.js'),'window.detailTranslations = '+JSON.stringify(entries,null,2)+';\n');
