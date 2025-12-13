import React from 'react';
import { motion } from 'framer-motion';
import { Target, AlertCircle, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export function DiagnosisTab({ areaKey, areaData, level, config }) {
    const questions = areaData?.question_details || [];

    // Análisis de errores por competencia
    const competencyAnalysis = React.useMemo(() => {
        const competencies = {};

        questions.forEach(q => {
            const competency = q.competency || 'General';
            if (!competencies[competency]) {
                competencies[competency] = {
                    total: 0,
                    correct: 0,
                    incorrect: 0,
                    questions: []
                };
            }

            competencies[competency].total++;
            competencies[competency].questions.push(q);

            if (q.isCorrect || q.status === 'correct') {
                competencies[competency].correct++;
            } else {
                competencies[competency].incorrect++;
            }
        });

        // Calcular porcentajes y ordenar por debilidad
        return Object.entries(competencies)
            .map(([name, data]) => ({
                name,
                ...data,
                accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
            }))
            .sort((a, b) => a.accuracy - b.accuracy); // Más débiles primero
    }, [questions]);

    // Análisis de distractores más comunes
    const commonMistakes = React.useMemo(() => {
        const mistakes = [];

        questions.forEach((q, idx) => {
            if (!(q.isCorrect || q.status === 'correct')) {
                mistakes.push({
                    questionNumber: idx + 1,
                    userAnswer: q.value,
                    competency: q.competency || 'General',
                    question: q
                });
            }
        });

        return mistakes.slice(0, 5); // Top 5 errores
    }, [questions]);

    const totalQuestions = questions.length;
    const correctQuestions = questions.filter(q => q.isCorrect || q.status === 'correct').length;
    const globalAccuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-black text-white">Diagnóstico de Competencias</h2>

            {/* Level Description */}
            {level && (
                <div className={`${config.bgAccent} border ${config.borderAccent} rounded-xl p-6`}>
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-black text-xl flex-shrink-0`}>
                            {level.level}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">
                                {level.title}
                            </h3>
                            <p className="text-sm text-slate-300 mb-3">
                                {level.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`}></div>
                                    <span className="text-slate-400">Rango: {level.range[0]} - {level.range[1]} pts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className={`w-4 h-4 ${config.color}`} />
                                    <span className="text-slate-400">Precisión Global: {globalAccuracy}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Competency Breakdown */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Target className={`w-5 h-5 ${config.color}`} />
                    Análisis por Competencia
                </h3>

                <div className="space-y-3">
                    {competencyAnalysis.map((comp, idx) => (
                        <div key={comp.name} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${comp.accuracy >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                                            comp.accuracy >= 50 ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-red-500/20 text-red-400'
                                        } flex items-center justify-center font-bold text-sm`}>
                                        {comp.accuracy}%
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{comp.name}</div>
                                        <div className="text-xs text-slate-400">
                                            {comp.correct}/{comp.total} correctas
                                        </div>
                                    </div>
                                </div>
                                {comp.accuracy < 50 && (
                                    <div className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                                        <AlertCircle className="w-3 h-3" />
                                        Prioridad
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${comp.accuracy}%` }}
                                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.8 }}
                                    className={`h-full ${comp.accuracy >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                            comp.accuracy >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                                'bg-gradient-to-r from-red-500 to-pink-500'
                                        }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Common Mistakes */}
            {commonMistakes.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-400" />
                        Errores Más Comunes
                    </h3>

                    <div className="space-y-2">
                        {commonMistakes.map((mistake, idx) => (
                            <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-red-500/20 hover:border-red-500/40 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">
                                            P{mistake.questionNumber}
                                        </div>
                                        <div>
                                            <div className="text-sm text-white">
                                                Competencia: <span className="font-bold">{mistake.competency}</span>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Tu respuesta: <span className="text-red-400 font-mono">{mistake.userAnswer}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
                                        Revisar →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Next Steps */}
            <div className={`${config.bgAccent} border ${config.borderAccent} rounded-xl p-6`}>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className={`w-5 h-5 ${config.color}`} />
                    Próximos Pasos
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                    {competencyAnalysis.slice(0, 3).map((comp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${config.color} flex-shrink-0 mt-0.5`}>
                                {idx + 1}
                            </div>
                            <span>
                                Reforzar <span className="font-bold">{comp.name}</span>
                                {comp.accuracy < 50 && <span className="text-red-400"> (Prioridad Alta)</span>}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
