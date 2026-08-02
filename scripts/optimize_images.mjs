import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dirs = [
  path.join(process.cwd(), 'public', 'assets', 'karakter'),
  path.join(process.cwd(), 'public', 'assets', 'pra-event'),
  path.join(process.cwd(), 'public', 'assets', 'sponsor')
];

async function optimizeDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const originalMB = (stat.size / (1024 * 1024)).toFixed(2);
      
      try {
        const image = sharp(filePath);
        const metadata = await image.metadata();
        
        let maxDim = dir.includes('karakter') ? 1000 : 800;
        let transform = image;
        if (metadata.width > maxDim || metadata.height > maxDim) {
          transform = transform.resize({
            width: metadata.width > metadata.height ? maxDim : undefined,
            height: metadata.height >= metadata.width ? maxDim : undefined,
            fit: 'inside',
            withoutEnlargement: true
          });
        }
        
        const tempPath = filePath + '.tmp' + ext;
        if (ext === '.png') {
          await transform.png({ compressionLevel: 9, effort: 8, palette: true }).toFile(tempPath);
        } else {
          await transform.jpeg({ quality: 82, mozjpeg: true }).toFile(tempPath);
        }
        
        const newStat = fs.statSync(tempPath);
        if (newStat.size < stat.size) {
          fs.renameSync(tempPath, filePath);
          console.log(`Optimized ${file}: ${originalMB} MB -> ${(newStat.size / (1024 * 1024)).toFixed(2)} MB`);
        } else {
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          console.log(`Skipped ${file} (already small: ${originalMB} MB)`);
        }
      } catch (err) {
        console.error(`Error optimizing ${file}:`, err.message);
        const tempPath = filePath + '.tmp' + ext;
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
}

async function run() {
  console.log('Starting image asset optimization...');
  for (const dir of dirs) {
    console.log(`\nProcessing directory: ${dir}`);
    await optimizeDirectory(dir);
  }
  console.log('\nAll asset optimization complete!');
}

run();
