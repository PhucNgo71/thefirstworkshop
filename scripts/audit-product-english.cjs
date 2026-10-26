const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,'dist',f),'utf8');
const context=vm.createContext({window:{},URL});
for(const file of ['product-details.js','product-gallery.js','dress-collection.js','sls-collection.js'])vm.runInContext(read(file),context);
const app=read('app.js');
vm.runInContext(app.slice(app.indexOf('const wpodExperience='),app.indexOf('const manufacturerOverrides=')),context);
const entries=vm.runInContext(app.match(/const catalogEntries=(\[[\s\S]*?\n\]);/)[1],context);
const overrides=vm.runInContext('('+app.match(/const manufacturerOverrides=({[\s\S]*?\n});/)[1]+')',context);
context.window.applySlsDetails?.(overrides);
if(fs.existsSync(path.join(root,'dist/specification-translations.js')))vm.runInContext(read('specification-translations.js'),context);
const translations=vm.runInContext(read('i18n.js').split('const originalAttributes')[0]+';english;',context);
const vietnamese=/[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉĩịọỏốồổỗộớờởỡợụủũứừửữựỳỵỷỹ]/i;
const missing=new Map();
function scan(value,id,field){if(typeof value==='string'){if(vietnamese.test(value)&&!translations[value.trim()]){const key=value.trim();if(!missing.has(key))missing.set(key,[]);missing.get(key).push(id+':'+field);}}else if(Array.isArray(value))value.forEach(v=>scan(v,id,field));else if(value&&typeof value==='object')Object.entries(value).filter(([k])=>!['images','sourceUrl','specificationUrl','src','image','hex','swatches'].includes(k)).forEach(([k,v])=>scan(v,id,field+'.'+k));}
for(const [id,name,scope] of entries){const source={...context.window.productDetails[id],...overrides[id],...context.window.productGalleryOverrides?.[id]};scan(source,id,'detail');scan(name,id,'name');const dimension=((source.specifications||'')+'\n'+(source.description||'')).split(/\n+/).find(line=>/kích thước|dimension/i.test(line));if(dimension)scan(dimension.replace(/^.*?(kích thước|dimension)\s*:?\s*/i,''),id,'dimension');}
const result=[...missing].map(([text,uses])=>({text,uses}));
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={result,entries,context,overrides,translations};
