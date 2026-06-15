const fs = require('fs');
const path = require('path');

function processDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      processDir(p);
    } else if (p.endsWith('page.js')) {
      let content = fs.readFileSync(p, 'utf8');
      if (!content.includes('export const dynamic')) {
        content = content.replace(/(import.*?;?\n)+/, match => `${match}\nexport const dynamic = "force-dynamic";\n`);
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Updated ${p}`);
      }
    }
  });
}

processDir('src/app');
console.log('All page.js files updated.');
