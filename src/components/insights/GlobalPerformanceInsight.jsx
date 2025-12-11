import React from 'react';
import { TrendingUp, AlertCircle, Trophy, Target, Zap } from 'lucide-react';
import { getGlobalPerformanceRange } from '../../services/performanceLevels';

/**
 * Componente de insight global basado en el puntaje 0-500
 */
export default function GlobalPerformanceInsight({ globalScore }) {
    const rangeData = getGlobalPerformanceRange(globalScore);

    if (!rangeData) return null;

    const colorClasses = {
        red: {
            gradient: 'from-red-500 via-rose-500 to-pink-600',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            text: 'text-red-400',
            icon: AlertCircle
        },
        amber: {
            gradient: 'from-amber-500 via-orange-500 to-yellow-600',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30',
            text: 'text-amber-400',
            icon: TrendingUp
        },
        cyan: {
            gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/30',
            text: 'text-cyan-400',
            icon: Target
        },
        emerald: {
            gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            text: 'text-emerald-400',
            icon: Trophy
        }
    };

    const colors = colorClasses[rangeData.color] || colorClasses.cyan;
    const Icon = colors.icon;

    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl shadow-2xl">

            {/* Decorative background */}
            <div className="absolute inset-0 opacity-10">
                <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl -mr-48 -mt-48`} />
                <div className={`absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr ${colors.gradient} rounded-full blur-3xl -ml-48 -mb-48`} />
            </div>

            <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${colors.bg} border ${colors.border} backdrop-blur-sm`}>
                            <Icon size={32} className={colors.text} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-1">
                                {rangeData.title}
                            </h3>
                            <p className="text-slate-400 font-semibold">
                                Puntaje Global: <span className={`${colors.text} font-black`}>{globalScore}</span> / 500
                            </p>
                        </div>
                    </div>

                    <div className={`px-4 py-2 rounded-xl ${colors.bg} border ${colors.border} backdrop-blur-sm`}>
                        <p className="text-xs font-bold text-slate-400 mb-1">Rango</p>
                        <p className={`text-lg font-black ${colors.text}`}>{rangeData.range}</p>
                    </div>
                </div>

                {/* Description */}
                <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border} mb-6`}>
                    <p className="text-slate-200 font-medium leading-relaxed">
                        {rangeData.description}
                    </p>
                </div>

                {/* Focus Strategy */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={18} className="text-indigo-400" />
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            Estrategia de Enfoque
                        </h4>
                    </div>
                    <p className={`text-sm font-bold ${colors.text} bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-700/50`}>
                        {rangeData.focus}
                    </p>
                </div>

                {/* Priority Actions */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Target size={18} className="text-cyan-400" />
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            Acciones Prioritarias
                        </h4>
                    </div>
                    <div className="grid gap-3">
                        {rangeData.priority.map((action, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600/50 transition-all group"
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${colors.bg} border ${colors.border} flex-shrink-0 font-black ${colors.text} group-hover:scale-110 transition-transform`}>
                                    {idx + 1}
                                </div>
                                <p className="text-slate-200 font-medium leading-relaxed flex-1">
                                    {action}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom gradient bar */}
            <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />
        </div>
    );
}
