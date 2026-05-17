"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShieldCheck, Zap, Server, BarChart3, Radio, Cpu, Power, MoveRight, Shirt, Footprints, Sofa, Bell, LayoutGrid } from "lucide-react";
import { productsAPI, statsAPI } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const CATEGORIES = [
  { name: 'Akıllı Telefon', icon: <Radio size={32} strokeWidth={1.5} />, color: 'from-blue-500/20 to-red-500/20' },
  { name: 'Laptop', icon: <Cpu size={32} strokeWidth={1.5} />, color: 'from-red-500/20 to-blue-600/20' },
  { name: 'Kulaklık', icon: <Zap size={32} strokeWidth={1.5} />, color: 'from-blue-400/20 to-rose-500/20' },
  { name: 'Televizyon', icon: <Server size={32} strokeWidth={1.5} />, color: 'from-rose-400/20 to-blue-500/20' },
  { name: 'Aksesuarlar', icon: <Power size={32} strokeWidth={1.5} />, color: 'from-blue-500/20 to-red-400/20' },
  { name: 'Elbise', icon: <Shirt size={32} strokeWidth={1.5} />, color: 'from-pink-500/20 to-purple-500/20' },
  { name: 'Ayakkabı', icon: <Footprints size={32} strokeWidth={1.5} />, color: 'from-amber-500/20 to-orange-500/20' },
  { name: 'Ev Eşyaları', icon: <Sofa size={32} strokeWidth={1.5} />, color: 'from-emerald-500/20 to-teal-500/20' },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      productsAPI.getAll(),
      statsAPI.getStats()
    ]).then(([prodRes, statsRes]) => {
      setProducts(prodRes.data.slice(0, 8));
      setStats(statsRes.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black selection:bg-red-500/30">
      {/* Hero Section - Ultra Premium */}
      <section className="relative pt-32 pb-40 md:pt-48 md:pb-56 overflow-hidden flex items-center justify-center min-h-screen">
        {/* Dynamic Aurora Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-blue-600/10 blur-[180px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-5%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-purple-600/5 blur-[150px] rounded-full" />
        </div>

        <div className="w-full max-w-7xl mx-auto px-10 relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-xl"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Yeni Nesil Fiyat Analizi Yayında</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl md:text-[10rem] font-black mb-16 tracking-tighter leading-[0.85] font-display text-white"
          >
            Mükemmel Fiyat <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-purple-500 to-blue-600 italic">Seni Bekliyor.</span>
          </motion.h1>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            onSubmit={handleSearch} 
            className="w-full max-w-4xl relative group"
          >
            <div className="relative glass p-3 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-white/5 focus-within:border-red-500/30 transition-all duration-700">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 flex items-center h-20">
                  <Search className="absolute left-8 text-slate-500 group-focus-within:text-red-500 transition-colors" size={28} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Laptop, Ayakkabı veya bir marka yazın..."
                    className="w-full h-full bg-transparent border-none pl-20 pr-8 outline-none text-2xl font-black text-white placeholder:text-slate-800"
                  />
                </div>
                <button type="submit" className="btn btn-primary !rounded-[32px] !py-0 h-20 !px-16 text-xl font-black tracking-tighter shadow-2xl flex items-center justify-center gap-4 group/btn">
                   <span>ŞİMDİ BUL</span>
                   <MoveRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
            {/* Search Suggestions */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 opacity-40 group-focus-within:opacity-100 transition-opacity">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Popüler:</span>
               {['iPhone 15', 'RTX 4090', 'Air Jordan', 'OLED TV'].map(s => (
                 <button key={s} onClick={() => { setQuery(s); }} className="text-[10px] font-black text-slate-300 hover:text-red-500 transition-colors uppercase tracking-widest underline underline-offset-4 decoration-white/10">{s}</button>
               ))}
            </div>
          </motion.form>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-12 md:gap-40 mt-32 border-t border-white/5 pt-16"
          >
            <StatItem value="4,000+" label="Canlı Ürün" />
            <StatItem value="4" label="Büyük Mağaza" />
            <StatItem value="15dk" label="Yenileme Hızı" />
          </motion.div>

        </div>
      </section>

      {/* Categories Grid - Clean & Organized */}
      <section className="py-40 border-b border-white/5 bg-white/[0.01]">
        <div className="container max-w-7xl px-6">
           <div className="grid grid-cols-4 md:grid-cols-8 gap-12">
              {CATEGORIES.map((cat, i) => (
                <Link 
                  key={i} 
                  href={`/search?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className={`w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white transition-all duration-500 border border-white/5 group-hover:border-red-500/30 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]`}>
                    {cat.icon}
                  </div>
                  <span className="text-[9px] font-black text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest text-center">{cat.name}</span>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Why PriceHunter Section */}
      <section className="py-80 relative">
        <div className="container max-w-7xl px-6">
           <div className="text-center mb-24 md:mb-40">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.6em] mb-6 block">Neden PriceHunter?</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter font-display leading-tight">Alışverişin Yeni Kuralları</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <WhyCard 
                icon={<BarChart3 size={40} />} 
                title="Yapay Zeka Analizi" 
                desc="Milyonlarca veri noktasını saniyeler içinde işleyerek fiyat trendlerini tahmin ederiz."
                color="blue"
              />
              <WhyCard 
                icon={<Bell size={40} />} 
                title="Anlık Uyarılar" 
                desc="Takip ettiğiniz ürün hedef fiyata düştüğü an e-posta ve push bildirimleri göndeririz."
                color="red"
              />
              <WhyCard 
                icon={<ShieldCheck size={40} />} 
                title="Tarafsız Karşılaştırma" 
                desc="Hiçbir mağazanın tarafını tutmadan, sizin için en avantajlı olanı dürüstçe gösteririz."
                color="emerald"
              />
           </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-80 bg-white/[0.01] border-y border-white/5">
        <div className="w-full max-w-[94%] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-20 mb-40">
            <div>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-0.5 bg-red-500" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">Haftanın Fırsatları</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter font-display leading-tight">Göz Atmanız Gerekenler</h2>
            </div>
            <Link href="/search" className="btn btn-secondary !py-8 !px-20 text-xs font-black uppercase tracking-widest flex items-center gap-6 group shadow-2xl">
               TÜM KATALOG <LayoutGrid size={24} className="group-hover:rotate-90 transition-transform duration-700" />
            </Link>
          </div>

          {loading ? (
            <div className="product-grid">
               {[...Array(4)].map((_, i) => (
                <div key={i} className="glass h-96 rounded-[48px] animate-pulse bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>


    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl font-black text-white tracking-tighter mb-2">{value}</span>
      <span className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em]">{label}</span>
    </div>
  );
}

function WhyCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="glass p-8 md:p-10 rounded-[40px] border-white/5 bg-linear-to-b from-white/[0.02] to-transparent hover:border-red-500/20 transition-all group overflow-hidden flex flex-col"
    >
      <div className={`w-20 h-20 rounded-[24px] bg-white/5 flex items-center justify-center mb-8 text-slate-500 group-hover:text-red-500 transition-colors duration-500 shadow-2xl shrink-0`}>
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-black text-white mb-4 tracking-tight font-display break-words">{title}</h3>
      <p className="text-sm text-slate-400 font-medium leading-relaxed break-words">{desc}</p>
    </motion.div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-6 group">
      <div className="w-20 h-20 rounded-[28px] glass flex items-center justify-center bg-red-900/10 border-red-500/20 group-hover:bg-red-500/10 group-hover:border-red-400/50 transition-all duration-500 shadow-[0_0_20px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">{desc}</p>
      </div>
    </div>
  );
}
