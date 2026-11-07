import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(dir,x.name)):[path.join(dir,x.name)]);}
const inventory=[];
const missing=[];
for(const file of files('src').filter(x=>x.endsWith('.tsx'))){
 const source=fs.readFileSync(file,'utf8');
 const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const grids=new Map();
 const fields=[];
 function visit(n){
  if(ts.isJsxSelfClosingElement(n)||ts.isJsxOpeningElement(n)){
   const type=n.attributes.properties.find(x=>ts.isJsxAttribute(x)&&x.name.getText(ast)==='type');
   if(type?.initializer&&ts.isStringLiteral(type.initializer)&&['date','time','datetime-local','month','week'].includes(type.initializer.text)){
    fields.push({type:type.initializer.text,line:ast.getLineAndCharacterOfPosition(n.getStart(ast)).line+1});
    let p=n.parent;
    while(p){
     if(ts.isFunctionLike(p))break;
     if(ts.isJsxElement(p)){
      const attr=p.openingElement.attributes.properties.find(x=>ts.isJsxAttribute(x)&&x.name.getText(ast)==='className');
      if(attr?.initializer&&ts.isStringLiteral(attr.initializer)&&/\bgrid\b/.test(attr.initializer.text)){
       const cols=[...attr.initializer.text.matchAll(/(?:^|\s)(?:\w+:)?grid-cols-([1-4])(?=\s|$)/g)].map(x=>Number(x[1]));
       grids.set(attr.getStart(ast),{attr,cols:Math.max(2,...cols)});
       if(!attr.initializer.text.includes('layout-form-grid')) missing.push(`${file}:${ast.getLineAndCharacterOfPosition(attr.getStart(ast)).line+1}`);
       break;
      }
     }
     p=p.parent;
    }
   }
  }
  ts.forEachChild(n,visit);
 }
 visit(ast);
 if(fields.length){
  inventory.push({file,fields,grids:grids.size});

 }
}
if (missing.length) {
 console.error('Native date/time form grids missing available-width sizing:\n'+missing.join('\n'));
 process.exitCode=1;
} else {
 console.log(`PASS: ${inventory.reduce((n,x)=>n+x.fields.length,0)} date/time fields in ${inventory.length} files; ${inventory.reduce((n,x)=>n+x.grids,0)} form grids use available-width sizing.`);
}
if (process.argv.includes('--json')) console.log(JSON.stringify(inventory,null,2));
