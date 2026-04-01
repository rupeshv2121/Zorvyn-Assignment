const fs = require('fs');
const path = require('path');

const dirs = [
  'src',
  'src/components',
  'src/components/common',
  'src/components/layout',
  'src/components/charts',
  'src/components/records',
  'src/pages',
  'src/hooks',
  'src/services',
  'src/services/api',
  'src/store',
  'src/types',
  'src/utils',
  'public'
];

console.log('Creating frontend directory structure...\n');

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created: ${dir}`);
    
    // Create .gitkeep in each directory
    const gitkeepPath = path.join(fullPath, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
    }
  } else {
    console.log(`  Already exists: ${dir}`);
  }
});

console.log('\n✅ Frontend directory structure ready!');
console.log('\nNext steps:');
console.log('1. Run: npm install');
console.log('2. Copy .env.example to .env');
console.log('3. Run: npm run dev');
