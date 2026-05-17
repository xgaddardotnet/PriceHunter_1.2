"use client";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, CheckCircle } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    { 
      title: "Veri Toplama Politikası", 
      desc: "Sadece size en uygun fırsatları sunabilmek için anonim arama tercihlerini ve favori listelerinizi saklıyoruz. Kimliğinizi açığa çıkaracak hassas veriler hiçbir şekilde kaydedilmez.", 
      icon: <Eye className="text-blue-500" />,
      color: "from-blue-500/10 to-transparent",
      borderColor: "border-blue-500/20"
    },
    { 
      title: "Yüksek Güvenlik Standartları", 
      desc: "Kullanıcı hesapları ve bildirim tercihleri, endüstri standardı olan 256-bit AES şifreleme altyapısı ile sunucularımızda güvenle barındırılmaktadır.", 
      icon: <Lock className="text-red-500" />,
      color: "from-red-500/10 to-transparent",
      borderColor: "border-red-500/20"
    },
    { 
      title: "Çerez Kullanımı", 
      desc: "Size özel teklifler sunabilmek ve platform performansını optimize etmek için yalnızca zorunlu ve işlevsel çerezler kullanılmaktadır. Üçüncü taraf reklam çerezlerine izin verilmez.", 
      icon: <FileText className="text-purple-500" />,
      color: "from-purple-500/10 to-transparent",
      borderColor: "border-purple-500/20"
    }
  ];

  return (
    <div className="min-h-screen pt-40 pb-32 bg-black selection:bg-emerald-500/30">
      <div className="container max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 blur-[80px] -z-10 rounded-full" />
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
             <Shield size={32} className="text-emerald-500 shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight font-display break-words">
            Gizlilik Sözleşmesi
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto break-words">
            Dijital güvenliğiniz bizim için her şeyden önemli. Verilerinizin nasıl korunduğunu şeffaf bir şekilde açıklıyoruz.
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

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-sm mt-12"
          >
             <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
               <CheckCircle className="text-emerald-500" size={28} />
             </div>
             <p className="text-emerald-400 font-bold text-base md:text-lg leading-relaxed text-center md:text-left break-words">
               PriceHunter AI olarak verilerinizi asla reklam ajansları veya üçüncü taraf veri brokerları ile satmıyor, paylaşmıyoruz.
             </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
