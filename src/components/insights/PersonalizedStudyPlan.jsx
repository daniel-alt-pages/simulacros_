import React, { useMemo } from 'react';
import { BookOpen, Clock, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { classifyGlobalScore, getStrategicPlan, identifyWeakCompetencies } from '../../services/classificationService';

export default function PersonalizedStudyPlan({ user }) {
    const studyPlan = useMemo(() => {
        const globalScore = user.global_score || 0;
        const classification = classifyGlobalScore(globalScore);
        const plan = getStrategicPlan(classification.key);
        const weaknesses = identifyWeakCompetencies(user);

        // Get top 3 priority areas
        const priorities = weaknesses.slice(0, 3);

        return {
            classification,
            plan,
            priorities,
            recommendations: classification.recommendations
        };
    }, [user]);

    const getPriorityColor = (severity) => {
        return severity === 'CRITICAL' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
            severity === 'HIGH' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                'text-blue-400 bg-blue-500/10 border-blue-500/30';
    };

    return (
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white">Plan de Estudio Personalizado</h2>
                        <p className="text-indigo-100 font-semibold">
                            Basado en tu rango: <span className="font-black">{studyPlan.classification.label}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Time Allocation */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={20} className="text-indigo-400" />
                        <h3 className="text-xl font-black text-white">⏱️ Distribución Semanal Recomendada</h3>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-slate-400">Total Semanal:</span>
                            <span className="text-3xl font-black text-indigo-400">{studyPlan.plan.weeklyHours}h</span>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(studyPlan.plan.timeAllocation).map(([area, hours]) => {
                                const percentage = (hours / studyPlan.plan.weeklyHours) * 100;
                                return (
                                    <div key={area}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-slate-300">{area}</span>
                                            <span className="text-sm font-bold text-indigo-400">{hours}h ({Math.round(percentage)}%)</span>
                                        </div>
                                        <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Priority Areas */}
                {studyPlan.priorities.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Target size={20} className="text-amber-400" />
                            <h3 className="text-xl font-black text-white">🎯 Prioridades Inmediatas</h3>
                        </div>

                        <div className="space-y-4">
                            {studyPlan.priorities.map((priority, idx) => (
                                <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                    <div className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl border ${getPriorityColor(priority.severity)}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-black text-white">{priority.area}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(priority.severity)}`}>
                                                    {priority.severity === 'CRITICAL' ? 'Crítico' : 'Alta Prioridad'}
                                                </span>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Nivel Actual:</span>
                                                    <p className="text-sm font-semibold text-slate-300">Nivel {priority.currentLevel} ({priority.currentScore} pts)</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Brecha:</span>
                                                    <p className="text-sm font-semibold text-amber-400">{priority.gap} puntos al Nivel {priority.targetLevel}</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
                                                <p className="text-sm font-semibold text-indigo-300 mb-2">
                                                    <Lightbulb size={14} className="inline mr-1" />
                                                    {priority.recommendation}
                                                </p>
                                                {priority.missingEvidences.length > 0 && (
                                                    <div className="mt-3">
                                                        <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Competencias a Desarrollar:</span>
                                                        <ul className="space-y-1">
                                                            {priority.missingEvidences.slice(0, 2).map((evidence, i) => (
                                                                <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                                                                    <span className="text-indigo-500 mt-0.5">▸</span>
                                                                    <span>{evidence}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* General Recommendations */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-emerald-400" />
                        <h3 className="text-xl font-black text-white">💡 Recomendaciones Estratégicas</h3>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                        <ul className="space-y-3">
                            {studyPlan.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-300 font-medium">
                                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 text-center">
                    <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-900/40 hover:shadow-indigo-600/40 transform hover:scale-105 active:scale-95">
                        📅 Descargar Plan de Estudio Completo (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
}
