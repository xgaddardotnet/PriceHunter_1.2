const fs = require('fs');
const path = require('path');

const dir = './frontend/public/magaza_resimler';
if (!fs.existsSync(dir)) {
  console.log('Directory not found:', dir);
  process.exit(0);
}

const files = fs.readdirSync(dir);

const charMap = {
  'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
  'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C',
  ' ': '_'
};

files.forEach(file => {
  let newName = file;
  let changed = false;
  
  for (const [char, replacement] of Object.entries(charMap)) {
    if (newName.includes(char)) {
      newName = newName.split(char).join(replacement);
      changed = true;
    }
  }

  if (changed) {
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, newName);
    
    if (fs.existsSync(newPath) && oldPath.toLowerCase() !== newPath.toLowerCase()) {
       console.log(`Skipping rename (collision): ${file} -> ${newName}`);
    } else {
       fs.renameSync(oldPath, newPath);
       console.log(`Renamed: ${file} -> ${newName}`);
    }
  }
});
