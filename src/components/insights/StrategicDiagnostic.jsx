import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Award, AlertTriangle } from 'lucide-react';
import { classifyGlobalScore, calculateGapAnalysis, getCompetencyDistribution } from '../../services/classificationService';

export default function StrategicDiagnostic({ user, db }) {
    const diagnostic = useMemo(() => {
        const globalScore = user.global_score || 0;
        const classification = classifyGlobalScore(globalScore);

        // Calculate percentile
        const allScores = db.students?.map(s => s.global_score) || [];
        const sortedScores = [...allScores].sort((a, b) => b - a);
        const rank = sortedScores.indexOf(globalScore) + 1;
        const percentile = Math.round((1 - rank / sortedScores.length) * 100);

        // Get competency distribution
        const distribution = getCompetencyDistribution(user);
        const predominantLevel = Object.entries(distribution)
            .sort((a, b) => b[1] - a[1])[0];

        // Calculate gap to excellence
        const excellenceGap = classification.nextRange ?
            calculateGapAnalysis(globalScore, 381) : null;

        return {
            classification,
            percentile,
            distribution,
            predominantLevel: predominantLevel ? parseInt(predominantLevel[0]) : 1,
            excellenceGap,
            totalAreas: user.areas?.length || 5
        };
    }, [user, db]);

    const getTrendIcon = () => {
        if (diagnostic.percentile >= 75) return <TrendingUp className="text-emerald-400" size={24} />;
        if (diagnostic.percentile >= 50) return <Minus className="text-blue-400" size={24} />;
        return <TrendingDown className="text-amber-400" size={24} />;
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden group">
            {/* Animated Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Target size={28} className="text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">Diagnóstico Estratégico</h2>
                        <p className="text-slate-400 font-semibold">Análisis Psicométrico Basado en Marco ICFES</p>
                    </div>
                </div>

                {/* Main Diagnostic Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Range Classification */}
                    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Rango Global</span>
                            <span className="text-2xl">{diagnostic.classification.icon}</span>
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-xl border-2 ${diagnostic.classification.borderColor} ${diagnostic.classification.bgColor}/10 mb-3`}>
                            <span className={`text-xl font-black ${diagnostic.classification.textColor}`}>
                                {diagnostic.classification.label.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium mb-3">
                            {diagnostic.classification.description}
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full ${diagnostic.classification.bgColor} transition-all duration-500`}
                                    style={{ width: `${diagnostic.classification.positionInRange}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-400">
                                {diagnostic.classification.positionInRange}%
                            </span>
                        </div>
                    </div>

                    {/* Percentile & Ranking */}
                    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Percentil</span>
                            {getTrendIcon()}
                        </div>
                        <div className="text-5xl font-black text-indigo-400 mb-2">
                            {diagnostic.percentile}
                        </div>
                        <p className="text-sm text-slate-400 font-semibold mb-3">
                            Top {100 - diagnostic.percentile}% del grupo
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Award size={14} />
                            <span>Mejor que {diagnostic.percentile}% de estudiantes</span>
                        </div>
                    </div>

                    {/* Competency Distribution */}
                    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Nivel Predominante</span>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl ${diagnostic.predominantLevel === 4 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                diagnostic.predominantLevel === 3 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                    diagnostic.predominantLevel === 2 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                        'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {diagnostic.predominantLevel}
                            </div>
                        </div>
                        <div className="space-y-2 mb-3">
                            {Object.entries(diagnostic.distribution).map(([level, count]) => (
                                <div key={level} className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500 w-16">Nivel {level}:</span>
                                    <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${level === '4' ? 'bg-emerald-500' :
                                                level === '3' ? 'bg-blue-500' :
                                                    level === '2' ? 'bg-amber-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${(count / diagnostic.totalAreas) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 w-8">{count}/{diagnostic.totalAreas}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gap Analysis to Excellence */}
                {diagnostic.excellenceGap && diagnostic.classification.key !== 'EXCELLENCE' && (
                    <div className="mt-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-500/20 rounded-xl">
                                <AlertTriangle size={24} className="text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-black text-white mb-2">
                                    📊 Brecha hacia Excelencia (381+ pts)
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500 font-semibold">Puntos Necesarios:</span>
                                        <p className="text-2xl font-black text-indigo-400">{diagnostic.excellenceGap.gap}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-semibold">Esfuerzo Estimado:</span>
                                        <p className="text-lg font-bold text-slate-300">{diagnostic.excellenceGap.estimatedWeeks} semanas</p>
                                        <p className="text-xs text-slate-500">~{diagnostic.excellenceGap.estimatedHours}h de estudio</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-semibold">Factibilidad:</span>
                                        <p className="text-lg font-bold text-emerald-400">{diagnostic.excellenceGap.feasibility}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
