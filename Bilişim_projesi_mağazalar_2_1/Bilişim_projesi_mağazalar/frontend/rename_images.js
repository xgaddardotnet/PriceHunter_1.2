const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/HP/Desktop/Bilişim_projesi_mağazalar_2_1/Bilişim_projesi_mağazalar/frontend/public/magaza_resimler';
const files = fs.readdirSync(dir);

const charMap = {
  'ı': 'i',
  'ğ': 'g',
  'ü': 'u',
  'ş': 's',
  'ö': 'o',
  'ç': 'c',
  'İ': 'I',
  'Ğ': 'G',
  'Ü': 'U',
  'Ş': 'S',
  'Ö': 'O',
  'Ç': 'C',
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
    
    // Check if destination exists (to avoid collision)
    if (fs.existsSync(newPath) && oldPath.toLowerCase() !== newPath.toLowerCase()) {
       console.log(`Skipping rename (collision): ${file} -> ${newName}`);
    } else {
       fs.renameSync(oldPath, newPath);
       console.log(`Renamed: ${file} -> ${newName}`);
    }
  }
});
