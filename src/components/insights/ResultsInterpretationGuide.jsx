import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, TrendingUp, Award, Target, Info, ChevronDown, ChevronUp,
    AlertCircle, CheckCircle, Star, BarChart3, Users
} from 'lucide-react';

/**
 * Componente de Guía de Interpretación de Resultados ICFES
 * Basado en información oficial de cómo interpretar puntajes Saber 11
 */
export default function ResultsInterpretationGuide({ studentData }) {
    const [expandedSection, setExpandedSection] = useState(null);

    // Defensive validation
    if (!studentData || !studentData.areas) {
        return (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
                <div className="text-center py-10">
                    <p className="text-slate-400">No hay datos disponibles para mostrar la guía de interpretación.</p>
                </div>
            </div>
        );
    }

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Calcular puntaje global (promedio ponderado como el ICFES)
    const calculateGlobalScore = () => {
        if (!studentData?.areas) return 0;

        const weights = {
            'matematicas': 3,
            'lectura critica': 3,
            'sociales y ciudadanas': 3,
            'ciencias naturales': 3,
            'ingles': 1
        };

        let totalWeighted = 0;
        let totalWeight = 0;

        Object.entries(studentData.areas).forEach(([areaKey, areaData]) => {
            const weight = weights[areaKey] || 1;
            totalWeighted += (areaData.score || 0) * weight;
            totalWeight += weight;
        });

        // Escala 0-100 a 0-500 (como ICFES)
        const avgScore = totalWeighted / totalWeight;
        return Math.round((avgScore / 100) * 500);
    };

    const globalScore = calculateGlobalScore();

    // Clasificación del puntaje global
    const getGlobalClassification = (score) => {
        if (score >= 400) return { level: 'Excelente', color: 'emerald', icon: Star, desc: 'Puntaje sobresaliente' };
        if (score >= 300) return { level: 'Bueno', color: 'blue', icon: TrendingUp, desc: 'Puntaje competitivo' };
        if (score >= 200) return { level: 'Aceptable', color: 'amber', icon: Target, desc: 'Puntaje promedio' };
        return { level: 'Bajo', color: 'red', icon: AlertCircle, desc: 'Requiere refuerzo' };
    };

    const classification = getGlobalClassification(globalScore);
    const Icon = classification.icon;

    const sections = [
        {
            id: 'global',
            title: '¿Qué es el Puntaje Global?',
            icon: BarChart3,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        El <span className="font-bold text-white">puntaje global</span> es un promedio ponderado de tus resultados en todas las áreas evaluadas.
                        Va de <span className="font-bold text-indigo-400">0 a 500 puntos</span>.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                            <Info size={16} className="text-cyan-400" />
                            Ponderación de Áreas
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Matemáticas</span>
                                <span className="font-bold text-white">Peso: 3</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Lectura Crítica</span>
                                <span className="font-bold text-white">Peso: 3</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Sociales y Ciudadanas</span>
                                <span className="font-bold text-white">Peso: 3</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Ciencias Naturales</span>
                                <span className="font-bold text-white">Peso: 3</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Inglés</span>
                                <span className="font-bold text-amber-400">Peso: 1</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-4">
                        <h4 className="font-bold text-white mb-2">Interpretación de Rangos</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-slate-300"><span className="font-bold text-emerald-400">400-500:</span> Excelente (Top 10%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-slate-300"><span className="font-bold text-blue-400">300-399:</span> Bueno (Top 30%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-slate-300"><span className="font-bold text-amber-400">200-299:</span> Aceptable (Promedio)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-slate-300"><span className="font-bold text-red-400">0-199:</span> Bajo (Requiere refuerzo)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'areas',
            title: 'Puntajes por Área (0-100)',
            icon: Target,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Cada área se califica de <span className="font-bold text-white">0 a 100 puntos</span>.
                        Este puntaje te ayuda a identificar tus fortalezas y áreas de mejora.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                        <h4 className="font-bold text-white mb-3">Interpretación por Área</h4>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-emerald-400 font-bold">86-100 puntos</span>
                                    <span className="text-slate-400">Excelente</span>
                                </div>
                                <p className="text-slate-400 text-xs">Dominio sobresaliente de competencias</p>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-blue-400 font-bold">70-85 puntos</span>
                                    <span className="text-slate-400">Bueno</span>
                                </div>
                                <p className="text-slate-400 text-xs">Buen manejo de conceptos y habilidades</p>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-amber-400 font-bold">50-69 puntos</span>
                                    <span className="text-slate-400">Aceptable</span>
                                </div>
                                <p className="text-slate-400 text-xs">Conocimientos básicos, puede mejorar</p>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-red-400 font-bold">0-49 puntos</span>
                                    <span className="text-slate-400">Insuficiente</span>
                                </div>
                                <p className="text-slate-400 text-xs">Requiere refuerzo significativo</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'levels',
            title: 'Niveles de Desempeño',
            icon: Award,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Los <span className="font-bold text-white">niveles de desempeño</span> describen las habilidades y conocimientos
                        que has desarrollado en cada área. Van del <span className="font-bold text-indigo-400">Nivel 1 al 4</span>
                        (en Inglés de A- a B+).
                    </p>

                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                            <CheckCircle size={16} className="text-purple-400" />
                            Características Importantes
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Cada área tiene sus propios niveles de desempeño específicos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>La dificultad aumenta progresivamente del nivel 1 al 4</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Alcanzar un nivel significa que dominas ese nivel y todos los anteriores</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                        <h4 className="font-bold text-white mb-2">Ejemplo: Niveles en Matemáticas</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">N1</span>
                                <span className="text-slate-400">Interpretas datos directos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-bold">N2</span>
                                <span className="text-slate-400">Usas procedimientos básicos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">N3</span>
                                <span className="text-slate-400">Resuelves problemas tipo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold">N4</span>
                                <span className="text-slate-400">Modelas fenómenos complejos</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'percentil',
            title: '¿Qué es el Percentil?',
            icon: Users,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        El <span className="font-bold text-white">percentil</span> indica el porcentaje de estudiantes que obtuvieron
                        un puntaje igual o inferior al tuyo. Va de <span className="font-bold text-indigo-400">0 a 100</span>.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                        <h4 className="font-bold text-white mb-3">Interpretación del Percentil</h4>
                        <div className="space-y-3 text-sm">
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Star size={14} className="text-emerald-400" />
                                    <span className="font-bold text-emerald-400">Percentil 85-100</span>
                                </div>
                                <p className="text-slate-300 text-xs">
                                    Estás en el <span className="font-bold">top 15%</span> de estudiantes. ¡Excelente desempeño!
                                </p>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp size={14} className="text-blue-400" />
                                    <span className="font-bold text-blue-400">Percentil 50-84</span>
                                </div>
                                <p className="text-slate-300 text-xs">
                                    Estás por encima del promedio. Buen trabajo.
                                </p>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target size={14} className="text-amber-400" />
                                    <span className="font-bold text-amber-400">Percentil 25-49</span>
                                </div>
                                <p className="text-slate-300 text-xs">
                                    Estás en el rango promedio. Hay espacio para mejorar.
                                </p>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle size={14} className="text-red-400" />
                                    <span className="font-bold text-red-400">Percentil 0-24</span>
                                </div>
                                <p className="text-slate-300 text-xs">
                                    Necesitas reforzar tus conocimientos. ¡Sigue practicando!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4">
                        <p className="text-sm text-slate-300">
                            <span className="font-bold text-cyan-400">Ejemplo:</span> Si tu percentil es 75, significa que
                            obtuviste un puntaje igual o superior al <span className="font-bold text-white">75% de los estudiantes</span> que
                            presentaron la prueba.
                        </p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <BookOpen size={24} className="text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white">Guía de Interpretación de Resultados</h2>
                </div>
                <p className="text-slate-400 text-sm">
                    Aprende a interpretar tus puntajes según los estándares del ICFES Saber 11°
                </p>
            </div>

            {/* Tu Puntaje Global */}
            <div className={`bg-gradient-to-r from-${classification.color}-500/10 to-${classification.color}-500/5 border border-${classification.color}-500/30 rounded-2xl p-6 mb-6`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Tu Puntaje Global</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-white">{globalScore}</span>
                            <span className="text-slate-500 text-lg">/500</span>
                        </div>
                    </div>
                    <div className={`p-4 bg-${classification.color}-500/20 rounded-xl`}>
                        <Icon size={32} className={`text-${classification.color}-400`} />
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 bg-${classification.color}-500/20 rounded-lg border border-${classification.color}-500/30`}>
                    <span className={`font-bold text-${classification.color}-400`}>{classification.level}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300 text-sm">{classification.desc}</span>
                </div>
            </div>

            {/* Secciones Expandibles */}
            <div className="space-y-3">
                {sections.map((section) => {
                    const SectionIcon = section.icon;
                    const isExpanded = expandedSection === section.id;

                    return (
                        <div key={section.id} className="bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <SectionIcon size={20} className="text-indigo-400" />
                                    <span className="font-bold text-white">{section.title}</span>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp size={20} className="text-slate-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-slate-400" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 border-t border-slate-800">
                                            {section.content}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-slate-950/50 border border-slate-700 rounded-xl">
                <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-300">Nota importante:</span> Esta interpretación está basada en los
                    estándares oficiales del ICFES. Los puntajes de esta plataforma son simulaciones educativas y pueden variar
                    respecto al examen oficial. Úsalos como guía de preparación.
                </p>
            </div>
        </div>
    );
}
