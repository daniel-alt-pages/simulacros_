import React from 'react';
import { Zap, Target, AlertCircle } from 'lucide-react';

export default function AnalyticsGrid({ analytics, onStreakClick }) {
    if (!analytics || !analytics.streakData || !analytics.perfData) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* 1. STREAK CARD - REDESIGNED */}
            <div
                onClick={onStreakClick}
                className="relative overflow-hidden rounded-3xl p-[1px] group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20"
            >
                {/* Gradient Border & Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-indigo-500/0 to-purple-500/30 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                {/* Main Content */}
                <div className="relative h-full bg-slate-900/90 backdrop-blur-xl rounded-[23px] p-6 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className={`absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] transition-all duration-1000 ${analytics.streakData.isOnFire ? 'bg-orange-500/30 animate-pulse' : ''}`}></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-xl border border-white/10 ${analytics.streakData.isOnFire ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    <Zap size={18} className={analytics.streakData.isOnFire ? 'animate-bounce' : ''} />
                                </div>
                                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Ritmo</h3>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-300 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                <span>Ver Récords</span> <Zap size={10} />
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center py-2">
                            <div className="flex items-baseline gap-3">
                                <span className={`text-6xl font-black tracking-tighter transition-all duration-300 ${analytics.streakData.isOnFire ? 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]' : 'text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]'}`}>
                                    {analytics.streakData.currentStreak > 0 ? analytics.streakData.currentStreak : analytics.streakData.avgStreak}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-none">
                                        {analytics.streakData.currentStreak > 0 ? 'Aciertos' : 'Promedio'}
                                    </span>
                                    <span className="text-xs font-medium text-slate-500">
                                        {analytics.streakData.currentStreak > 0 ? 'Seguidos' : 'Por Racha'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Segmented Progress Bar - Only for Active Streak */}
                        {analytics.streakData.currentStreak > 0 && (
                            <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((step) => (
                                    <div
                                        key={step}
                                        className={`h-2 flex-1 rounded-full transition-all duration-500 ${step <= analytics.streakData.currentStreak
                                            ? (analytics.streakData.isOnFire ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]')
                                            : 'bg-slate-800'
                                            }`}
                                    ></div>
                                ))}
                            </div>
                        )}

                        {analytics.streakData.currentStreak > 0 && (
                            <div className="text-xs text-slate-400 font-medium border-t border-slate-800 pt-3 mt-1">
                                {analytics.streakData.isOnFire ? "🔥 ¡Estás IMBATIBLE! Sigue así." : "¡Sigue sumando!"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. CONSISTENCY CARD (Sniper vs Rollercoaster) */}
            <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 p-6 rounded-3xl relative overflow-hidden group hover:bg-slate-800/80 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                            <Target size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Estabilidad</h3>
                    </div>

                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-white tracking-tight">
                            {analytics.perfData.consistencyScore > 80 ? "Nivel Francotirador" : analytics.perfData.consistencyScore > 50 ? "Nivel Soldado" : "Nivel Montaña Rusa"}
                        </span>
                    </div>
                    <p className="text-xs text-emerald-400/80 font-mono font-bold mb-5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Margen de Error proyectado: ±{analytics.perfData.marginOfError}%
                    </p>

                    {/* Mini Chart Decoration */}
                    <div className="flex justify-between items-end h-10 gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        {[40, 65, 55, 80, 60, 90, 85].map((h, i) => (
                            <div key={i} className="w-full bg-emerald-500/20 rounded-t-sm relative">
                                <div
                                    className="absolute bottom-0 w-full bg-emerald-500 rounded-t-sm transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. NEMESIS CARD (Streak Breaker) */}
            <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 p-6 rounded-3xl relative overflow-hidden group hover:bg-slate-800/80 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Tu 'Némesis'</h3>
                    </div>

                    {analytics.streakData.nemesis ? (
                        <>
                            <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Mayor Ruptura de Rachas</div>
                            <div className="text-lg font-black text-white leading-tight mb-3 capitalize">
                                {analytics.streakData.nemesis.name}
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <span className="text-xs font-bold text-red-400">
                                    Te ha detenido {analytics.streakData.nemesis.kills} veces
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col justify-center">
                            <p className="text-slate-400 text-sm font-medium">Aún no hay suficientes fallos para identificar un patrón negativo claro.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
