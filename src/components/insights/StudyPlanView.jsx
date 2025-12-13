import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Target, ChevronRight, ChevronDown,
    Lightbulb, TrendingUp, CheckCircle2, Clock,
    GraduationCap, Sparkles
} from 'lucide-react';
import { PERFORMANCE_LEVELS, getPerformanceLevel } from '../../services/performanceLevels.js';

/**
 * StudyPlanView - Plan de estudios personalizado basado en nivel actual
 */
export default function StudyPlanView({ studentData, onClose }) {
    const [expandedArea, setExpandedArea] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);

    // Generar plan personalizado para cada área
    const studyPlan = useMemo(() => {
        if (!studentData?.areas) return [];

        const areaMapping = {
            'matematicas': 'matematicas',
            'lectura critica': 'lectura critica',
            'ciencias naturales': 'ciencias naturales',
            'sociales y ciudadanas': 'sociales y ciudadanas',
            'ingles': 'ingles'
        };

        return Object.entries(studentData.areas).map(([areaName, areaData]) => {
            const normalizedKey = areaName.toLowerCase();
            const configKey = Object.keys(PERFORMANCE_LEVELS).find(k =>
                k.toLowerCase() === normalizedKey ||
                PERFORMANCE_LEVELS[k].name?.toLowerCase() === normalizedKey
            );

            if (!configKey) return null;

            const config = PERFORMANCE_LEVELS[configKey];
            const currentLevel = getPerformanceLevel(configKey, areaData.score);
            const nextLevel = Math.min(currentLevel + 1, 4);
            const currentLevelData = config.levels[currentLevel];
            const nextLevelData = config.levels[nextLevel];

            return {
                areaKey: configKey,
                areaName: config.name,
                icon: config.icon,
                color: config.color,
                score: areaData.score,
                currentLevel,
                nextLevel,
                currentLevelData,
                nextLevelData,
                syllabus: nextLevelData?.syllabus || currentLevelData?.syllabus || {},
                recommendations: nextLevelData?.recommendations || currentLevelData?.recommendations || [],
                competencies: nextLevelData?.competencies || currentLevelData?.competencies || []
            };
        }).filter(Boolean);
    }, [studentData]);

    // Priorizar áreas por score (menor primero)
    const prioritizedPlan = useMemo(() => {
        return [...studyPlan].sort((a, b) => a.score - b.score);
    }, [studyPlan]);

    const getPriorityBadge = (index) => {
        if (index === 0) return { text: 'PRIORIDAD ALTA', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
        if (index === 1) return { text: 'PRIORIDAD MEDIA', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
        return { text: 'PRIORIDAD NORMAL', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto mb-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Plan de Estudio Personalizado</h1>
                            <p className="text-slate-400 text-sm">Basado en tu desempeño actual</p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Cerrar
                        </button>
                    )}
                </div>

                {/* Global Score Summary */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <span className="text-slate-400 text-sm">Puntaje Global</span>
                        <div className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {studentData?.global_score || 0}/500
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-slate-400 text-sm">Meta sugerida</span>
                        <div className="text-2xl font-bold text-emerald-400">
                            {Math.min((studentData?.global_score || 0) + 50, 500)}/500
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Study Plan by Area */}
            <div className="max-w-4xl mx-auto space-y-4">
                {prioritizedPlan.map((area, index) => {
                    const priority = getPriorityBadge(index);
                    const isExpanded = expandedArea === area.areaKey;

                    return (
                        <motion.div
                            key={area.areaKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden"
                        >
                            {/* Area Header */}
                            <button
                                onClick={() => setExpandedArea(isExpanded ? null : area.areaKey)}
                                className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{area.icon}</span>
                                    <div className="text-left">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-white">{area.areaName}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priority.color}`}>
                                                {priority.text}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm">
                                            Nivel {area.currentLevel} → Nivel {area.nextLevel} | Score: {area.score}%
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                        <span className="text-slate-500 text-xs">Objetivo</span>
                                        <div className="text-emerald-400 font-bold">
                                            {area.nextLevelData?.badge || 'Siguiente nivel'}
                                        </div>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                            </button>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-700/50"
                                    >
                                        <div className="p-4 space-y-6">
                                            {/* What you need to learn */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Target className="w-5 h-5 text-indigo-400" />
                                                    <h4 className="font-semibold text-white">
                                                        Para subir al Nivel {area.nextLevel}, estudia:
                                                    </h4>
                                                </div>

                                                <div className="grid gap-3 md:grid-cols-2">
                                                    {Object.entries(area.syllabus).map(([topic, items]) => (
                                                        <div
                                                            key={topic}
                                                            className="bg-slate-800/50 rounded-xl p-3"
                                                        >
                                                            <h5 className="font-medium text-indigo-300 mb-2 flex items-center gap-2">
                                                                <BookOpen className="w-4 h-4" />
                                                                {topic}
                                                            </h5>
                                                            <ul className="space-y-1">
                                                                {(Array.isArray(items) ? items : [items]).slice(0, 4).map((item, i) => (
                                                                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                                                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" />
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Recommendations */}
                                            {area.recommendations.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Lightbulb className="w-5 h-5 text-amber-400" />
                                                        <h4 className="font-semibold text-white">Recomendaciones</h4>
                                                    </div>
                                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                                        <ul className="space-y-2">
                                                            {area.recommendations.map((rec, i) => (
                                                                <li key={i} className="text-amber-200 text-sm flex items-start gap-2">
                                                                    <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                                                    {rec}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Competencies to develop */}
                                            {area.competencies.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                                        <h4 className="font-semibold text-white">Competencias a desarrollar</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {area.competencies.slice(0, 4).map((comp, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-sm"
                                                            >
                                                                {comp}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer tip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-4xl mx-auto mt-8 text-center"
            >
                <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Estudia 1-2 temas por semana para mejores resultados
                </p>
            </motion.div>
        </div>
    );
}
