const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.includes('[') && file.endsWith('route.ts') && !file.includes('nextauth')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('app/api');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find signatures like: export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const regex = /export async function ([A-Z]+)\(req: (Request|NextRequest), \{ params \}: \{ params: \{ id: string \} \} | any\)\s*\{/g;
  
  // Simpler regex since there are variations
  const simpleRegex = /export async function ([A-Z]+)\(req: (Request|NextRequest), \{ params \}: \{ params: \{ ([^}]+) \} \}\)\s*\{/g;
  
  let modified = false;
  
  content = content.replace(simpleRegex, (match, method, reqType, paramTypes) => {
    modified = true;
    return `export async function ${method}(req: ${reqType}, { params }: { params: Promise<{ ${paramTypes} }> }) {\n  const resolvedParams = await params;`;
  });
  
  // also need to replace `params.id` with `resolvedParams.id` etc within the function bodies if we did the replacement.
  if (modified) {
     content = content.replace(/params\.id/g, 'resolvedParams.id');
     content = content.replace(/params\.slug/g, 'resolvedParams.slug');
     fs.writeFileSync(file, content);
     console.log('Fixed:', file);
  } else {
    // If it didn't match the simple regex, maybe it was just `{ params }: any`
    const anyRegex = /export async function ([A-Z]+)\((req|request): (Request|NextRequest|any)(, \{ params \}: any)?\)\s*\{/g;
    // this might be too complex to reliably replace with regex. We should check manually for ones that failed.
  }
});
