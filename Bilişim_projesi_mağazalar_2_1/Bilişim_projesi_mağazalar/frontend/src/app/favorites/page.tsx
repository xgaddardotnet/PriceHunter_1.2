"use client";
import { useState, useEffect } from "react";
import { Heart, Trash2, ShoppingCart, TrendingDown, Search, ArrowRight, Package, Zap, Sparkles, LayoutGrid } from "lucide-react";
import { favoritesAPI } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoritesAPI.getAll()
      .then((r) => setFavorites(r.data || []))
      .catch(() => toast.error("Favoriler yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = async (productId: number) => {
    try {
      await favoritesAPI.remove(productId);
      setFavorites((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Favorilerimden kaldırıldı");
    } catch {
      toast.error("İşlem başarısız");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-black selection:bg-rose-500/30">
      <div className="container max-w-7xl">
        {/* Premium Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-20">
          <div className="flex items-center gap-8">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              className="w-24 h-24 rounded-[36px] bg-linear-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-[0_20px_50px_-10px_rgba(244,63,94,0.5)] border border-white/20 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Heart size={40} fill="currentColor" className="relative z-10" />
            </motion.div>
            <div>
              <nav className="flex items-center gap-3 text-[10px] font-black text-slate-500 mb-4 uppercase tracking-[0.3em]">
                <Link href="/" className="hover:text-rose-400 transition-colors flex items-center gap-1"><Zap size={10} /> Ana Sayfa</Link>
                <span className="opacity-30">/</span>
                <span className="text-slate-300">Koleksiyonum</span>
              </nav>
              <h1 className="text-6xl font-black text-white tracking-tighter font-display mb-3">Koleksiyonum</h1>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-rose-500 animate-pulse" />
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                  {favorites.length} Özel Parça Takipte
                </span>
              </div>
            </div>
          </div>
          <Link href="/search" className="btn btn-secondary !py-5 !px-12 text-sm font-black uppercase tracking-widest flex items-center gap-3 group">
            <Search size={20} className="group-hover:scale-110 transition-transform" />
             Yeni Ürünleri Keşfet
          </Link>
        </div>

        {/* Dashboard Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass h-48 rounded-[48px] animate-pulse bg-white/5" />
            ))}
          </div>
        ) : favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
             <motion.div 
               whileHover={{ y: -5 }}
               className="glass p-10 rounded-[48px] border-white/5 bg-linear-to-br from-rose-500/10 to-transparent relative overflow-hidden group"
             >
                <div className="absolute top-0 left-0 w-2 h-full bg-rose-500/50" />
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                      <LayoutGrid size={24} />
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Toplam Kayıt</span>
                </div>
                <div className="text-7xl font-black text-white tracking-tighter mb-2">{favorites.length}</div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kayıtlı Favori Ürün</p>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="glass p-10 rounded-[48px] border-white/5 bg-linear-to-br from-emerald-500/10 to-transparent relative overflow-hidden group"
             >
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/50" />
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <TrendingDown size={24} />
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fırsat Oranı</span>
                </div>
                <div className="text-7xl font-black text-white tracking-tighter mb-2">
                   {Math.round((favorites.filter(p => (p.bestListing?.discount || 0) > 0).length / Math.max(1, favorites.length)) * 100)}%
                </div>
                <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-wider">İndirimdeki Ürünlerin Oranı</p>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="glass p-10 rounded-[48px] border-white/5 bg-linear-to-br from-indigo-500/10 to-transparent relative overflow-hidden group"
             >
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/50" />
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <ShoppingCart size={24} />
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tahmini Değer</span>
                </div>
                <div className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-2 pt-2">
                   {Math.round(favorites.reduce((s, p) => s + p.bestPrice, 0)).toLocaleString("tr-TR")}
                   <span className="text-xl font-bold text-slate-500 ml-2">₺</span>
                </div>
                <p className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-wider">Koleksiyon Toplam Değeri</p>
             </motion.div>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="product-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass h-[450px] rounded-[48px] animate-pulse bg-white/5 border-white/5" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-48 glass rounded-[80px] border-dashed border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-rose-500/5 to-transparent opacity-20" />
            <div className="w-32 h-32 rounded-[40px] bg-linear-to-br from-white/5 to-transparent flex items-center justify-center text-slate-800 mb-10 relative z-10 border border-white/5">
              <Package size={64} className="opacity-20" />
            </div>
            <h2 className="text-5xl font-black text-white mb-6 font-display tracking-tight relative z-10">Koleksiyonun henüz boş</h2>
            <p className="text-slate-500 max-w-sm text-center mb-12 font-medium leading-relaxed relative z-10">
              Favorilerine ürün ekleyerek fiyat düşüşlerini premium bir panelden takip edebilirsin.
            </p>
            <Link href="/search" className="btn btn-primary !py-6 !px-20 text-xl font-black tracking-tighter relative z-10 shadow-2xl hover:scale-105 transition-transform">
              Koleksiyonu Doldur <ArrowRight size={24} className="ml-3" />
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="product-grid"
          >
            <AnimatePresence mode="popLayout">
              {favorites.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  className="relative group"
                >
                  <ProductCard product={product} />
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all z-20 flex gap-2">
                    <button
                      onClick={() => removeFavorite(product.id)}
                      className="w-14 h-14 rounded-2xl glass bg-rose-500/90 text-white flex items-center justify-center hover:bg-rose-500 active:scale-90 shadow-2xl shadow-rose-500/40 border-rose-500/20 transition-all"
                      title="Koleksiyondan kaldır"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}


