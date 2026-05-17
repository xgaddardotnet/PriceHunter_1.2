"use client";
import { motion } from "framer-motion";
import { Scale, AlertCircle, Info, FileText } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: <Info className="text-blue-500" size={32} />,
      title: "1. Genel Kullanım",
      desc: "PriceHunter AI, kullanıcıların çeşitli e-ticaret sitelerindeki fiyatları karşılaştırmasına olanak sağlayan bir platformdur. Kullanıcılar, sistemimizi otomatik botlarla sorgulamamayı ve aşırı yük bindirmemeyi kabul eder.",
      color: "from-blue-500/10 to-transparent",
      borderColor: "border-blue-500/20"
    },
    {
      icon: <AlertCircle className="text-red-500" size={32} />,
      title: "2. Fiyat Sorumluluğu",
      desc: "Platformumuzda gösterilen fiyatlar mağazalardan anlık çekilmektedir ancak nihai geçerli fiyat ilgili mağazanın ödeme ekranındaki fiyattır. Fiyat hatalarından PriceHunter AI sorumlu tutulamaz.",
      color: "from-red-500/10 to-transparent",
      borderColor: "border-red-500/20"
    },
    {
      icon: <FileText className="text-emerald-500" size={32} />,
      title: "3. Fikri Mülkiyet",
      desc: "Site içerisindeki yapay zeka analiz raporları, tasarım ögeleri ve marka değerleri PriceHunter AI'a aittir. İzinsiz kopyalanamaz veya çoğaltılamaz.",
      color: "from-emerald-500/10 to-transparent",
      borderColor: "border-emerald-500/20"
    }
  ];

  return (
    <div className="min-h-screen pt-40 pb-32 bg-black selection:bg-blue-500/30">
      <div className="container max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 blur-[80px] -z-10 rounded-full" />
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
             <Scale size={32} className="text-blue-500 shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight font-display break-words">
            Kullanıcı Şartları
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto break-words">
            Platformumuzu kullanırken dikkat etmeniz gereken temel kurallar ve yasal yükümlülükler.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((s, i) => (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               key={i} 
               className={`glass p-6 md:p-8 rounded-3xl bg-linear-to-br ${s.color} border-white/5 hover:${s.borderColor} transition-colors duration-300 group`}
             >
               <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-4">
                 <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {s.icon}
                 </div>
                 <h2 className="text-2xl font-black text-white tracking-tight font-display break-words">{s.title}</h2>
               </div>
               <p className="text-slate-400 leading-relaxed font-medium text-sm md:text-base md:pl-20 break-words">
                 {s.desc}
               </p>
             </motion.div>
          ))}
          
          <div className="pt-12 flex justify-center">
             <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Son Güncelleme: 14 Mayıs 2026
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
