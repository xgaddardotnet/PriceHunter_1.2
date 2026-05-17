"use client";
import { useState, useEffect } from "react";
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart 
} from "recharts";
import { motion } from "framer-motion";

interface HistoryEntry { date: string; price: number; }
interface PlatformHistory { platform: string; platformName: string; color: string; history: HistoryEntry[]; }

const PLATFORM_COLORS: Record<string, string> = {
  amazon: "#FF9900",
  trendyol: "#F27A1A",
  n11: "#8b5cf6",
  hepsiburada: "#FF6000",
};

interface Props {
  allHistory: PlatformHistory[];
  selectedPlatform?: string;
}

export default function PriceChart({ allHistory, selectedPlatform }: Props) {
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  useEffect(() => {
    setActivePlatforms(allHistory.map((h) => h.platform));
  }, [allHistory]);

  if (!allHistory || allHistory.length === 0)
    return (
      <div className="h-64 flex flex-col items-center justify-center glass rounded-3xl opacity-50">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Geçmiş Verisi Yok</p>
      </div>
    );

  const dateMap: Record<string, Record<string, number>> = {};
  allHistory.forEach(({ platform, history }) => {
    history.forEach(({ date, price }) => {
      if (!dateMap[date]) dateMap[date] = {};
      dateMap[date][platform] = Math.round(price);
    });
  });

  const chartData = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, prices]) => ({ 
      date: new Date(date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' }), 
      rawDate: date,
      ...prices 
    }));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass !bg-slate-950/90 p-5 rounded-[24px] border-white/10 shadow-3xl backdrop-blur-2xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">{label}</p>
        <div className="space-y-3">
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color, boxShadow: `0 0 12px ${p.color}` }} />
                <span className="text-xs font-bold text-slate-300">{p.name}</span>
              </div>
              <span className="text-sm font-black text-white">
                {p.value?.toLocaleString("tr-TR")} ₺
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Premium Platform Indicators */}
      <div className="flex flex-wrap gap-4">
        {allHistory.map(({ platform, platformName }) => {
          const color = PLATFORM_COLORS[platform] || "#6366f1";
          const active = activePlatforms.includes(platform);
          return (
            <button
              key={platform}
              onMouseEnter={() => setHoveredPlatform(platform)}
              onMouseLeave={() => setHoveredPlatform(null)}
              onClick={() => setActivePlatforms(prev => 
                prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
              )}
              className="flex items-center gap-4 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border relative group overflow-hidden"
              style={{
                background: active ? `${color}10` : "rgba(255,255,255,0.02)",
                color: active ? "#fff" : "#475569",
                borderColor: active ? `${color}40` : "rgba(255,255,255,0.05)",
                boxShadow: active ? `0 10px 30px -10px ${color}40` : 'none'
              }}
            >
              <div className="w-2 h-2 rounded-full relative" style={{ 
                background: color, 
                opacity: active ? 1 : 0.3,
              }}>
                 {active && <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: color }} />}
              </div>
              {platformName}
            </button>
          );
        })}
      </div>

      <div className="h-[420px] w-full mt-6 bg-black/40 rounded-[48px] p-8 glass border-white/5 relative overflow-hidden" style={{ minWidth: 0 }}>
        <div className="absolute inset-0 bg-linear-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {allHistory.map(({ platform }) => (
                <linearGradient key={`grad-${platform}`} id={`color-${platform}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PLATFORM_COLORS[platform]} stopOpacity={0.5}/>
                  <stop offset="100%" stopColor={PLATFORM_COLORS[platform]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: "#475569", fontSize: 9, fontWeight: 900 }} 
              tickLine={false} 
              axisLine={false} 
              dy={20}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 9, fontWeight: 900 }}
              tickLine={false}
              axisLine={false}
              dx={-10}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 20 }}
            />
            {allHistory.map(({ platform, platformName }) => (
              activePlatforms.includes(platform) ? (
                <Area
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  name={platformName}
                  stroke={PLATFORM_COLORS[platform]}
                  strokeWidth={4}
                  fillOpacity={1}
                  fill={`url(#color-${platform})`}
                  animationDuration={2500}
                  activeDot={{ 
                    r: 10, 
                    fill: PLATFORM_COLORS[platform], 
                    stroke: '#fff', 
                    strokeWidth: 4,
                    className: "shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
                  }}
                  opacity={hoveredPlatform && hoveredPlatform !== platform ? 0.1 : 1}
                />
              ) : null
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

  );
}

