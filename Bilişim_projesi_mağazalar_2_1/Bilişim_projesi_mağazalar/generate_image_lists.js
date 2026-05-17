const fs = require('fs');
// Read as UTF-16LE or UTF-8 depending on how it was created
const content = fs.readFileSync('all_images.json', 'utf16le');
// Remove potential BOM and parse
const images = JSON.parse(content.replace(/^\uFEFF/, ''));

const categories = {
  kadin_ayakkabi: [],
  erkek_ayakkabi: [],
  kadin_elbise: [],
  erkek_elbise: [],
  kadin_tisort: [],
  erkek_tisort: [],
  akilli_telefon: [],
  laptop: [],
  kulaklik: [],
  televizyon: [],
  monitor: [],
  kamera: [],
  aksesuar_bileklik: [],
  aksesuar_kolye: [],
  aksesuar_kolcantasi: [],
  aksesuar_yuzuk: [],
  ev_esyalari_bardak: [],
  ev_esyalari_caydanlik: [],
  ev_esyalari_tencere: []
};

images.forEach(img => {
  const name = img.Name;
  const nameLower = name.toLowerCase();
  
  // Skip copies
  if (nameLower.includes('copy') || nameLower.includes('kopya')) return;

  if (nameLower.includes('kadin_ayakkabi')) categories.kadin_ayakkabi.push(name);
  else if (nameLower.includes('erkek_ayakkabi')) categories.erkek_ayakkabi.push(name);
  else if (nameLower.includes('kadin_elbise')) categories.kadin_elbise.push(name);
  else if (nameLower.includes('erkek_elbise')) categories.erkek_elbise.push(name);
  else if (nameLower.includes('kadin_tisort')) categories.kadin_tisort.push(name);
  else if (nameLower.includes('erkek_tisort')) categories.erkek_tisort.push(name);
  else if (nameLower.includes('akilli_telefon') || nameLower.includes('telefon')) categories.akilli_telefon.push(name);
  else if (nameLower.includes('laptop') || nameLower.includes('labtop')) categories.laptop.push(name);
  else if (nameLower.includes('kulaklik')) categories.kulaklik.push(name);
  else if (nameLower.includes('televizyon')) categories.televizyon.push(name);
  else if (nameLower.includes('monitor')) categories.monitor.push(name);
  else if (nameLower.includes('kamera')) categories.kamera.push(name);
  else if (nameLower.includes('aksesuar_bileklik')) categories.aksesuar_bileklik.push(name);
  else if (nameLower.includes('aksesuar_kolye')) categories.aksesuar_kolye.push(name);
  else if (nameLower.includes('aksesuar_kolcantasi')) categories.aksesuar_kolcantasi.push(name);
  else if (nameLower.includes('aksesuar_yuzuk')) categories.aksesuar_yuzuk.push(name);
  else if (nameLower.includes('ev_esyalari_bardak')) categories.ev_esyalari_bardak.push(name);
  else if (nameLower.includes('ev_esyalari_caydanlik')) categories.ev_esyalari_caydanlik.push(name);
  else if (nameLower.includes('ev_esyalari_tencere')) categories.ev_esyalari_tencere.push(name);
});

// Sort naturally (by number)
function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

Object.keys(categories).forEach(key => {
  categories[key] = [...new Set(categories[key])].sort(naturalSort);
});

console.log(JSON.stringify(categories, null, 2));
