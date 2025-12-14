import React from 'react';
import { Award, Target, CheckCircle2, Sparkles } from 'lucide-react';

/**
 * Tarjeta de Nivel de Desempeño
 * Muestra el nivel actual del estudiante, su progreso dentro del nivel
 * y las competencias que domina.
 */
export default function PerformanceLevelCard({ currentScore, levelData, onViewDetails }) {
    if (!levelData) return null;

    const colorClasses = {
        red: {
            bg: 'from-red-500/10 to-rose-500/5',
            border: 'border-red-500/30',
            text: 'text-red-400',
            badge: 'bg-red-500/20 text-red-300 border-red-500/40',
            glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]'
        },
        amber: {
            bg: 'from-amber-500/10 to-orange-500/5',
            border: 'border-amber-500/30',
            text: 'text-amber-400',
            badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]'
        },
        cyan: {
            bg: 'from-cyan-500/10 to-blue-500/5',
            border: 'border-cyan-500/30',
            text: 'text-cyan-400',
            badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
            glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]'
        },
        blue: {
            bg: 'from-blue-500/10 to-indigo-500/5',
            border: 'border-blue-500/30',
            text: 'text-blue-400',
            badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
            glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]'
        },
        emerald: {
            bg: 'from-emerald-500/10 to-teal-500/5',
            border: 'border-emerald-500/30',
            text: 'text-emerald-400',
            badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
            glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]'
        }
    };

    const colors = colorClasses[levelData.color] || colorClasses.cyan;
    const [min, max] = levelData.range || [0, 100];
    const progress = ((currentScore - min) / (max - min)) * 100;

    // Defensive checks for arrays
    const competencies = Array.isArray(levelData.competencies) ? levelData.competencies : [];
    const recommendations = Array.isArray(levelData.recommendations) ? levelData.recommendations : [];

    return (
        <div className={`relative bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl border ${colors.border} p-6 ${colors.glow} transition-all duration-300 hover:scale-[1.02] premium-card`}>

            {/* Header con nivel y badge */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                        <div className={`mt-1 p-2 rounded-xl ${colors.badge} border flex-shrink-0`}>
                            <Award size={20} />
                        </div>
                        <h4 className={`text-lg font-black ${colors.text} leading-tight break-words`}>
                            {levelData.title}
                        </h4>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed pl-1">
                        {levelData.description}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border text-center whitespace-nowrap ${colors.badge}`}>
                        {levelData.badge}
                    </span>
                    {onViewDetails && (
                        <button
                            onClick={onViewDetails}
                            className={`text-[10px] font-bold uppercase tracking-wider ${colors.text} hover:opacity-80 transition-opacity flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md whitespace-nowrap`}
                        >
                            Ver Detalle <Target size={10} />
                        </button>
                    )}
                </div>
            </div>

            {/* Barra de progreso dentro del nivel */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400">Progreso en este nivel</span>
                    <span className={`text-xs font-black ${colors.text}`}>{Math.min(100, Math.max(0, progress)).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                        className={`h-full bg-gradient-to-r ${colors.bg.replace('/10', '/60').replace('/5', '/40')} transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                </div>
            </div>

            {/* Competencias */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={16} className={colors.text} />
                    <h5 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                        Competencias de este nivel
                    </h5>
                </div>
                <div className="space-y-2">
                    {competencies.length > 0 ? (
                        competencies.slice(0, 3).map((competency, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                                <div className={`w-1.5 h-1.5 rounded-full ${colors.text} mt-1.5 flex-shrink-0`} />
                                <span className="text-slate-300 leading-relaxed">{competency}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-slate-500">Información de competencias no disponible.</p>
                    )}

                    {competencies.length > 3 && (
                        <p className="text-xs text-slate-500 italic ml-3.5">
                            +{competencies.length - 3} competencias más
                        </p>
                    )}
                </div>
            </div>

            {/* Recomendaciones clave */}
            <div className="pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className="text-indigo-400" />
                    <h5 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                        Plan de Acción
                    </h5>
                </div>
                <div className="space-y-2">
                    {recommendations.length > 0 ? (
                        recommendations.slice(0, 2).map((rec, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                                <Sparkles size={12} className="text-indigo-400 mt-1 flex-shrink-0" />
                                <span className="text-slate-300 leading-relaxed font-medium">{rec}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-slate-500">Sin recomendaciones específicas.</p>
                    )}
                </div>
            </div>

            {/* Decorative glow */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.bg.replace('/10', '/20').replace('/5', '/10')} rounded-2xl blur-xl -z-10 opacity-50`} />
        </div>
    );
}
