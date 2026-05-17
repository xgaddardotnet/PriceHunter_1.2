"use client";
import Link from "next/link";
import { PackageSearch, Mail, Phone, MapPin, Zap, BarChart3, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-80 relative overflow-hidden bg-black pt-32 pb-16 border-t border-white/5">
      {/* Background Aurora */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-linear-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[300px] bg-red-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container max-w-7xl relative z-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Col */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group w-fit">
              <div className="w-14 h-14 rounded-[24px] bg-linear-to-br from-red-500 to-blue-600 flex items-center justify-center text-white shadow-[0_15px_30px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform duration-500">
                <PackageSearch size={30} />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-white leading-none font-display">PriceHunter</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">AI Intelligence</span>
              </div>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed">
              Türkiye'nin en gelişmiş yapay zeka destekli fiyat takip platformu. Sizin için milyonlarca veriyi saniyeler içinde analiz eder.
            </p>
            <div className="flex items-center gap-4">
               <SocialIcon icon={<Zap size={18} />} color="hover:text-amber-500" />
               <SocialIcon icon={<BarChart3 size={18} />} color="hover:text-blue-500" />
               <SocialIcon icon={<Globe size={18} />} color="hover:text-red-500" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" /> Kategoriler
            </h4>
            <ul className="space-y-4">
              <FooterLink href="/search?category=Akıllı Telefon" text="Teknoloji" />
              <FooterLink href="/search?category=Elbise" text="Moda & Giyim" />
              <FooterLink href="/search?category=Ayakkabı" text="Ayakkabı" />
              <FooterLink href="/search?category=Ev Eşyaları" text="Ev & Yaşam" />
              <FooterLink href="/search?category=Aksesuarlar" text="Aksesuar" />
            </ul>
          </div>

          {/* Corporate */}
          <div className="space-y-8">
            <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" /> Kurumsal
            </h4>
            <ul className="space-y-4">
              <FooterLink href="/about" text="Hakkımızda" />
              <FooterLink href="/support" text="Destek Merkezi" />
              <FooterLink href="/career" text="Kariyer" />
              <FooterLink href="/privacy" text="Gizlilik Politikası" />
              <FooterLink href="/terms" text="Kullanım Koşulları" />
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" /> Haberdar Olun
            </h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              En yeni fırsatlar ve yapay zeka güncellemeleri için bültenimize katılın.
            </p>
            <div className="relative group">
               <input 
                 type="email" 
                 placeholder="E-posta adresiniz" 
                 className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:border-red-500/50 transition-all"
               />
               <button className="absolute right-2 top-2 bottom-2 bg-red-500 text-white px-4 rounded-xl hover:bg-red-600 transition-colors">
                  <PackageSearch size={18} />
               </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} PRICEHUNTER AI. HER HAKKI SAKLIDIR.
            </p>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sistem Aktif: 1,000+ Ürün Takipte</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <Link href="/support" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">YARDIM</Link>
             <Link href="/privacy" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">GÜVENLİK</Link>
             <Link href="/terms" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">ÇEREZLER</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, color }: { icon: any, color: string }) {
  return (
    <a href="#" className={`w-12 h-12 rounded-2xl glass border border-white/5 flex items-center justify-center text-slate-500 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 ${color}`}>
      {icon}
    </a>
  );
}

function FooterLink({ href, text }: { href: string, text: string }) {
  return (
    <li>
      <Link href={href} className="text-sm font-bold text-slate-500 hover:text-white transition-all duration-300 flex items-center gap-3 group">
        <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-red-500 transition-all group-hover:scale-125" />
        {text}
      </Link>
    </li>
  );
}

