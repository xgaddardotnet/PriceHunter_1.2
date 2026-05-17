const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/HP/Desktop/Bilişim_projesi_mağazalar_2_1/magaza_resimler';
const destDir = 'c:/Users/HP/Desktop/Bilişim_projesi_mağazalar_2_1/Bilişim_projesi_mağazalar/frontend/public/magaza_resimler';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const charMap = {
  'ş': 's', 'Ş': 'S',
  'ı': 'i', 'I': 'I',
  'ğ': 'g', 'Ğ': 'G',
  'ü': 'u', 'Ü': 'U',
  'ö': 'o', 'Ö': 'O',
  'ç': 'c', 'Ç': 'C',
  ' ': '_',
  '(': '', ')': '',
  '-': '_',
  'kopya': 'copy'
};

function normalize(name) {
  let normalized = name.toLowerCase();
  for (const [key, val] of Object.entries(charMap)) {
    normalized = normalized.split(key).join(val);
  }
  // Remove multiple underscores
  normalized = normalized.replace(/_+/g, '_');
  return normalized;
}

const files = fs.readdirSync(srcDir);

files.forEach(file => {
  const normalizedName = normalize(file);
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, normalizedName);
  
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Synced: ${file} -> ${normalizedName}`);
  } catch (err) {
    console.error(`Error syncing ${file}:`, err);
  }
});

console.log('Sync and normalization complete.');
