const fs = require('fs');
const glob = require('glob');
const path = require('path');

const pageFiles = glob.sync('app/admin/**/page.tsx');

pageFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('{ searchParams }: { searchParams: { search?: string, page?: string } }')) {
    content = content.replace(
      '{ searchParams }: { searchParams: { search?: string, page?: string } }',
      '{ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }'
    );
    
    // Insert await params = await searchParams;
    content = content.replace(
      'const search = searchParams?.search || "";',
      'const params = await searchParams;\n  const search = params?.search || "";'
    );
    
    content = content.replace(
      'searchParams?.page',
      'params?.page'
    );
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
