"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check, Sparkles, ShieldCheck, PackageSearch, ArrowRight, Fingerprint } from "lucide-react";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 4;
    return 3;
  };

  const strength = passwordStrength();
  const strengthLabel = ["", "Eksik", "Zayıf", "Orta", "Güçlü"][strength];
  const strengthColor = ["", "#475569", "#ef4444", "#f59e0b", "#10b981"][strength];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Lütfen tüm alanları doldurun");
    if (password.length < 6) return toast.error("Şifre en az 6 karakter olmalıdır");
    if (password !== confirm) return toast.error("Şifreler birbiriyle eşleşmiyor");
    setLoading(true);
    try {
      const res = await authAPI.register(name, email, password);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      toast.success(`Harika! Hoş geldin, ${user.name}! 👋`);
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black">
      {/* Dynamic Aurora Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[120px] animate-float" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10 glass rounded-[48px] overflow-hidden border-white/5 shadow-3xl"
      >
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-linear-to-br from-indigo-600/20 to-purple-900/20 relative overflow-hidden border-r border-white/5">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
          
          <Link href="/" className="flex items-center gap-3 group relative z-10">
             <div className="w-14 h-14 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                <PackageSearch size={28} />
             </div>
             <span className="text-3xl font-black text-white tracking-tighter">PriceHunter <span className="text-red-500">AI</span></span>
          </Link>

          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
              <Sparkles size={40} className="animate-pulse" />
            </div>
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight font-display">
              Akıllı Alışverişin <br />
              <span className="text-indigo-400 italic">Geleceğine</span> Hoş Geldin.
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              Binlerce mağazayı senin için tarıyoruz. Fiyatlar düştüğünde ilk senin haberin olsun.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> Güvenli Kayıt</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-2"><Fingerprint size={16} className="text-indigo-500" /> AI Doğrulama</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Hesap Oluştur</h1>
            <p className="text-slate-500 font-medium">Hemen ücretsiz katıl ve avantajları yakala.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tam Adınız</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ad Soyad"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-4 text-white focus:bg-white/10 focus:border-red-500/50 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-Posta</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@mail.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-4 text-white focus:bg-white/10 focus:border-red-500/50 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Şifre</label>
                  {password && <span className="text-[10px] font-black uppercase" style={{ color: strengthColor }}>{strengthLabel}</span>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input 
                    type={showPass ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-4 text-white focus:bg-white/10 focus:border-red-500/50 outline-none transition-all font-bold"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="flex gap-1 h-1 mt-2 px-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${strength >= i ? '' : 'bg-white/5'}`} style={{ backgroundColor: strength >= i ? strengthColor : undefined }} />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Şifre Tekrar</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input 
                    type={showPass ? "text" : "password"} 
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-4 text-white focus:bg-white/10 focus:border-red-500/50 outline-none transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn btn-primary !py-5 text-lg shadow-2xl shadow-red-500/20 group"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 
                <span className="flex items-center gap-2">Hemen Kayıt Ol <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
              }
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              Zaten bir hesabın var mı?{" "}
              <Link href="/auth/login" className="text-white font-black hover:text-red-500 underline transition-colors underline-offset-4">Giriş Yap</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
