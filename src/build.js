const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const lambdas = ['get_notes', 'add_note', 'update_note', 'delete_note'];

console.log('🚀 Building lambdas with esbuild...\n');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist', 'lambdas');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Build each lambda
lambdas.forEach((lambdaName) => {
  const outDir = path.join(distDir, lambdaName);

  // Create output directory
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  try {
    const cmd = `npx esbuild lambdas/${lambdaName}/index.ts --bundle --platform=node --target=node20 --outfile=dist/lambdas/${lambdaName}/index.js --external:@aws-sdk/* --format=cjs`;

    console.log(`Building ${lambdaName}...`);
    execSync(cmd, { cwd: __dirname, stdio: 'inherit' });
    console.log(`✅ Built ${lambdaName}\n`);
  } catch (error) {
    console.error(`❌ Error building ${lambdaName}`);
    process.exit(1);
  }
});

console.log('🎉 All lambdas built successfully!');


