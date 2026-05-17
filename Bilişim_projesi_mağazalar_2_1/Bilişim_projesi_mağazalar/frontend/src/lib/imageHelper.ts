import imageManifest from './imageManifest.json';

export const getProductImage = (product: { category: string; name: string; image?: string; id?: number }) => {
  const nameLower = product.name.toLowerCase();
  const id = product.id || 0;

  // Gender Detection
  const isKadin = nameLower.includes('kadın') || nameLower.includes('women') || nameLower.includes('kız');

  // Exact image lists from manifest
  const images: any = imageManifest;

  // 1. Fashion & Clothing Logic
  if (product.category === 'Ayakkabı' || nameLower.includes('ayakkabı')) {
    const list = isKadin ? images.kadin_ayakkabi : images.erkek_ayakkabi;
    return `/magaza_resimler/${list[id % list.length]}`;
  }

  if (product.category === 'Elbise' || nameLower.includes('elbise') || nameLower.includes('jean') || nameLower.includes('pantolon')) {
    const list = isKadin ? images.kadin_elbise : images.erkek_elbise;
    return `/magaza_resimler/${list[id % list.length]}`;
  }

  if (product.category === 'Tişört' || nameLower.includes('tişört') || nameLower.includes('t-shirt') || nameLower.includes('sweatshirt')) {
    const list = isKadin ? images.kadin_tisort : images.erkek_tisort;
    return `/magaza_resimler/${list[id % list.length]}`;
  }

  // 2. Tech Logic
  if (product.category === 'Akıllı Telefon' || nameLower.includes('telefon')) {
    const list = images.akilli_telefon;
    return `/magaza_resimler/${list[id % list.length]}`;
  }

  if (product.category === 'Laptop' || nameLower.includes('laptop') || nameLower.includes('bilgisayar')) {
    const list = images.laptop;
    return `/magaza_resimler/${list[id % list.length]}`;
  }

  if (product.category === 'Kulaklık' || nameLower.includes('kulaklık')) {
    const list = images.kulaklik;
    return `/magaza_resimler/${list[id % list.length]}`;
  }

  if (product.category === 'Televizyon' || nameLower.includes('televizyon') || nameLower.includes('tv')) {
    const list = images.televizyon;
    return `/magaza_resimler/${list[id % list.length]}`;
  }

  if (nameLower.includes('monitor') || nameLower.includes('monitör')) {
    const list = images.monitor;
    return `/magaza_resimler/${list[id % list.length]}`;
  }

  if (nameLower.includes('kamera') || nameLower.includes('camera')) {
    const list = images.kamera;
    return `/magaza_resimler/${list[id % list.length]}`;
  }

  // 3. Accessories Logic
  if (nameLower.includes('bileklik')) return `/magaza_resimler/${images.aksesuar_bileklik[id % images.aksesuar_bileklik.length]}`;
  if (nameLower.includes('kolye')) return `/magaza_resimler/${images.aksesuar_kolye[id % images.aksesuar_kolye.length]}`;
  if (nameLower.includes('çanta')) return `/magaza_resimler/${images.aksesuar_kolcantasi[id % images.aksesuar_kolcantasi.length]}`;
  if (nameLower.includes('yüzük')) return `/magaza_resimler/${images.aksesuar_yuzuk[id % images.aksesuar_yuzuk.length]}`;

  // 4. Home Goods
  if (nameLower.includes('bardak')) return `/magaza_resimler/${images.ev_esyalari_bardak[id % images.ev_esyalari_bardak.length]}`;
  if (nameLower.includes('çaydanlık')) return `/magaza_resimler/${images.ev_esyalari_caydanlik[id % images.ev_esyalari_caydanlik.length]}`;
  if (nameLower.includes('tencere')) return `/magaza_resimler/${images.ev_esyalari_tencere[id % images.ev_esyalari_tencere.length]}`;

  return product.image || '/magaza_resimler/laptop.jpg';
};
