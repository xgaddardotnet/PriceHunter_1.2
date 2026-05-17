"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, Bell, ExternalLink, Star, TrendingDown, TrendingUp, 
  Minus, ChevronLeft, X, ImageIcon, ShieldCheck, Zap, Award, Share2, AlertCircle
} from "lucide-react";
import { productsAPI, alertsAPI, favoritesAPI, reviewsAPI } from "@/lib/api";
import PriceChart from "@/components/PriceChart";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { getProductImage } from "@/lib/imageHelper";

const PLATFORM_ICONS: Record<string, string> = {
  amazon: "A", trendyol: "T", n11: "n11", hepsiburada: "H",
};

const PLATFORM_COLORS: Record<string, string> = {
  amazon: "#FF9900", trendyol: "#F27A1A", n11: "#8b5cf6", hepsiburada: "#FF6000",
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAlarm, setShowAlarm] = useState(false);
  const [alarmPrice, setAlarmPrice] = useState("");
  const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiResult, setShowAiResult] = useState(false);

  const handleAiAnalysis = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setShowAiResult(true);
    }, 2000);
  };

  useEffect(() => {
    if (!id) return;
    const productId = parseInt(id);
    Promise.all([
      productsAPI.getById(productId),
      productsAPI.getHistory(productId),
      productsAPI.getPredict(productId),
      reviewsAPI.getByProduct(productId),
      favoritesAPI.check(productId),
    ]).then(([prod, hist, pred, rev, fav]) => {
      setProduct(prod.data);
      setHistory(hist.data || []);
      setPrediction(pred.data?.prediction || null);
      setReviews(rev.data?.reviews || []);
      setAvgRating(rev.data?.avgRating || 0);
      setIsFav(fav.data?.isFavorite || false);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const toggleFav = async () => {
    try {
      if (isFav) {
        await favoritesAPI.remove(parseInt(id));
        setIsFav(false);
        toast.success("Favorilerimden çıkarıldı");
      } else {
        await favoritesAPI.add(parseInt(id));
        setIsFav(true);
        toast.success("Favorilerime eklendi ❤️");
      }
    } catch { toast.error("İşlem başarısız oldu"); }
  };

  const setAlarm = async () => {
    const price = parseFloat(alarmPrice);
    if (!price || price <= 0) return toast.error("Lütfen geçerli bir fiyat girin");
    try {
      await alertsAPI.create(parseInt(id), price);
      toast.success(`${price.toLocaleString("tr-TR")} ₺ alarmı aktif edildi 🔔`);
      setShowAlarm(false);
      setAlarmPrice("");
    } catch { toast.error("Alarm oluşturulurken bir hata oluştu"); }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return toast.error("Tüm alanları doldurun");
    setSubmittingReview(true);
    try {
      const res = await reviewsAPI.create(parseInt(id), newReview);
      setReviews((prev) => [res.data.review, ...prev]);
      setNewReview({ userName: "", rating: 5, comment: "" });
      toast.success("Değerlendirmeniz için teşekkürler!");
    } catch { toast.error("Yorum iletilemedi"); }
    finally { setSubmittingReview(false); }
  };

  const displayImage = product ? getProductImage(product) : "";

  if (loading) return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="mt-4 text-slate-400 font-bold tracking-widest animate-pulse">VERİLER HAZIRLANIYOR...</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
      <AlertCircle className="w-16 h-16 text-rose-500 mb-4 opacity-20" />
      <h2 className="text-2xl font-bold">Ürün Bulunamadı</h2>
      <button onClick={() => router.push("/")} className="btn btn-primary mt-6">Ana Sayfaya Dön</button>
    </div>
  );

  const sortedListings = [...(product.listings || [])].sort((a: any, b: any) => a.currentPrice - b.currentPrice);
  const bestListing = sortedListings[0];
  const trendIcon = prediction?.trend === "falling" ? <TrendingDown className="text-emerald-400" /> : prediction?.trend === "rising" ? <TrendingUp className="text-rose-400" /> : <Minus className="text-amber-400" />;

  return (
    <div className="min-h-screen pt-32 pb-32 bg-black selection:bg-emerald-500/30">
      <div className="container max-w-7xl px-6">
        {/* Superior Breadcrumb */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.3em] group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
               <ChevronLeft size={16} />
            </div>
            Geri Dön
          </button>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <Share2 size={18} />
            </button>
            <button 
              onClick={toggleFav}
              className={`w-12 h-12 rounded-2xl glass border-white/5 transition-all flex items-center justify-center ${isFav ? 'bg-rose-500/20 text-rose-500 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'text-slate-400 hover:text-white'}`}
            >
              <Heart size={20} fill={isFav ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Cinematic Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Visual Area */}
          <div className="lg:col-span-5 relative group">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass !rounded-[64px] border-white/5 flex items-center justify-center relative min-h-[500px] lg:min-h-[650px] overflow-hidden"
            >
              {/* Dynamic Gradients */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-600/5 to-purple-600/5" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)]" />
              <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              
              <div className="relative z-10 w-full h-full">
                <motion.img
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 relative z-10 opacity-80 group-hover:opacity-100 transition-all duration-1000"
                />
              </div>

              {bestListing?.discount > 0 && (
                <div className="absolute top-10 left-10 z-20">
                   <div className="flex flex-col gap-2">
                      <div className="bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] shadow-[0_15px_30px_rgba(16,185,129,0.4)] uppercase tracking-[0.2em]">
                         %{bestListing.discount} Süper Fırsat
                      </div>
                      <div className="bg-black/60 backdrop-blur-md text-white/50 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/5">
                         {product.brand}
                      </div>
                   </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Info Area */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">{product.category}</span>
                <div className="w-1 h-1 rounded-full bg-slate-800" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{product.brand} Collection</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight font-display">{product.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 bg-amber-500/5 px-4 py-2 rounded-2xl border border-amber-500/10">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} fill={s <= Math.round(avgRating) ? "#fbbf24" : "none"} stroke={s <= Math.round(avgRating) ? "#fbbf24" : "rgba(255,255,255,0.1)"} />
                  ))}
                  <span className="text-lg font-black text-amber-500 ml-2">{avgRating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{reviews.length} Değerlendirme</span>
              </div>
            </motion.div>

            {/* Price Master Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-10 rounded-[48px] border-white/5 bg-linear-to-br from-emerald-500/10 to-transparent relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Award size={120} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Güncel En İyi Fiyat</span>
                <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Canlı Mağaza Verisi</span>
                </div>
              </div>
              <div className="flex items-end gap-4 mb-10">
                <span className="text-7xl font-black text-white tracking-tighter leading-none">
                  {Math.round(bestListing?.currentPrice || 0).toLocaleString("tr-TR")}
                  <span className="text-2xl font-bold text-slate-500 ml-3">₺</span>
                </span>
                {bestListing?.discount > 0 && (
                  <span className="text-2xl text-slate-700 line-through mb-2 font-black italic">
                    {(Math.round(bestListing.currentPrice / (1 - bestListing.discount/100))).toLocaleString("tr-TR")}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <a 
                  href={bestListing?.url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary flex-1 !py-8 text-xl font-black tracking-tighter shadow-2xl shadow-red-500/40 group/buy"
                  onClick={(e) => { if(!bestListing?.url) e.preventDefault(); }}
                >
                  ŞİMDİ SATIN AL <ExternalLink size={24} className="ml-4 group-hover/buy:translate-x-2 group-hover/buy:-translate-y-2 transition-transform duration-500" />
                </a>
                <button 
                  onClick={() => setShowAlarm(true)}
                  className="btn btn-secondary !py-6 !px-10 text-xl font-black tracking-tighter group/alert"
                >
                  <Bell size={24} className="mr-3 group-hover/alert:rotate-12 transition-transform" /> ALARM KUR
                </button>
              </div>
            </motion.div>

            {/* Interactive AI Insights Area */}
            {prediction && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                {!showAiResult && !isAiLoading && (
                  <button 
                    onClick={handleAiAnalysis}
                    className="w-full glass p-8 rounded-[40px] border-blue-500/30 bg-linear-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 flex flex-col md:flex-row items-center justify-center gap-6 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Zap size={32} />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-black text-white mb-1">Yapay Zeka Fiyat Analizi</h3>
                      <p className="text-xs text-slate-400 font-bold">Gelecekteki fiyat trendini görmek için tıklayın</p>
                    </div>
                  </button>
                )}

                {isAiLoading && (
                  <div className="w-full glass p-8 rounded-[40px] border-blue-500/30 bg-blue-900/10 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-black text-blue-400 uppercase tracking-widest animate-pulse">
                      Yapay Zeka Analiz Ediyor...
                    </span>
                  </div>
                )}

                {showAiResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-[40px] border-blue-500/20 bg-linear-to-br from-blue-500/5 to-transparent flex flex-col md:flex-row gap-8 items-center"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
                      <Zap size={40} fill="currentColor" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        {trendIcon}
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">AI Trend Analizi Sonucu</span>
                      </div>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        Yapay zeka asistanımız bu ürünün fiyatının <span className="text-white font-black">{prediction.daysAhead} gün</span> içinde <span className="text-emerald-400 font-black">{Math.round(prediction.predictedPrice).toLocaleString("tr-TR")} ₺</span> seviyesine inmesini bekliyor.
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center px-10 py-4 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                      <div className="text-4xl font-black text-blue-500">%{prediction.confidence}</div>
                      <div className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em] mt-1">Güven Skoru</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>


        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Comparison Table */}
          <div className="lg:col-span-2 space-y-8">
             <div className="glass p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-black text-white">Fiyat Karşılaştırması</h2>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      Güvenilir Platformlar
                   </div>
                </div>
                <div className="space-y-3">
                   {sortedListings.map((l: any, i: number) => (
                      <div 
                        key={l.platformId}
                        className={`flex items-center gap-4 p-5 rounded-2xl transition-all border border-transparent ${i === 0 ? 'bg-emerald-500/5 !border-emerald-500/20' : 'bg-white/5 hover:bg-white/10'}`}
                      >
                         <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg"
                          style={{ background: PLATFORM_COLORS[l.platformId] || "#6366f1" }}
                         >
                           {PLATFORM_ICONS[l.platformId] || "?"}
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-sm text-white mb-0.5">{l.platform.name}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{l.seller}</p>
                         </div>
                         <div className="text-right flex flex-col">
                            <span className="text-lg font-black text-white">{Math.round(l.currentPrice).toLocaleString("tr-TR")} ₺</span>
                            {l.discount > 0 && <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">İndirimi Gör</span>}
                         </div>
                         <a 
                          href={l.url || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-500 flex items-center justify-center transition-all text-slate-400 hover:text-white"
                          onClick={(e) => { if(!l.url) e.preventDefault(); }}
                         >
                           <ExternalLink size={18} />
                         </a>
                      </div>
                   ))}
                </div>
             </div>

             {/* Chart Section */}
             <div className="glass p-8 rounded-3xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                   <h2 className="text-2xl font-black text-white">90 Günlük Fiyat Geçmişi</h2>
                   <div className="flex gap-2">
                       <span className="badge bg-white/5 text-slate-500">Minimum: {Math.min(...history.map(h => h.price)).toLocaleString()} ₺</span>
                   </div>
                </div>
                <div className="h-[300px] w-full">
                   <PriceChart allHistory={history} />
                </div>
             </div>
          </div>

          {/* Reviews & Sidebar */}
          <div className="space-y-8">
             <div className="glass p-8 rounded-3xl">
                <h2 className="text-xl font-black text-white mb-6">Müşteri Yorumları</h2>
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                   {reviews.length === 0 ? (
                      <p className="text-center py-10 text-slate-500 text-sm font-bold">Henüz yorum yapılmamış.</p>
                   ) : (
                      reviews.map((r: any) => (
                         <div key={r.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black">
                                     {r.userName[0].toUpperCase()}
                                  </div>
                                  <span className="text-xs font-bold text-white">{r.userName}</span>
                               </div>
                               <div className="flex">
                                  {[1,2,3,4,5].map(s => (
                                     <Star key={s} size={10} fill={s <= r.rating ? "#fbbf24" : "none"} stroke={s <= r.rating ? "#fbbf24" : "rgba(255,255,255,0.2)"} />
                                  ))}
                               </div>
                            </div>
                            <p className="text-xs text-slate-400 italic line-clamp-3">"{r.comment}"</p>
                            <span className="text-[10px] text-slate-600 font-bold block">{r.date}</span>
                         </div>
                      ))
                   )}
                </div>
                
                <form onSubmit={submitReview} className="mt-8 pt-8 border-t border-white/5 space-y-4">
                   <input 
                    type="text" 
                    placeholder="Adınız" 
                    value={newReview.userName}
                    onChange={(e) => setNewReview(p => ({ ...p, userName: e.target.value }))}
                    className="input w-full !bg-white/5 !border-none !text-xs"
                   />
                   <textarea 
                    placeholder="Ürün hakkındaki yorumunuz..." 
                    value={newReview.comment}
                    onChange={(e) => setNewReview(p => ({ ...p, comment: e.target.value }))}
                    className="input w-full !bg-white/5 !border-none !text-xs h-24 resize-none"
                   />
                   <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                         {[1,2,3,4,5].map(s => (
                           <button type="button" key={s} onClick={() => setNewReview(p => ({ ...p, rating: s }))}>
                              <Star size={18} fill={s <= newReview.rating ? "#fbbf24" : "none"} stroke={s <= newReview.rating ? "#fbbf24" : "rgba(255,255,255,0.2)"} />
                           </button>
                         ))}
                      </div>
                      <button 
                        type="submit" 
                        disabled={submittingReview}
                        className="btn btn-primary !py-2 !px-4 text-xs"
                      >
                         Yorum Yap
                      </button>
                   </div>
                </form>
             </div>
          </div>
        </div>
      </div>

      {/* Alarm Modal Overlay */}
      <AnimatePresence>
        {showAlarm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-10 rounded-[40px] w-full max-w-lg shadow-2xl relative border-white/10"
            >
              <button 
                onClick={() => setShowAlarm(false)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="mb-8">
                <div className="w-16 h-16 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
                  <Bell size={32} />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">Fiyat Alarmı Kur</h3>
                <p className="text-slate-500 font-bold text-sm">Ürün hedeflediğiniz fiyata düştüğünde size anlık bildirim gönderelim.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Mevcut En İyi Fiyat</label>
                  <div className="text-2xl font-black text-white">{Math.round(product.bestPrice).toLocaleString("tr-TR")} ₺</div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Hedef Fiyat Belirleyin</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={alarmPrice}
                      onChange={(e) => setAlarmPrice(e.target.value)}
                      placeholder={`${Math.round(product.bestPrice * 0.9).toLocaleString("tr-TR")}`}
                      className="input w-full !py-5 !pl-8 !text-2xl !font-black !bg-white/5 !border-none"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-700">₺</span>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                   <button onClick={() => setShowAlarm(false)} className="btn btn-secondary flex-1">Vazgeç</button>
                   <button onClick={setAlarm} className="btn btn-primary flex-2">Alarmı Aktif Et</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
