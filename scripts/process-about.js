const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'D:/Project 2/about-us';
const TARGET_DIR = 'D:/Project 2/khff-web/public/assets/about';
const BOARD_DIR = path.join(TARGET_DIR, 'board');

// Ensure directories exist
if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });
if (!fs.existsSync(BOARD_DIR)) fs.mkdirSync(BOARD_DIR, { recursive: true });

async function processImage(inputPath, outputPath, options) {
  try {
    let pipeline = sharp(inputPath);
    if (options.resize) {
      pipeline = pipeline.resize(options.resize);
    }
    await pipeline
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`✅ Processed: ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(`❌ Error processing ${inputPath}:`, err.message);
  }
}

async function run() {
  console.log('Memulai kompresi aset gambar About Us...');

  // 1. Hero
  await processImage(
    path.join(SOURCE_DIR, 'khff day 1-4/KHFF DAY 1-4.jpg'),
    path.join(TARGET_DIR, 'hero.webp'),
    { resize: { width: 1920, withoutEnlargement: true } }
  );

  // 2. Kadis
  await processImage(
    path.join(SOURCE_DIR, 'pembukaan pameran khff/Pembukaan Pameran KHFF-13.jpg'),
    path.join(TARGET_DIR, 'kadis.webp'),
    { resize: { width: 800, withoutEnlargement: true } }
  );

  // 3. Direktur
  await processImage(
    path.join(SOURCE_DIR, 'public lecture/Public Lecture-15.jpg'),
    path.join(TARGET_DIR, 'direktur.webp'),
    { resize: { width: 800, withoutEnlargement: true } }
  );

  // 4. Kurator
  await processImage(
    path.join(SOURCE_DIR, 'day 2 lt 4-8/Day 2 Lt 4-8.jpg'),
    path.join(TARGET_DIR, 'kurator.webp'),
    { resize: { width: 800, withoutEnlargement: true } }
  );

  // 5. Board
  const boardSourceDir = path.join(SOURCE_DIR, 'foto satuan festival juri');
  const boardFiles = fs.readdirSync(boardSourceDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  
  for (const file of boardFiles) {
    const inputPath = path.join(boardSourceDir, file);
    const parsed = path.parse(file);
    const outputPath = path.join(BOARD_DIR, `${parsed.name}.webp`);
    
    await processImage(inputPath, outputPath, {
      resize: { width: 400, height: 400, fit: 'cover', position: 'entropy' } // focus on face/entropy
    });
  }

  console.log('🎉 Kompresi selesai!');
}

run();
