"use client";
import { motion } from "framer-motion";
import { Briefcase, Rocket, Heart, Coffee, Star, MapPin, ArrowRight } from "lucide-react";

export default function CareerPage() {
  const jobs = [
    { title: "Senior AI Engineer", loc: "Gebze / Remote", dept: "Engineering", type: "Tam Zamanlı" },
    { title: "Product Designer", loc: "İstanbul / Hybrid", dept: "Design", type: "Yarı Zamanlı" },
    { title: "Frontend Developer (Next.js)", loc: "Remote", dept: "Engineering", type: "Tam Zamanlı" },
    { title: "Data Scientist", loc: "Ankara / Remote", dept: "AI & Data", type: "Tam Zamanlı" }
  ];

  return (
    <div className="min-h-screen pt-40 pb-32 bg-black selection:bg-purple-500/30">
      <div className="container max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-purple-600/10 blur-[100px] -z-10 rounded-full pointer-events-none" />
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight font-display break-words">
            Ekibe <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-red-500 pr-2">Katılın.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed break-words">
            E-ticaretin kurallarını yapay zeka ile yeniden yazıyoruz. Sınırları zorlamayı seviyorsanız, doğru yerdesiniz.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
           <CultureCard icon={<Rocket />} title="Hızlı Büyüme" desc="Gelişim sınır tanımaz." color="red" />
           <CultureCard icon={<Heart />} title="Tutku" desc="İşinize aşık olun." color="purple" />
           <CultureCard icon={<Coffee />} title="Esneklik" desc="Mekandan bağımsız." color="amber" />
           <CultureCard icon={<Star />} title="İnovasyon" desc="Geleceği tasarlayın." color="emerald" />
        </div>

        <div className="space-y-12">
          <div className="flex items-center justify-between mb-12">
             <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display flex items-center gap-4 break-words">
               <span className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <Briefcase size={24} />
               </span>
               Açık Pozisyonlar
             </h2>
             <div className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                <span>{jobs.length} İlan</span>
             </div>
          </div>
          
          <div className="grid gap-6">
            {jobs.map((job, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="glass p-6 md:p-8 rounded-3xl border-white/5 flex flex-col md:flex-row md:items-center justify-between group hover:border-purple-500/30 hover:bg-white/5 transition-all duration-300"
              >
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest break-words">
                        {job.dept}
                     </span>
                     <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 uppercase tracking-widest break-words">
                        {job.type}
                     </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight group-hover:text-purple-400 transition-colors break-words">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <MapPin size={16} className="text-red-500"/> {job.loc}
                  </div>
                </div>
                <button className="w-full md:w-auto btn btn-secondary !py-5 !px-10 !rounded-2xl text-sm font-black uppercase tracking-widest group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-all flex items-center justify-center gap-3">
                   Hemen Başvur <ArrowRight size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CultureCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  const colors: any = {
    red: "text-red-500 bg-red-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
  };
  return (
    <div className="glass p-6 md:p-8 rounded-2xl border-white/5 flex flex-col items-center text-center group hover:border-white/10 hover:-translate-y-2 transition-all duration-300">
       <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${colors[color]}`}>
          {icon}
       </div>
       <h4 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight break-words">{title}</h4>
       <p className="text-xs md:text-sm font-medium text-slate-500 break-words">{desc}</p>
    </div>
  );
}
