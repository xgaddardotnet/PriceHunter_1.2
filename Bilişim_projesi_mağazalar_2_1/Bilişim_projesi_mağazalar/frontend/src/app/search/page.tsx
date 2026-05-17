"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Filter, SlidersHorizontal, Search, X, ChevronDown, LayoutGrid, List, SortAsc, AlertCircle, Zap } from "lucide-react";
import { searchAPI } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "bestPrice");
  const [selectedPlatform, setSelectedPlatform] = useState(searchParams.get("platform") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);

  const platforms = [
    { id: "", label: "Tüm Mağazalar" },
    { id: "amazon", label: "Amazon" },
    { id: "trendyol", label: "Trendyol" },
    { id: "n11", label: "N11" },
    { id: "hepsiburada", label: "Hepsiburada" },
  ];
  
  const sortOptions = [
    { value: "bestPrice", label: "En Düşük Fiyat" },
    { value: "bestPrice_desc", label: "En Yüksek Fiyat" },
    { value: "discount", label: "En Yüksek İndirim" },
    { value: "rating", label: "En Yüksek Puan" },
  ];

  useEffect(() => {
    searchAPI.categories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLocalQuery(query);
    setLoading(true);
    const params: Record<string, string> = { sortBy };
    if (selectedCategory) params.category = selectedCategory;
    if (selectedPlatform) params.platform = selectedPlatform;
    
    searchAPI.search(query, params)
      .then((r) => { 
        setResults(r.data.results || []); 
        setTotal(r.data.total || 0); 
      })
      .catch(() => { 
        setResults([]); 
        setTotal(0); 
      })
      .finally(() => setLoading(false));
  }, [query, selectedCategory, sortBy, selectedPlatform]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localQuery.trim()) params.set("q", localQuery.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedPlatform) params.set("platform", selectedPlatform);
    if (sortBy) params.set("sortBy", sortBy);
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedPlatform("");
    setSortBy("bestPrice");
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-black selection:bg-blue-500/30">
      <div className="container max-w-7xl px-6">
        {/* Advanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
          <div className="space-y-4">
            <nav className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-blue-400 transition-colors">Ana Sayfa</Link>
              <span className="opacity-30">/</span>
              <span className="text-slate-300">Akıllı Katalog</span>
            </nav>
            <h1 className="text-6xl font-black text-white tracking-tighter font-display leading-none">
              {query ? (
                <>
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-red-500 italic">"{query}"</span>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4 bg-white/5 py-2 px-4 rounded-full w-fit border border-white/5">
                    {total} Eşleşen Ürün Bulundu
                  </div>
                </>
              ) : (
                "Ürün Kataloğu"
              )}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             {/* Global Search Input within page */}
             <form onSubmit={handleSearch} className="relative group w-full lg:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Katalogda ara..."
                  className="w-full bg-white/5 border border-white/5 rounded-[24px] py-4 pl-16 pr-6 text-sm font-black text-white outline-none focus:border-blue-500/50 transition-all"
                />
             </form>
             <div className="relative group h-full">
                <div className="absolute inset-0 bg-blue-500 opacity-10 blur-xl group-hover:opacity-20 transition-opacity" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="relative glass !rounded-[24px] !py-4 !pl-8 !pr-14 appearance-none outline-none cursor-pointer text-xs font-black uppercase tracking-widest text-slate-300 border-white/10 hover:border-blue-500/50 transition-all"
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
                </select>
                <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
           {/* Sidebar Filters */}
           <aside className="lg:w-80 space-y-10">
              <div className="glass p-10 rounded-[48px] border-white/5 sticky top-32">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                       <Filter size={14} className="text-blue-500" /> Filtreler
                    </h3>
                    <button onClick={clearFilters} className="text-[10px] font-black text-rose-500 hover:text-white transition-colors uppercase tracking-widest">TEMİZLE</button>
                 </div>

                 <div className="space-y-12">
                    {/* Category Filter */}
                    <div className="space-y-6">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategoriler</span>
                       <div className="flex flex-col gap-2">
                          <FilterButton 
                            label="Tüm Kategoriler" 
                            active={!selectedCategory} 
                            onClick={() => setSelectedCategory("")} 
                          />
                          {categories.map(cat => (
                            <FilterButton 
                              key={cat}
                              label={cat} 
                              active={selectedCategory === cat} 
                              onClick={() => setSelectedCategory(cat)} 
                            />
                          ))}
                       </div>
                    </div>

                    {/* Platform Filter */}
                    <div className="space-y-6">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mağazalar</span>
                       <div className="grid grid-cols-1 gap-2">
                          {platforms.map(p => (
                            <FilterButton 
                              key={p.id}
                              label={p.label} 
                              active={selectedPlatform === p.id} 
                              onClick={() => setSelectedPlatform(p.id)} 
                            />
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 pt-10 border-t border-white/5">
                    <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20">
                       <div className="flex items-center gap-3 mb-3 text-blue-400">
                          <Zap size={16} fill="currentColor" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Akıllı İpucu</span>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                          En yüksek indirime sahip ürünleri görmek için sıralamayı 'En Yüksek İndirim' yapın.
                       </p>
                    </div>
                 </div>
              </div>
           </aside>

           {/* Results Grid */}
           <main className="flex-1">
              {loading ? (
                <div className="product-grid">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="glass h-[450px] rounded-[48px] animate-pulse bg-white/5 border-white/5" />
                  ))}
                </div>
              ) : results.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="product-grid"
                >
                  {results.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-40 glass rounded-[80px] border-dashed border-white/10 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent" />
                  <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center text-slate-700 mb-8 relative z-10 border border-white/5">
                    <Search size={48} className="opacity-20" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4 tracking-tighter relative z-10">Sonuç Bulunamadı</h2>
                  <p className="text-slate-500 max-w-sm text-center mb-10 font-medium leading-relaxed relative z-10 uppercase text-[10px] tracking-widest">
                    Aradığınız kriterlere uygun ürünleri yapay zekamız şu an bulamıyor.
                  </p>
                  <button onClick={clearFilters} className="btn btn-primary !py-5 !px-12 text-sm font-black tracking-widest relative z-10 shadow-2xl">
                    ARAMAYI SIFIRLA
                  </button>
                </motion.div>
              )}
           </main>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: any }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-3.5 rounded-2xl text-[10px] font-black text-left transition-all uppercase tracking-widest relative overflow-hidden ${active ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/30' : 'bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white'}`}
    >
       {active && <motion.div layoutId="filter-bg" className="absolute inset-0 bg-blue-500 -z-10" />}
       {label}
    </button>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <SearchContent />
    </Suspense>
  );
}

