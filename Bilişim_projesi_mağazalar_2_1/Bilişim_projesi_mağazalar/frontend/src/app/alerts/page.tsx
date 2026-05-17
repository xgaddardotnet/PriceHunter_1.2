"use client";
import { useState, useEffect } from "react";
import { Bell, Trash2, TrendingDown, CheckCircle, AlertCircle, Search, Plus, Calendar, ArrowUpRight, Package, Mail, Zap, Radio } from "lucide-react";
import { alertsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { getProductImage } from "@/lib/imageHelper";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alertsAPI.getAll()
      .then((r) => setAlerts(r.data || []))
      .catch(() => toast.error("Alarmlar yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  const deleteAlert = async (alertId: number) => {
    try {
      await alertsAPI.delete(alertId);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      toast.success("Takip alarmı silindi");
    } catch {
      toast.error("İşlem başarısız");
    }
  };

  const triggeredAlerts = alerts.filter((a) => a.triggered);
  const activeAlerts = alerts.filter((a) => !a.triggered);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-20">
          <div className="flex items-center gap-8">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              className="w-24 h-24 rounded-[36px] bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_20px_50px_-10px_rgba(99,102,241,0.5)] border border-white/20 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bell size={40} className="relative z-10" />
            </motion.div>
            <div>
              <nav className="flex items-center gap-3 text-[10px] font-black text-slate-500 mb-4 uppercase tracking-[0.3em]">
                <Link href="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1"><Zap size={10} /> Ana Sayfa</Link>
                <span className="opacity-30">/</span>
                <span className="text-slate-300">Fiyat Takibi</span>
              </nav>
              <h1 className="text-6xl font-black text-white tracking-tighter font-display mb-3">Alarmlarım</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                  {alerts.length} Aktif Takip Yapılıyor
                </span>
              </div>
            </div>
          </div>
          <Link href="/search" className="btn btn-primary !py-5 !px-12 text-sm font-black uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(239,68,68,0.4)] flex items-center gap-3 group">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
             Yeni Takip Başlat
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="glass p-8 rounded-[32px] animate-pulse bg-white/5 border-white/5 h-40" />
             ))}
          </div>
        ) : alerts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-40 glass rounded-[64px] border-dashed border-white/10"
          >
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-white/5 to-transparent flex items-center justify-center text-slate-800 mb-10">
              <Bell size={64} className="opacity-10" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 font-display">Henüz alarm kurmamışsınız</h2>
            <p className="text-slate-500 max-w-sm text-center mb-12 font-medium leading-relaxed">
              Fiyatı düşmesini beklediğiniz ürünler için alarm kurarak fırsatı kaçırmayın.
            </p>
            <Link href="/search" className="btn btn-secondary !py-5 !px-16 text-xl">
              Ürünleri İncele
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-16">
            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="glass p-10 rounded-[48px] border-white/5 bg-linear-to-br from-emerald-500/10 to-transparent relative overflow-hidden group"
               >
                  <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/50" />
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle size={24} />
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tetiklenen</span>
                  </div>
                  <div className="text-7xl font-black text-white tracking-tighter mb-2">{triggeredAlerts.length}</div>
                  <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-wider">Hedef Fiyata Ulaşanlar</p>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all" />
               </motion.div>

               <motion.div 
                 whileHover={{ y: -5 }}
                 className="glass p-10 rounded-[48px] border-white/5 bg-linear-to-br from-indigo-500/10 to-transparent relative overflow-hidden group"
               >
                  <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/50" />
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <AlertCircle size={24} />
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Takipte</span>
                  </div>
                  <div className="text-7xl font-black text-white tracking-tighter mb-2">{activeAlerts.length}</div>
                  <p className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-wider">İşlem Devam Edenler</p>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all" />
               </motion.div>

               <div className="glass p-10 rounded-[48px] border-white/5 bg-linear-to-br from-slate-800/20 to-transparent relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
                        <Radio size={24} className="animate-pulse" />
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bildirim Kanalları</span>
                  </div>
                  <div className="flex flex-col gap-5">
                     <div className="flex items-center justify-between group cursor-help">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all"><Mail size={18}/></div>
                           <span className="text-xs font-black text-slate-300 uppercase tracking-wider">E-Posta</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black border border-emerald-500/20">AKTİF</span>
                     </div>
                     <div className="flex items-center justify-between group cursor-help">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all"><Radio size={18}/></div>
                           <span className="text-xs font-black text-slate-300 uppercase tracking-wider">Telegram</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-white/5 text-slate-500 text-[8px] font-black border border-white/10">YAKINDA</span>
                     </div>
                  </div>
               </div>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-16"
            >
              {/* Triggered Section */}
              {triggeredAlerts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-black text-white mb-8 px-2 flex items-center gap-3 font-display">
                    <TrendingDown className="text-emerald-500" />
                    Fırsat Yakalananlar
                  </h2>
                  <div className="space-y-6">
                    {triggeredAlerts.map((alert) => (
                      <AlertCard key={alert.id} alert={alert} onDelete={deleteAlert} triggered />
                    ))}
                  </div>
                </section>
              )}

              {/* Active Section */}
              {activeAlerts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-black text-white mb-8 px-2 flex items-center gap-3 font-display">
                    <ArrowUpRight className="text-indigo-500" />
                    Takibi Devam Edenler
                  </h2>
                  <div className="space-y-6">
                    {activeAlerts.map((alert) => (
                      <AlertCard key={alert.id} alert={alert} onDelete={deleteAlert} />
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertCard({ alert, onDelete, triggered = false }: {
  alert: any;
  onDelete: (id: number) => void;
  triggered?: boolean;
}) {
  const product = alert.product;
  const priceDiff = product ? product.bestPrice - alert.targetPrice : 0;
  const priceDiffPct = product ? Math.round((priceDiff / alert.targetPrice) * 100) : 0;
  const displayImage = product ? getProductImage(product) : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-10 rounded-[56px] flex flex-col lg:flex-row items-center gap-12 group transition-all duration-700 ${triggered ? 'border-emerald-500/30 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] bg-linear-to-br from-emerald-500/5 to-transparent' : 'border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.02]'}`}
    >
      {/* Product Image Wrapper */}
      <div className="relative group/img">
        <div className="w-36 h-36 rounded-[48px] bg-slate-950/60 flex items-center justify-center p-6 shrink-0 relative overflow-hidden border border-white/5 group-hover:border-indigo-500/30 transition-all duration-500 shadow-2xl">
          <img 
            src={displayImage} 
            alt={product?.name || "Product"} 
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover/img:scale-110 transition-transform duration-700" 
          />
          {triggered && (
            <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/20 to-transparent animate-pulse" />
          )}
          <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
        </div>
        {triggered && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] z-20"
          >
            <CheckCircle size={20} />
          </motion.div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0 text-center lg:text-left space-y-6">
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
           <span className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">
             {product?.category || "Genel"}
           </span>
           <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
             <Calendar size={12} className="text-indigo-500" />
             {new Date(alert.createdAt).toLocaleDateString("tr-TR")}
           </div>
        </div>

        <Link href={product ? `/product/${product.id}` : "#"}>
           <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors font-display tracking-tight leading-tight line-clamp-1">
             {product?.name || `Ürün #${alert.productId}`}
           </h3>
        </Link>

        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-12 pt-2">
           <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Hedef Fiyat</span>
              <span className="text-3xl font-black text-indigo-400 tracking-tighter">
                {alert.targetPrice.toLocaleString("tr-TR")} 
                <span className="text-sm font-bold ml-1 opacity-60">₺</span>
              </span>
           </div>

           <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Şu Anki Fiyat</span>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-black tracking-tighter ${triggered ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-white'}`}>
                  {Math.round(product?.bestPrice || 0).toLocaleString("tr-TR")} 
                  <span className="text-sm font-bold ml-1 opacity-60">₺</span>
                </span>
                {!triggered && (
                   <span className={`text-[10px] font-black px-2 py-1 rounded-md ${priceDiff > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                     {priceDiff > 0 ? `+${priceDiffPct}%` : `${priceDiffPct}%`}
                   </span>
                )}
              </div>
           </div>
           
           {!triggered && (
              <div className="flex-1 max-w-[200px] space-y-3">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <span>Hedef İlerleyişi</span>
                  <span className="text-indigo-400">%{Math.max(0, 100 - priceDiffPct)}</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(5, 100 - (priceDiffPct || 0))}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-linear-to-r from-indigo-600 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                   />
                </div>
              </div>
           )}

           {triggered && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
              >
                <Zap size={16} className="animate-pulse" /> ALARM TETİKLENDİ
              </motion.div>
           )}
        </div>
      </div>

      {/* Action Hub */}
      <div className="flex flex-row lg:flex-col items-center gap-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-10">
         {product && (
            <Link 
              href={`/product/${product.id}`}
              className="w-16 h-16 rounded-[24px] glass flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all border-white/5 group/btn"
            >
              <ArrowUpRight size={28} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </Link>
         )}
         <button
            onClick={() => onDelete(alert.id)}
            className="w-16 h-16 rounded-[24px] glass bg-rose-500/5 text-rose-500/50 flex items-center justify-center hover:bg-rose-500 hover:text-white hover:shadow-[0_10px_30px_rgba(244,63,94,0.4)] transition-all border-white/5"
            title="Alarmı kaldır"
         >
           <Trash2 size={24} />
         </button>
      </div>
    </motion.div>
  );
}

