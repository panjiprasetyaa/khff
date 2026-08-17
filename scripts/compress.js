const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  path.join(__dirname, '../public/assets/gallery/2025'),
  path.join(__dirname, '../public/assets/gallery/2024'),
  path.join(__dirname, '../public/assets/gallery/2023'),
  path.join(__dirname, '../public/assets/sponsors'),
];

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    const tempPath = filePath + '.tmp';
    
    try {
      const stats = fs.statSync(filePath);
      if (stats.size < 500 * 1024) { // skip if < 500KB
        console.log(`Skipped (already small): ${path.basename(filePath)} (${(stats.size/1024).toFixed(1)} KB)`);
        return;
      }
      
      console.log(`Compressing: ${path.basename(filePath)} (${(stats.size/1024/1024).toFixed(2)} MB)...`);
      
      await sharp(filePath)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80, progressive: true })
        .toFile(tempPath);
        
      fs.renameSync(tempPath, filePath);
      
      const newStats = fs.statSync(filePath);
      console.log(` -> Done! New size: ${(newStats.size/1024).toFixed(1)} KB`);
      
    } catch (err) {
      console.error(`Failed to compress ${filePath}:`, err);
      if (fs.existsSync(tempPath)) {
         fs.unlinkSync(tempPath);
      }
    }
  }
}

async function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      await processDir(fullPath);
    } else {
      await compressImage(fullPath);
    }
  }
}

async function main() {
  console.log('Starting image compression...');
  for (const dir of targetDirs) {
    console.log(`Processing directory: ${dir}`);
    await processDir(dir);
  }
  console.log('All done!');
}

main();
