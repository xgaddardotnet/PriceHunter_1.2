"use client";
import { motion } from "framer-motion";
import { PackageSearch, ShieldCheck, Zap, BarChart3, Users, Globe, Award, Hexagon } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-32 bg-black selection:bg-red-500/30 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black -z-10" />

      <div className="container max-w-7xl px-6 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-32 relative"
        >
          <div className="flex justify-center mb-8 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-red-500 to-blue-600 flex items-center justify-center text-white shadow-lg relative group">
              <PackageSearch size={48} strokeWidth={1.5} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight font-display break-words">
            Geleceğin <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-blue-500 italic pr-4">Alışveriş Asistanı.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed break-words">
            PriceHunter AI, milyonlarca veriyi anlık analiz ederek sizi en doğru fiyatla buluşturan, Türkiye'nin ilk ve tek gerçek zamanlı yapay zeka destekli fiyat takip platformudur.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-40">
           <StatCard icon={<Users size={32} />} number="50K+" label="Aktif Kullanıcı" color="from-blue-500/20 to-blue-600/5" border="border-blue-500/20" text="text-blue-500" />
           <StatCard icon={<PackageSearch size={32} />} number="1000+" label="Canlı Ürün" color="from-red-500/20 to-red-600/5" border="border-red-500/20" text="text-red-500" />
           <StatCard icon={<Zap size={32} />} number="1M+" label="Fiyat Güncellemesi" color="from-amber-500/20 to-amber-600/5" border="border-amber-500/20" text="text-amber-500" />
           <StatCard icon={<Award size={32} />} number="99.9%" label="Doğruluk Payı" color="from-emerald-500/20 to-emerald-600/5" border="border-emerald-500/20" text="text-emerald-500" />
        </div>

        <div className="space-y-32">
          <section className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-500/10 text-red-500 font-bold uppercase tracking-widest text-xs border border-red-500/20">
                <ShieldCheck size={16} /> Şeffaf & Güvenilir
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight font-display break-words">
                Herkes İçin Adil Ekonomi
              </h2>
              <p className="text-slate-400 text-base leading-relaxed font-medium break-words">
                Her tüketicinin en doğru ürüne en adil fiyattan ulaşabilmesini sağlamak en büyük motivasyonumuz. Karmaşık e-ticaret dünyasında kullanıcılarımıza şeffaf ve tarafsız bir rehberlik sunarak alışverişi bir yük olmaktan çıkarıyoruz.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                 <div className="glass p-6 rounded-2xl border-white/5 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                       <BarChart3 size={20} />
                    </div>
                    <h4 className="text-white font-bold text-base break-words">Yapay Zeka Öngörüsü</h4>
                    <p className="text-xs text-slate-500 font-medium break-words">Fiyatların ne zaman düşeceğini tahmin ederiz.</p>
                 </div>
                 <div className="glass p-6 rounded-2xl border-white/5 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                       <Globe size={20} />
                    </div>
                    <h4 className="text-white font-bold text-base break-words">Tüm Mağazalar</h4>
                    <p className="text-xs text-slate-500 font-medium break-words">Tek bir ekrandan tüm pazaryerlerini kontrol edin.</p>
                 </div>
              </div>
            </div>
            
            <div className="relative group lg:ml-10 hidden lg:block">
              <div className="relative glass aspect-square rounded-3xl border-white/10 flex items-center justify-center overflow-hidden">
                <Hexagon size={180} strokeWidth={0.5} className="text-white opacity-10 animate-spin-slow" />
                <PackageSearch size={60} className="absolute text-white" />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 to-black border border-white/10 p-12 text-center">
             <h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight font-display relative z-10 break-words">
               Alışverişe Başlamaya Hazır mısın?
             </h2>
             <Link href="/search" className="btn btn-primary !py-4 !px-10 text-base font-bold tracking-widest hover:scale-105 transition-transform relative z-10 rounded-xl">
               SİSTEMİ KEŞFET
             </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, number, label, color, border, text }: { icon: any, number: string, label: string, color: string, border: string, text: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} className={`glass p-6 md:p-8 rounded-2xl border-white/5 hover:${border} text-center transition-all duration-300 bg-linear-to-b ${color} relative overflow-hidden group`}>
       <div className={`w-14 h-14 rounded-xl bg-black/50 border border-white/5 flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 ${text}`}>
          {icon}
       </div>
       <div className="text-3xl font-black text-white mb-2 tracking-tight">{number}</div>
       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest break-words">{label}</div>
    </motion.div>
  );
}
