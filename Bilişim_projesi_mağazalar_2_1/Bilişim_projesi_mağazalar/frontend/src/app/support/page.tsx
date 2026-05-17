"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Clock, Send, ShieldCheck, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function SupportPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mesajınız başarıyla iletildi! En kısa sürede döneceğiz. 🚀");
  };

  return (
    <div className="min-h-screen pt-40 pb-32 bg-black selection:bg-red-500/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-red-600/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-600/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="container max-w-7xl px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
            <div>
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-500/10 text-red-500 font-bold uppercase tracking-widest text-xs border border-red-500/20 mb-6">
                  Destek Merkezi
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight font-display break-words">
                  Nasıl Yardımcı <br/>
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-amber-500 italic pr-4">Olabiliriz?</span>
               </h1>
               <p className="text-lg text-slate-400 font-medium leading-relaxed break-words">
                  İhtiyacınız olan her an, 7/24 kesintisiz destek ekibimizle bir mesaj uzağınızdayız.
               </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
               <ContactItem icon={<Mail size={24} />} title="E-Posta" value="destek@pricehunter.com" color="blue" />
               <ContactItem icon={<Phone size={24} />} title="Telefon" value="+90 (850) 123 45 67" color="emerald" />
            </div>
            <ContactItem icon={<Clock size={24} />} title="Çalışma Saatleri" value="7/24 Kesintisiz Yapay Zeka Desteği" color="amber" fullWidth />

            <div className="bg-white/5 border border-white/5 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 backdrop-blur-md">
               <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <ShieldCheck size={24} />
               </div>
               <p className="text-xs md:text-sm font-bold text-slate-400 leading-relaxed break-words">
                  Gönderdiğiniz tüm talepler uçtan uca şifrelenir ve gizlilik politikamız gereği sadece yetkili personeller tarafından incelenir.
               </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="glass p-8 md:p-10 rounded-3xl border-white/10 shadow-xl relative overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 ml-1">Ad Soyad</label>
                     <input required placeholder="Adınız" className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-red-500/50 focus:bg-black outline-none font-bold transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 ml-1">E-Posta</label>
                     <input type="email" required placeholder="ornek@mail.com" className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-red-500/50 focus:bg-black outline-none font-bold transition-all" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-1">Konu</label>
                  <select className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-red-500/50 focus:bg-black outline-none font-bold appearance-none cursor-pointer transition-all">
                     <option className="bg-slate-900">Fiyat Alarmı Çalışmıyor</option>
                     <option className="bg-slate-900">Yanlış Mağaza Bağlantısı</option>
                     <option className="bg-slate-900">Hesap & Güvenlik</option>
                     <option className="bg-slate-900">Öneri & Geri Bildirim</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-1">Mesajınız</label>
                  <textarea required rows={5} placeholder="Size nasıl yardımcı olabiliriz?" className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-red-500/50 focus:bg-black outline-none font-bold resize-none transition-all" />
               </div>
               <button type="submit" className="w-full btn btn-primary !py-4 !rounded-2xl text-base flex items-center justify-center gap-3 hover:scale-[1.02] shadow-md">
                  Destek Talebi Oluştur <Send size={20} />
               </button>
            </form>
          </motion.div>

        </div>

        {/* FAQ Section */}
        <div className="mt-32">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight font-display break-words">Sıkça Sorulan Sorular</h2>
              <p className="text-slate-400 font-medium max-w-2xl mx-auto text-base break-words">Hızlı cevaplara mı ihtiyacınız var? Sizin için derledik.</p>
           </div>

           <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <FAQItem 
                question="Fiyatlar ne sıklıkla güncelleniyor?" 
                answer="Yapay zeka botlarımız tüm mağazaları her 15 dakikada bir tarar. Büyük indirim dönemlerinde (Black Friday vb.) bu süre 5 dakikaya kadar düşmektedir." 
              />
              <FAQItem 
                question="Hangi mağazaları takip ediyorsunuz?" 
                answer="Şu an Amazon, Trendyol, Hepsiburada ve N11 üzerindeki tüm ürünleri takip ediyoruz. Teknosa ve Vatan yakında eklenecektir." 
              />
              <FAQItem 
                question="Fiyat alarmı nasıl çalışır?" 
                answer="Herhangi bir ürün sayfasında hedeflediğiniz fiyatı girmeniz yeterlidir. Ürün o fiyata veya altına düştüğünde sistem otomatik bildirim gönderir." 
              />
              <FAQItem 
                question="Hizmetiniz ücretli mi?" 
                answer="Hayır, PriceHunter AI temel özellikleri ile her zaman ücretsiz kalacaktır. Kullanıcılarımıza tasarruf ettirmek bizim tek önceliğimizdir." 
              />
           </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass p-6 md:p-8 rounded-2xl border-white/5 hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
       <div className="flex items-center justify-between gap-4">
          <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-red-400 transition-colors tracking-tight break-words pr-4">{question}</h4>
          <div className={`w-10 h-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 transition-all duration-300 ${isOpen ? 'rotate-180 bg-red-500/10 text-red-500' : ''}`}>
             <Plus size={20} className={isOpen ? 'rotate-45' : ''} />
          </div>
       </div>
       <AnimatePresence>
          {isOpen && (
             <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: "auto", opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="overflow-hidden"
             >
                <p className="text-slate-400 font-medium leading-relaxed text-sm md:text-base pt-6 mt-6 border-t border-white/5 break-words">{answer}</p>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}

function ContactItem({ icon, title, value, color, fullWidth }: { icon: any, title: string, value: string, color: string, fullWidth?: boolean }) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20",
  };
  
  return (
    <div className={`glass p-6 md:p-8 rounded-2xl border-white/5 flex items-center gap-4 md:gap-6 group transition-all duration-300 hover:border-white/10 hover:bg-white/5 ${fullWidth ? 'col-span-full' : ''}`}>
       <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 ${colors[color]}`}>
          {icon}
       </div>
       <div className="min-w-0">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 break-words">{title}</h4>
          <p className="text-sm md:text-base font-bold text-white tracking-tight break-words truncate">{value}</p>
       </div>
    </div>
  );
}
