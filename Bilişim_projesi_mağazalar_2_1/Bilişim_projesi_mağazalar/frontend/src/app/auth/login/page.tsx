"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowLeft, ShieldCheck, Sparkles, PackageSearch, Fingerprint, ArrowRight } from "lucide-react";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Lütfen tüm alanları doldurun");
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      toast.success(`Tekrar hoş geldin, ${user.name}! 👋`);
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await authAPI.login("demo@pricehunter.com", "demo123");
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      toast.success(`Hızlı erişim aktif! 🚀`);
      router.push("/");
    } catch {
      toast.error("Demo hesaba şu an ulaşılamıyor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black">
      {/* Dynamic Aurora Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10 glass rounded-[48px] overflow-hidden border-white/5 shadow-3xl"
      >
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-linear-to-br from-blue-600/20 to-indigo-900/20 relative overflow-hidden border-r border-white/5">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
          
          <Link href="/" className="flex items-center gap-3 group relative z-10">
             <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                <PackageSearch size={28} />
             </div>
             <span className="text-3xl font-black text-white tracking-tighter">PriceHunter <span className="text-blue-500">AI</span></span>
          </Link>

          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
              <Fingerprint size={40} className="text-blue-400 animate-pulse" />
            </div>
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight font-display">
              Fırsatları Yakalamaya <br />
              <span className="text-blue-400 italic">Devam Et.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              Hesabına giriş yap ve takip ettiğin ürünlerdeki son fiyat değişimlerini anında görüntüle.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> SSL Korumalı</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-2"><Sparkles size={16} className="text-blue-500" /> AI Destekli</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Tekrar Hoş Geldin</h1>
            <p className="text-slate-500 font-medium">Bilgilerini girerek oturum açabilirsin.</p>
          </div>

          {/* Quick Demo Access */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 transition-all border border-dashed border-white/10 group mb-8"
          >
            <Sparkles size={18} className="text-blue-400 group-hover:scale-125 transition-transform" />
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Hızlı Demo Girişi</span>
          </button>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Veya</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-Posta Adresi</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@mail.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-4 text-white focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Şifre</label>
                  <Link href="#" className="text-[10px] font-black text-blue-500 hover:text-white transition-colors uppercase tracking-widest">Şifremi Unuttum</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type={showPass ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-4 text-white focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all font-bold"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn btn-primary !bg-blue-600 !py-5 text-lg shadow-2xl shadow-blue-600/20 group mt-4"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 
                <span className="flex items-center gap-2">Hesabıma Giriş Yap <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
              }
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              Henüz bir hesabın yok mu?{" "}
              <Link href="/auth/register" className="text-white font-black hover:text-blue-500 underline transition-colors underline-offset-4">Ücretsiz Kaydol</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
