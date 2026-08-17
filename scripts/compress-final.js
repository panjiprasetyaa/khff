const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const filesToCompress = [
  path.join(__dirname, '../public/assets/cover-web-potrait.png'),
  path.join(__dirname, '../public/assets/sponsor-revisi.png'),
  path.join(__dirname, '../public/assets/gallery/2024/Salinan dari Salinan_Mahaditya.JPG'),
  path.join(__dirname, '../public/assets/pre-event/duameja.png'),
  path.join(__dirname, '../public/assets/pre-event/njangkar.png'),
  path.join(__dirname, '../public/assets/pre-event/pungra.png'),
  path.join(__dirname, '../public/assets/pre-event/unggah.png')
];

async function compressImage(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipped (not found): ${filePath}`);
    return;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const tempPath = filePath + '.tmp';
  
  try {
    const stats = fs.statSync(filePath);
    console.log(`Compressing: ${path.basename(filePath)} (${(stats.size/1024/1024).toFixed(2)} MB)...`);
    
    let pipeline = sharp(filePath).resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true
    });

    if (ext === '.png') {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
    } else {
      pipeline = pipeline.jpeg({ quality: 80, progressive: true });
    }

    await pipeline.toFile(tempPath);
      
    fs.unlinkSync(filePath); // delete original first to avoid EPERM rename issues on Windows
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

async function main() {
  console.log('Starting final image compression...');
  for (const file of filesToCompress) {
    await compressImage(file);
  }
  console.log('All done!');
}

main();
