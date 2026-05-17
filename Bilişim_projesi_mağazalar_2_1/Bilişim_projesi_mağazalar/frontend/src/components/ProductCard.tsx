"use client";
import Link from "next/link";
import { TrendingDown, Info, ShoppingCart, Award, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { getProductImage } from "@/lib/imageHelper";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  image: string;
  bestPrice: number;
  bestPlatform: string;
  listings?: any[];
  bestListing?: any;
  status?: string;
}

const CATEGORY_STYLES: Record<string, { gradient: string; icon: any }> = {
  'Akıllı Telefon': { gradient: 'from-blue-600/20 to-red-600/20', icon: <Sparkles className="text-red-400" size={20}/> },
  'Laptop': { gradient: 'from-red-600/20 to-blue-600/20', icon: <Sparkles className="text-blue-400" size={20}/> },
  'Kulaklık': { gradient: 'from-blue-500/20 to-rose-500/20', icon: <Sparkles className="text-rose-400" size={20}/> },
  'Televizyon': { gradient: 'from-rose-500/20 to-blue-500/20', icon: <Sparkles className="text-rose-300" size={20}/> },
  'Aksesuarlar': { gradient: 'from-slate-500/20 to-blue-500/20', icon: <Sparkles className="text-slate-300" size={20}/> },
  'Tablet': { gradient: 'from-cyan-500/20 to-blue-500/20', icon: <Sparkles className="text-cyan-400" size={20}/> },
  'Oyun Konsolu': { gradient: 'from-violet-500/20 to-blue-500/20', icon: <Sparkles className="text-violet-400" size={20}/> },
  'Kamera': { gradient: 'from-amber-500/20 to-red-500/20', icon: <Sparkles className="text-amber-400" size={20}/> },
  'Monitör': { gradient: 'from-blue-500/20 to-cyan-500/20', icon: <Sparkles className="text-blue-300" size={20}/> },
  'Akıllı Saat': { gradient: 'from-emerald-500/20 to-blue-500/20', icon: <Sparkles className="text-emerald-400" size={20}/> },
  'Elbise': { gradient: 'from-pink-500/20 to-purple-500/20', icon: <Sparkles className="text-pink-400" size={20}/> },
  'Ayakkabı': { gradient: 'from-amber-500/20 to-orange-500/20', icon: <Sparkles className="text-amber-400" size={20}/> },
  'Ev Eşyaları': { gradient: 'from-emerald-500/20 to-teal-500/20', icon: <Sparkles className="text-emerald-400" size={20}/> },
};

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.bestListing?.discount || 0;
  const style = CATEGORY_STYLES[product.category] || { gradient: 'from-slate-700/20 to-slate-900/20', icon: <Sparkles size={20}/> };
  const displayImage = getProductImage(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="product-card group"
    >
      <Link href={`/product/${product.id}`} className="flex flex-col h-full">
        {/* Image Showcase area */}
        <div className="relative h-72 w-full flex items-center justify-center bg-black overflow-hidden border-b border-white/5 transition-all duration-700">
          <div className={`absolute inset-0 bg-linear-to-br ${style.gradient} opacity-20 z-10`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] group-hover:scale-150 transition-transform duration-1000 z-10" />
          
          <img 
            src={displayImage} 
            alt={product.name} 
            className="w-full h-full object-contain p-8 relative z-20 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black to-transparent z-20 pointer-events-none" />


          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {discount > 0 && (
              <div className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.6)] uppercase tracking-tighter">
                <TrendingDown size={12} />%{discount} Fırsat
              </div>
            )}
            <div className="glass px-2.5 py-1 rounded-lg text-[10px] font-black text-white/70 bg-black/50 border-white/10 uppercase tracking-tighter shadow-md">
              {product.brand}
            </div>
            {product.status === 'LIVE' && (
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)] uppercase tracking-widest mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CANLI FİYAT
              </div>
            )}
          </div>

          <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
             <div className="w-10 h-10 rounded-xl bg-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] text-white flex items-center justify-center shadow-xl">
                <ChevronRight size={20} />
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 flex flex-col flex-1 bg-gradient-to-b from-transparent to-red-900/[0.03]">
          <div className="flex items-center gap-3 mb-5">
             <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-400/20 flex items-center justify-center">{style.icon}</div>
             <span className="text-[10px] font-black text-red-500/80 uppercase tracking-[0.2em]">{product.category}</span>
          </div>

          <h3 className="text-lg font-black text-white group-hover:text-red-400 transition-all line-clamp-2 break-words overflow-hidden text-ellipsis mb-8 min-h-[56px] font-display leading-tight tracking-tight">
            {product.name}
          </h3>

          <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between group-hover:border-red-500/20 transition-colors">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Mevcut En İyi</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white tracking-tighter">
                  {Math.round(product.bestPrice).toLocaleString('tr-TR')}
                </span>
                <span className="text-sm font-bold text-red-500/60">₺</span>
              </div>
            </div>

            {/* Platform Mini Cloud */}
            <div className="flex -space-x-2">
              {(product.listings || []).slice(0, 3).map((l: any) => (
                <div 
                  key={l.platformId}
                  className="w-10 h-10 rounded-2xl border-4 border-black bg-slate-800 flex items-center justify-center text-[10px] font-black text-white shadow-2xl transition-transform group-hover:-translate-y-1"
                  style={{ backgroundColor: l.platform.color }}
                  title={l.platform.name}
                >
                  {l.platformId[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

