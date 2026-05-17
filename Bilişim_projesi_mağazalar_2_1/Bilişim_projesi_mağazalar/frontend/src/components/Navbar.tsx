"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, Menu, X, PackageSearch, Heart, LogOut, Zap, LayoutGrid, Info, LifeBuoy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(true); // Mock user state
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => setUser(false);

  const NavLink = ({ href, icon, text }: { href: string, icon: any, text: string }) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href} 
        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
      >
        <div className={`transition-colors duration-300 ${isActive ? 'text-red-500' : 'group-hover:text-red-400'}`}>
          {icon}
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{text}</span>
        {isActive && (
          <motion.div 
            layoutId="nav-active"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
          />
        )}
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="container max-w-7xl px-6">
        <div className={`relative glass rounded-[40px] border-white/5 transition-all duration-700 ${scrolled ? 'bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl' : 'bg-transparent border-transparent'}`}>
          <div className="flex items-center justify-between px-8 py-4">
            {/* Brand Section */}
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-red-500 to-blue-600 flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <PackageSearch size={28} className="relative z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white tracking-tighter leading-none font-display group-hover:text-red-500 transition-colors">PriceHunter</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">AI Active</span>
                  </div>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden xl:flex items-center gap-4">
                <NavLink href="/search" icon={<LayoutGrid size={16} />} text="Katalog" />
                <NavLink href="/about" icon={<Info size={16} />} text="Hakkımızda" />
                <NavLink href="/support" icon={<LifeBuoy size={16} />} text="Destek" />
              </div>
            </div>

            {/* Action Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/favorites" className="w-12 h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all group relative">
                    <Heart size={20} className="group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-black flex items-center justify-center text-[8px] font-black text-white">!</div>
                  </Link>
                  <Link href="/alerts" className="w-12 h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-all group">
                    <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                  </Link>
                  <div className="w-px h-8 bg-white/5 mx-2 hidden sm:block" />
                  <button onClick={handleLogout} className="hidden sm:flex items-center gap-3 px-6 py-3 rounded-2xl glass border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all group">
                    <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> 
                    <span className="text-[10px] font-black uppercase tracking-widest">Çıkış</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/auth/login" className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors px-4">Giriş Yap</Link>
                  <Link href="/auth/register" className="btn btn-primary !py-3.5 !px-8 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-red-500/20">Ücretsiz Başla</Link>
                </div>
              )}
              
              <button 
                onClick={() => setMobileOpen(true)}
                className="xl:hidden w-12 h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-white"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-50 glass backdrop-blur-3xl p-8 flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center mb-16">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-red-500 to-blue-600 flex items-center justify-center text-white shadow-2xl">
                    <PackageSearch size={28} />
                  </div>
                  <span className="text-2xl font-black text-white tracking-tighter font-display">PriceHunter</span>
               </div>
               <button onClick={() => setMobileOpen(false)} className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-white">
                 <X size={32} />
               </button>
            </div>

            <div className="space-y-6 flex-1">
               <MobileNavLink href="/" text="Ana Sayfa" icon={<Zap size={24}/>} onClick={() => setMobileOpen(false)} />
               <MobileNavLink href="/search" text="Katalog" icon={<LayoutGrid size={24}/>} onClick={() => setMobileOpen(false)} />
               <MobileNavLink href="/about" text="Hakkımızda" icon={<Info size={24}/>} onClick={() => setMobileOpen(false)} />
               <MobileNavLink href="/support" text="Destek Merkezi" icon={<LifeBuoy size={24}/>} onClick={() => setMobileOpen(false)} />
            </div>

            <div className="mt-auto space-y-4">
               {user ? (
                 <>
                   <Link href="/favorites" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-4 p-5 rounded-3xl glass border-white/5 text-white font-bold">
                     <Heart size={24} className="text-rose-500" /> Favorilerim
                   </Link>
                   <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full flex items-center gap-4 p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold">
                     <LogOut size={24} /> Çıkış Yap
                   </button>
                 </>
               ) : (
                 <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full py-5 text-xl font-black tracking-tighter">
                   Hemen Başlayın
                 </Link>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function MobileNavLink({ href, text, icon, onClick }: { href: string, text: string, icon: any, onClick: any }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-6 p-6 rounded-[32px] glass border-white/5 hover:bg-white/5 transition-all group">
       <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-red-500 group-hover:bg-red-500/10 transition-all">
          {icon}
       </div>
       <span className="text-xl font-black text-white">{text}</span>
    </Link>
  );
}
