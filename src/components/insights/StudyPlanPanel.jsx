import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Target, Sparkles, Award, TrendingUp } from 'lucide-react';
import { PERFORMANCE_LEVELS } from '../../services/performanceLevels';

/**
 * Panel de Estudio Detallado con Temarios ICFES
 * Muestra el syllabus completo por nivel con estructura expandible
 */
export default function StudyPlanPanel({ areaName, currentLevel, currentScore, totalQuestions }) {
    const [expandedSections, setExpandedSections] = useState({});
    const [selectedLevel, setSelectedLevel] = useState(currentLevel);

    const areaConfig = PERFORMANCE_LEVELS[areaName];
    if (!areaConfig) return null;

    const levelData = areaConfig.levels[selectedLevel];
    if (!levelData) return null;

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const colorClasses = {
        red: {
            bg: 'from-red-500/10 to-rose-500/5',
            border: 'border-red-500/30',
            text: 'text-red-400',
            badge: 'bg-red-500/20 text-red-300 border-red-500/40'
        },
        amber: {
            bg: 'from-amber-500/10 to-orange-500/5',
            border: 'border-amber-500/30',
            text: 'text-amber-400',
            badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        },
        cyan: {
            bg: 'from-cyan-500/10 to-blue-500/5',
            border: 'border-cyan-500/30',
            text: 'text-cyan-400',
            badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
        },
        blue: {
            bg: 'from-blue-500/10 to-indigo-500/5',
            border: 'border-blue-500/30',
            text: 'text-blue-400',
            badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        },
        emerald: {
            bg: 'from-emerald-500/10 to-teal-500/5',
            border: 'border-emerald-500/30',
            text: 'text-emerald-400',
            badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }
    };

    const colors = colorClasses[levelData.color] || colorClasses.cyan;

    return (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden">

            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${colors.bg} border-b border-slate-800`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${colors.badge} border`}>
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white">
                                Plan de Estudio - {areaConfig.name}
                            </h3>
                            <p className="text-slate-400 text-sm font-semibold">
                                Basado en Guía ICFES 2026
                            </p>
                        </div>
                    </div>

                    <span className={`px-4 py-2 rounded-xl text-sm font-black border ${colors.badge}`}>
                        {totalQuestions || areaConfig.totalQuestions || 0} preguntas
                    </span>
                </div>

                {/* Competencies Distribution */}
                {areaConfig.competencies && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Object.entries(areaConfig.competencies).map(([comp, percentage]) => (
                            <div key={comp} className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-400">{comp}</span>
                                    <span className={`text-sm font-black ${colors.text}`}>{percentage}</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${colors.bg.replace('/10', '/60').replace('/5', '/40')}`}
                                        style={{ width: percentage }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Level Selector */}
            <div className="p-6 border-b border-slate-800">
                <h4 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-4">
                    Selecciona el Nivel de Estudio
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(areaConfig.levels).map(([levelNum, level]) => {
                        const isSelected = parseInt(levelNum) === selectedLevel;
                        const isCurrent = parseInt(levelNum) === currentLevel;
                        const levelColors = colorClasses[level.color];

                        return (
                            <button
                                key={levelNum}
                                onClick={() => setSelectedLevel(parseInt(levelNum))}
                                className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                    ? `${levelColors.border} bg-gradient-to-br ${levelColors.bg}`
                                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-lg font-black ${isSelected ? levelColors.text : 'text-slate-400'}`}>
                                        Nivel {levelNum}
                                    </span>
                                    {isCurrent && (
                                        <Award size={16} className="text-indigo-400" />
                                    )}
                                </div>
                                <p className={`text-xs font-bold ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                                    {level.badge}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Level Content */}
            <div className="p-6">
                {/* Level Description */}
                <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border} mb-6`}>
                    <h4 className={`text-lg font-black ${colors.text} mb-2`}>
                        {levelData.title}
                    </h4>
                    <p className="text-slate-300 font-medium leading-relaxed">
                        {levelData.description}
                    </p>
                </div>

                {/* Competencies */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Target size={18} className="text-cyan-400" />
                        <h5 className="text-sm font-black text-white uppercase tracking-wider">
                            Competencias del Nivel {selectedLevel}
                        </h5>
                    </div>
                    <div className="grid gap-2">
                        {levelData.competencies.map((comp, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${colors.badge} border flex-shrink-0 text-xs font-black`}>
                                    {idx + 1}
                                </div>
                                <p className="text-slate-200 font-medium leading-relaxed flex-1">
                                    {comp}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Syllabus (Temario) */}
                {levelData.syllabus && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen size={18} className="text-indigo-400" />
                            <h5 className="text-sm font-black text-white uppercase tracking-wider">
                                Temario Detallado
                            </h5>
                        </div>
                        <div className="space-y-3">
                            {Object.entries(levelData.syllabus).map(([section, topics]) => {
                                const isExpanded = expandedSections[section];

                                return (
                                    <div key={section} className="border border-slate-700/50 rounded-xl overflow-hidden bg-slate-800/30">
                                        <button
                                            onClick={() => toggleSection(section)}
                                            className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                                        >
                                            <span className="text-sm font-black text-slate-200">
                                                {section}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-500">
                                                    {topics.length} temas
                                                </span>
                                                {isExpanded ? (
                                                    <ChevronDown size={18} className="text-slate-400" />
                                                ) : (
                                                    <ChevronRight size={18} className="text-slate-400" />
                                                )}
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="p-4 pt-0 space-y-2">
                                                {topics.map((topic, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                                        <Sparkles size={14} className={`${colors.text} mt-1 flex-shrink-0`} />
                                                        <span className="text-slate-300 leading-relaxed">{topic}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={18} className="text-emerald-400" />
                        <h5 className="text-sm font-black text-white uppercase tracking-wider">
                            Plan de Acción Recomendado
                        </h5>
                    </div>
                    <div className="grid gap-3">
                        {levelData.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/30">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex-shrink-0 font-black text-sm">
                                    {idx + 1}
                                </div>
                                <p className="text-slate-200 font-medium leading-relaxed flex-1">
                                    {rec}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Level Preview */}
                {areaConfig.levels[selectedLevel + 1] && (
                    <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Award size={16} className="text-indigo-400" />
                            <h6 className="text-sm font-black text-indigo-300 uppercase tracking-wider">
                                Próximo Nivel: {areaConfig.levels[selectedLevel + 1].title}
                            </h6>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mb-3">
                            {areaConfig.levels[selectedLevel + 1].description}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Rango:</span>
                            <span className="text-xs font-black text-indigo-400">
                                {areaConfig.levels[selectedLevel + 1].range[0]} - {areaConfig.levels[selectedLevel + 1].range[1]} puntos
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
