"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PackageSearch } from "lucide-react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for 4.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Intense Dynamic Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [0, 2, 1.5], opacity: [0, 1, 0.5] }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute w-[60vw] h-[60vw] bg-red-600/20 rounded-full blur-[150px]" 
          />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 2], opacity: [0, 1, 0.5] }}
            transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
            className="absolute w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[150px]" 
          />
          <motion.div 
            initial={{ scale: 0.5, rotate: 0 }}
            animate={{ scale: [0.5, 1.2, 0.8], rotate: 360, opacity: [0, 0.8, 0] }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute w-[80vw] h-[80vw] border-[1px] border-white/5 rounded-full" 
          />
          <motion.div 
            initial={{ scale: 1, rotate: 360 }}
            animate={{ scale: [1, 1.5, 1], rotate: 0, opacity: [0, 0.5, 0] }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute w-[60vw] h-[60vw] border-[2px] border-red-500/10 rounded-full" 
          />

          {/* Logo Animation */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", type: "spring", bounce: 0.5 }}
            className="flex flex-col items-center relative z-10"
          >
            <motion.div 
              animate={{ rotateY: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 rounded-[40px] bg-linear-to-br from-red-500 via-purple-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_80px_rgba(239,68,68,0.6)] mb-10 relative"
            >
              <PackageSearch size={64} className="animate-pulse" />
              <div className="absolute inset-0 border-2 border-white/40 rounded-[40px] animate-ping opacity-80" />
            </motion.div>
            
            <motion.h1 
              initial={{ letterSpacing: "10px", opacity: 0 }}
              animate={{ letterSpacing: "-2px", opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-500 via-white to-blue-500 font-display mb-8"
            >
              PriceHunter
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="flex items-center gap-4 bg-white/10 px-8 py-4 rounded-full border border-white/20 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <span className="w-3 h-3 rounded-full bg-red-500 animate-bounce shadow-[0_0_15px_rgba(239,68,68,1)]" />
              <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Yapay Zeka Milyonlarca Veriyi Analiz Ediyor...</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
