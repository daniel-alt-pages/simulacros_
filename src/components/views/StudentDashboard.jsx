import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar,
    PieChart, Pie, Cell
} from 'recharts';
import {
    BookOpen, Target, Brain, TrendingUp, AlertCircle, CheckCircle2,
    Award, ArrowRight, Zap, Clock, Calendar, Check, ArrowUpCircle, X, BrainCircuit, Users, Calculator, FlaskConical, Languages, TrendingDown, Minus, Trophy, Star, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AREA_CONFIG = {
    "matematicas": {
        color: "text-red-400",
        bg: "bg-red-500/15",
        border: "border-red-500/30",
        icon: Calculator,
        gradient: "from-red-500 via-rose-500 to-pink-600",
        chartColor: "#f43f5e",
        scoreColor: "text-red-300",
        nameColor: "text-red-100"
    },
    "lectura critica": {
        color: "text-cyan-400",
        bg: "bg-cyan-500/15",
        border: "border-cyan-500/30",
        icon: BookOpen,
        gradient: "from-cyan-500 via-sky-500 to-blue-600",
        chartColor: "# 06b6d4",
        scoreColor: "text-cyan-300",
        nameColor: "text-cyan-100"
    },
    "sociales y ciudadanas": {
        color: "text-amber-400",
        bg: "bg-amber-500/15",
        border: "border-amber-500/30",
        icon: Users,
        gradient: "from-amber-500 via-orange-500 to-yellow-600",
        chartColor: "#f59e0b",
        scoreColor: "text-amber-300",
        nameColor: "text-amber-100"
    },
    "ciencias naturales": {
        color: "text-emerald-400",
        bg: "bg-emerald-500/15",
        border: "border-emerald-500/30",
        icon: FlaskConical,
        gradient: "from-emerald-500 via-green-500 to-teal-600",
        chartColor: "#10b981",
        scoreColor: "text-emerald-300",
        nameColor: "text-emerald-100"
    },
    "ingles": {
        color: "text-purple-400",
        bg: "bg-purple-500/15",
        border: "border-purple-500/30",
        icon: Languages,
        gradient: "from-purple-500 via-violet-500 to-fuchsia-600",
        chartColor: "#a855f7",
        scoreColor: "text-purple-300",
        nameColor: "text-purple-100"
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

import { StudentAnalyticsEngine } from '../../services/analyticsEngine';
import AnalyticsGrid from '../analytics/AnalyticsGrid';
import ResultsInterpretationGuide from '../insights/ResultsInterpretationGuide';
import PerformanceLevelCard from '../insights/PerformanceLevelCard';
import GlobalPerformanceInsight from '../insights/GlobalPerformanceInsight';
import StudyPlanPanel from '../insights/StudyPlanPanel';
import { getPerformanceLevel, calculateGlobalScore } from '../../services/performanceLevels';

export default function StudentDashboard({ user, db, setView }) {
    // 1. Hooks Declaration (ALWAYS FIRST)
    const [selectedArea, setSelectedArea] = useState(null);
    const [showStreakModal, setShowStreakModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    // Advanced Analytics using Engine
    const analytics = useMemo(() => {
        // Safe default structure
        const defaultAnalytics = {
            avgScore: 0,
            maxArea: { name: '', score: 0, data: {} },
            minArea: { name: '', score: 0, data: {} },
            globalAvg: 0,
            percentile: 0,
            consistency: 'low',
            badges: [],
            radarData: [],
            streakData: { maxStreak: 0, currentStreak: 0 },
            perfData: { consistencyScore: 0, totalQuestions: 0 }
        };

        // Defensive validation inside useMemo
        if (!user || !user.areas || typeof user.areas !== 'object' || Object.keys(user.areas).length === 0) {
            return defaultAnalytics;
        }

        const areas = Object.entries(user.areas);
        // Filter valid scores
        const validAreas = areas.filter(([_, data]) => data && typeof data.score === 'number');

        if (validAreas.length === 0) return defaultAnalytics;

        const scores = validAreas.map(([_, data]) => data.score);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0;

        const maxArea = validAreas.reduce((max, [name, data]) => {
            return data.score > max.score ? { name, score: data.score, data } : max;
        }, { name: '', score: -1, data: {} });

        // If no max area found (all scores -1?), fallback
        if (maxArea.score === -1) maxArea.score = 0;

        const minArea = validAreas.reduce((min, [name, data]) => {
            return data.score < min.score ? { name, score: data.score, data } : min;
        }, { name: '', score: 101, data: {} });

        if (minArea.score === 101) minArea.score = 0;

        // Populate analytics engine if available
        let engine;
        try {
            // Check if mock DB or real DB structure is used
            // Collect all questions from user areas for the engine with Area Context
            const allQuestions = Object.entries(user.areas).flatMap(([areaName, area]) =>
                (area.question_details || []).map(q => ({ ...q, areaName }))
            );
            engine = new StudentAnalyticsEngine(allQuestions);

            // Custom Streak Analysis (Avg & Breaker)
            let currentS = 0;
            let streaks = [];
            let maxBreaker = { streakBroken: 0, question: null };

            allQuestions.forEach(q => {
                if (q.isCorrect) {
                    currentS++;
                } else {
                    if (currentS > 0) streaks.push(currentS);
                    // Did this break a significant streak?
                    if (currentS >= 3 && currentS >= maxBreaker.streakBroken) {
                        maxBreaker = { streakBroken: currentS, question: q };
                    }
                    currentS = 0;
                }
            });
            if (currentS > 0) streaks.push(currentS);

            const avgStreak = streaks.length > 0
                ? (streaks.reduce((a, b) => a + b, 0) / streaks.length).toFixed(1)
                : "0.0";

            // Extend engine data
            const baseStreakData = engine?.getStreakAnalysis() || { maxStreak: 0, currentStreak: 0 };
            var streakData = {
                ...baseStreakData,
                avgStreak,
                breaker: maxBreaker.question ? {
                    id: maxBreaker.question.id || '?',
                    area: maxBreaker.question.areaName,
                    streakBroken: maxBreaker.streakBroken
                } : null
            };

        } catch (e) {
            console.warn("Analytics Engine failed to init", e);
            var streakData = { maxStreak: 0, currentStreak: 0, avgStreak: 0, breaker: null };
        }

        const perfData = engine?.getPerformanceStats() || { consistencyScore: 0, totalQuestions: 0 };


        // Calculate consistency based on variance/stdDev
        const mean = avgScore;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);
        let consistency = 'low';
        if (stdDev < 5) consistency = 'high';
        else if (stdDev < 15) consistency = 'medium';

        // Prepare Radar Data
        const radarData = areas.map(([key, data]) => ({
            subject: AREA_CONFIG[key]?.icon ? key.charAt(0).toUpperCase() + key.slice(1) : key,
            score: data?.score || 0,
            fullSubject: key
        }));

        // Badges Logic
        const badges = [];
        if (avgScore >= 90) badges.push({ id: 'top_performer', icon: Trophy, label: 'Top Performer', color: 'text-amber-400' });
        if (consistency === 'high' && avgScore > 70) badges.push({ id: 'consistent', icon: Target, label: 'Altamente Consistente', color: 'text-emerald-400' });
        if (Math.max(...scores) === 100) badges.push({ id: 'perfect_score', icon: Star, label: 'Puntaje Perfecto', color: 'text-purple-400' });
        if (streakData.currentStreak > 5) badges.push({ id: 'on_fire', icon: Zap, label: 'En Racha', color: 'text-orange-400' });

        return {
            avgScore,
            maxArea,
            minArea,
            globalAvg: 62, // Mock global avg
            percentile: 85, // Mock percentile
            consistency,
            badges,
            radarData,
            streakData,
            perfData
        };
    }, [user, db]); // Dependencies

    // ===== VALIDACIÓN DEFENSIVA (AFTER HOOKS) =====

    // 1. Validar que user existe
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Usuario no encontrado
                    </h2>
                    <p className="text-gray-400 mb-6">
                        No se pudo cargar la información del estudiante.
                    </p>
                    <button
                        onClick={() => setView?.('login')}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    // 2. Validar que user.areas existe
    if (!user.areas || typeof user.areas !== 'object' || Object.keys(user.areas).length === 0) {
        console.error('❌ user.areas no existe o es inválido:', user);
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Datos incompletos
                    </h2>
                    <p className="text-gray-400 mb-6">
                        No se encontraron resultados para este estudiante.
                    </p>
                    <button
                        onClick={() => setView?.('login')}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    // 3. Validar que hay al menos un área con datos válidos
    // Nota: Usamos la validación simple aquí, la lógica compleja ya corrió en useMemo pero esto es para bloquear la vista
    const validAreasCheck = Object.entries(user.areas).filter(([_, data]) =>
        data &&
        typeof data === 'object' &&
        typeof data.score === 'number' &&
        !isNaN(data.score)
    );

    if (validAreasCheck.length === 0) {
        console.error('❌ No hay áreas válidas:', user.areas);
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Sin resultados
                    </h2>
                    <p className="text-gray-400 mb-6">
                        No hay datos de evaluación disponibles.
                    </p>
                    <button
                        onClick={() => setView?.('login')}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    const displayName = user.name ? user.name.split(' ')[0] : 'Estudiante';

    console.log(`✅ StudentDashboard cargado correctamente para: ${user.name}`);
    console.log(`   Áreas válidas: ${validAreasCheck.length}`);

    // ===== FIN VALIDACIÓN DEFENSIVA =====

    return (
        <motion.div
            className="max-w-[1600px] mx-auto pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header with Personalized Greeting */}
            <motion.header className="mb-10" variants={itemVariants}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-5xl font-black text-white mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                            Hola, {displayName} <span className="animate-wave inline-block">👋</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium flex items-center gap-2">
                            <Brain size={20} className="text-indigo-400" />
                            Dashboard de Rendimiento Académico
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* GROWTH CHART BUTTON (From Reference) */}
                        <button
                            onClick={() => alert("Próximamente: Gráfico de Progreso Histórico con múltiples simulacros.")}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold border border-slate-700 transition-all hover:scale-105"
                        >
                            <TrendingUp size={18} className="text-emerald-400" />
                            Ver Mi Progreso
                        </button>

                        {/* Achievement Badges */}
                        {analytics.badges.length > 0 && (
                            <div className="flex gap-2">
                                {analytics.badges.map((badge, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                                        className="bg-slate-900/60 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-2 hover:scale-105 transition-transform"
                                    >
                                        <badge.icon size={16} className={badge.color} />
                                        <span className="text-xs font-bold text-slate-300">{badge.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
                {/* Main Score Card - Enhanced */}
                <motion.div variants={itemVariants} className="xl:col-span-2 bg-gradient-to-br from-indigo-900 to-purple-900 p-[2px] rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)] relative overflow-hidden group cursor-pointer transform hover:scale-[1.01] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-20 group-hover:opacity-40 transition-opacity animate-gradient"></div>
                    <div className="bg-slate-900/90 backdrop-blur-xl h-full w-full rounded-3xl p-8 relative z-10">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full -mr-32 -mt-32 group-hover:scale-150 blur-3xl transition-transform duration-1000"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                                        <Award className="w-7 h-7 text-indigo-300" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold uppercase tracking-wider text-indigo-200 block">Puntaje Global</span>
                                        <span className="text-xs text-slate-500 font-semibold">{db?.metadata?.test_name || 'Simulacro'}</span>
                                    </div>
                                </div>

                                {/* Percentile Badge */}
                                {analytics.percentile > 0 && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
                                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Top {100 - analytics.percentile}%</div>
                                        <div className="text-[10px] text-slate-400 font-semibold">Percentil {analytics.percentile}</div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-end gap-6 mb-8">
                                <div>
                                    <span className="text-8xl font-black tracking-tighter text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.3)]">{user.global_score}</span>
                                    <span className="text-4xl font-bold text-slate-500 ml-2">/ 500</span>
                                </div>

                                {/* Comparison with Global Average */}
                                {analytics.globalAvg > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            {user.global_score > analytics.globalAvg ? (
                                                <TrendingUp size={20} className="text-emerald-400" />
                                            ) : user.global_score < analytics.globalAvg ? (
                                                <TrendingDown size={20} className="text-red-400" />
                                            ) : (
                                                <Minus size={20} className="text-slate-400" />
                                            )}
                                            <span className={`text-sm font-bold ${user.global_score > analytics.globalAvg ? 'text-emerald-400' : user.global_score < analytics.globalAvg ? 'text-red-400' : 'text-slate-400'}`}>
                                                {Math.abs(user.global_score - analytics.globalAvg)} pts
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 font-semibold">vs. Promedio Grupal ({analytics.globalAvg})</div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Promedio</div>
                                        <div className="text-2xl font-black text-white">{analytics.avgScore}</div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-slate-700"></div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Consistencia</div>
                                        <div className={`text-sm font-bold ${analytics.consistency === 'high' ? 'text-emerald-400' : analytics.consistency === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>
                                            {analytics.consistency === 'high' ? 'Alta' : analytics.consistency === 'medium' ? 'Media' : 'Baja'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button onClick={() => setView('report')} className="bg-white/10 hover:bg-white/20 hover:text-white border border-white/10 backdrop-blur-sm px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all group-hover:border-indigo-500/50 group-hover:bg-indigo-500/20 text-indigo-100 hover:scale-105 active:scale-95">
                                        Análisis Completo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button onClick={() => setView('planner')} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white border border-indigo-400/30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-105 active:scale-95">
                                        <Calendar size={18} /> Ruta Interactiva
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Radar Chart - Performance Overview */}
                <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-800">
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                        <Target size={20} className="text-indigo-400" />
                        Perfil de Competencias
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <RadarChart data={analytics.radarData}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                            <Radar name="Tu Rendimiento" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} strokeWidth={2} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: 'white', fontWeight: 'bold' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-start gap-2">
                            <AlertCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                {analytics.variance < 15
                                    ? "Excelente balance entre áreas. Mantén este ritmo de estudio equilibrado."
                                    : analytics.variance < 30
                                        ? "Buen desempeño general. Enfoca esfuerzos en áreas con menor puntaje."
                                        : "Variación significativa detectada. Prioriza refuerzo en áreas críticas."}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ADVANCED ANALYTICS GRID (New Engine Viz) */}
            {/* ADVANCED ANALYTICS GRID (New Engine Viz) */}
            <AnalyticsGrid
                analytics={analytics}
                onStreakClick={() => setShowStreakModal(true)}
                onViewBreaker={(breaker) => setSelectedArea(breaker.area)}
            />

            {/* GLOBAL PERFORMANCE INSIGHT - ICFES Framework */}
            <motion.div variants={itemVariants} className="mb-10">
                <GlobalPerformanceInsight globalScore={user.global_score || 0} />
            </motion.div>

            {/* PERFORMANCE LEVELS BY AREA - ICFES Framework */}
            <motion.div variants={itemVariants} className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                    <h3 className="text-2xl font-black text-white">
                        Niveles de Desempeño por Área
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-black text-indigo-300 uppercase tracking-wider">
                        Marco ICFES
                    </span>
                </div>
                <p className="text-slate-400 font-medium mb-8 max-w-4xl">
                    Análisis detallado basado en el <span className="text-indigo-400 font-bold">Diseño Centrado en Evidencias (DCE)</span> del ICFES.
                    Cada nivel describe las competencias que dominas y las acciones prioritarias para avanzar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(user.areas).map(([areaName, data]) => {
                        const levelData = getPerformanceLevel(areaName, data.score || 0);
                        return levelData ? (
                            <PerformanceLevelCard
                                key={areaName}
                                levelData={levelData}
                                areaName={areaName}
                                currentScore={data.score || 0}
                                onViewDetails={() => setSelectedArea(areaName)}
                            />
                        ) : null;
                    })}
                </div>
            </motion.div>

            {/* RESULTS INTERPRETATION GUIDE */}
            <motion.div variants={itemVariants} className="mb-10">
                <ResultsInterpretationGuide studentData={user} />
            </motion.div>

            {/* STUDY PLANS - DETAILED SYLLABI */}
            <motion.div variants={itemVariants} className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    <h3 className="text-2xl font-black text-white">
                        Planes de Estudio Detallados
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-black text-purple-300 uppercase tracking-wider">
                        Temarios ICFES 2026
                    </span>
                </div>
                <p className="text-slate-400 font-medium mb-8 max-w-4xl">
                    Temarios completos por nivel basados en la <span className="text-purple-400 font-bold">Guía de Orientación Saber 11° 2026</span>.
                    Cada plan incluye competencias específicas, contenidos detallados y recomendaciones de estudio.
                </p>

                <div className="grid grid-cols-1 gap-8">
                    {Object.entries(user.areas).map(([areaName, data]) => {
                        const levelData = getPerformanceLevel(areaName, data.score || 0);
                        return levelData ? (
                            <StudyPlanPanel
                                key={areaName}
                                areaName={areaName}
                                currentLevel={levelData.level}
                                currentScore={data.score || 0}
                            />
                        ) : null;
                    })}
                </div>
            </motion.div>

            {/* Quick Insights Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <Trophy className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fortaleza</span>
                    </div>
                    <p className="text-2xl font-black text-slate-100 capitalize mb-1">{analytics.maxArea.name || 'N/A'}</p>
                    <p className="text-sm text-emerald-400 font-semibold mb-3">{analytics.maxArea.score} puntos • {analytics.maxArea.data?.level_title || 'Nivel Base'}</p>
                    <div className="pt-3 border-t border-emerald-500/20">
                        <p className="text-xs text-slate-400 font-medium">Sigue profundizando en esta área para alcanzar la maestría absoluta.</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-red-500/20 hover:border-red-500/40 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                            <Target className="w-6 h-6 text-red-400" />
                        </div>
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Oportunidad</span>
                    </div>
                    <p className="text-2xl font-black text-slate-100 capitalize mb-1">{analytics.minArea.name || 'N/A'}</p>
                    <p className="text-sm text-red-400 font-semibold mb-3">{analytics.minArea.score} puntos • {analytics.minArea.data?.level_title || 'Nivel Base'}</p>
                    <div className="pt-3 border-t border-red-500/20">
                        <p className="text-xs text-slate-400 font-medium">Prioriza esta área en tu plan de estudio para equilibrar tu perfil.</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-amber-500/20 hover:border-amber-500/40 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <Zap className="w-6 h-6 text-amber-400" />
                        </div>
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Promedio</span>
                    </div>
                    <p className="text-2xl font-black text-slate-100 mb-1">{analytics.avgScore} pts</p>
                    <p className="text-sm text-amber-400 font-semibold mb-3">Por área evaluada</p>
                    <div className="pt-3 border-t border-amber-500/20">
                        <p className="text-xs text-slate-400 font-medium">
                            {analytics.avgScore >= 70 ? "Rendimiento sobresaliente en todas las áreas." : analytics.avgScore >= 50 ? "Buen nivel general. Continúa mejorando." : "Refuerza conceptos fundamentales en todas las áreas."}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Areas Grid - Enhanced with Click Interaction */}
            <motion.div variants={itemVariants}>
                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    Rendimiento Detallado por Área
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(user.areas).map(([areaName, data]) => {
                        const config = AREA_CONFIG[areaName] || AREA_CONFIG["matematicas"];
                        const Icon = config.icon;
                        const questionCount = data.question_details?.length || 0;
                        const correctCount = data.question_details?.filter(q => q.status === 'correct' || q.isCorrect).length || 0; // Fix status check
                        const accuracy = questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;

                        return (
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                key={areaName}
                                onClick={() => setSelectedArea(areaName)}
                                className="bg-slate-900/60 backdrop-blur-sm p-1 rounded-3xl hover:bg-slate-800/80 transition-all group cursor-pointer"
                            >
                                <div className="h-full bg-slate-900/80 rounded-[22px] border border-slate-800 p-6 relative overflow-hidden group-hover:border-slate-700 transition-colors">
                                    <div className={`absolute top-0 right-0 p-24 ${config.bg} opacity-20 blur-3xl rounded-full -mr-12 -mt-12 group-hover:opacity-40 transition-opacity duration-500`}></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`p-3 rounded-2xl ${config.bg} ${config.border} border shadow-lg group-hover:scale-110 transition-transform`}>
                                                <Icon size={28} className={config.color} />
                                            </div>
                                            <span className={`text-4xl font-black ${config.color} drop-shadow-sm`}>{data.score}</span>
                                        </div>

                                        <h4 className="text-lg font-bold text-slate-200 capitalize mb-1">{areaName}</h4>
                                        <p className={`text-sm font-bold ${config.color} mb-4`}>{data.level_title}</p>

                                        {/* Progress Bar */}
                                        {questionCount > 0 && (
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs font-bold mb-2">
                                                    <span className="text-slate-400">Precisión</span>
                                                    <span className={config.color}>{accuracy}%</span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-1000 shadow-lg`}
                                                        style={{ width: `${accuracy}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-slate-500 font-semibold mt-1">{correctCount} / {questionCount} preguntas correctas</div>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-slate-500 group-hover:text-slate-300 transition-colors">
                                            <p className="text-xs font-bold uppercase tracking-wide">Ver análisis</p>
                                            <ArrowRight size={16} className="-ml-4 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Area Detail Modal */}
            <AnimatePresence>
                {selectedArea && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedArea(null)}
                    >
                        <motion.div
                            className="bg-[#0B1121] w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {(() => {
                                const data = user.areas[selectedArea];
                                const config = AREA_CONFIG[selectedArea] || AREA_CONFIG["matematicas"];
                                const Icon = config.icon;

                                return (
                                    <>
                                        <div className={`p-6 border-b border-slate-800 bg-gradient-to-r ${config.gradient} bg-opacity-10`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl ${config.bg} ${config.border} border`}>
                                                        <Icon size={28} className={config.color} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black text-white capitalize">{selectedArea}</h3>
                                                        <p className={`text-sm font-bold ${config.color}`}>{data.level_title}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-4xl font-black ${config.color}`}>{data.score}</div>
                                                    <div className="text-xs font-bold text-slate-500 uppercase">Puntaje</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
                                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                        <CheckCircle2 size={16} /> Fortalezas Demostradas
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {Array.isArray(data.evidence) ? data.evidence.map((e, i) => (
                                                            <li key={i} className="flex items-start text-slate-300 font-medium text-sm">
                                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                                {e}
                                                            </li>
                                                        )) : (
                                                            <p className="text-slate-500 text-sm">No hay datos de fortalezas disponibles.</p>
                                                        )}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                        <Target size={16} /> Plan de Mejora Personalizado
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {(() => {
                                                            // Logic to determine plan: Use static data OR derive from performance level
                                                            let planItems = [];
                                                            if (Array.isArray(data.recommended_plan) && data.recommended_plan.length > 0) {
                                                                planItems = data.recommended_plan;
                                                            } else {
                                                                // Dynamic Generation
                                                                try {
                                                                    const levelInfo = getPerformanceLevel(selectedArea, data.score);
                                                                    // Access global PERFORMANCE_LEVELS if imported, or import it. 
                                                                    // Since PERFORMANCE_LEVELS is not imported in this file, we might need to rely on what getPerformanceLevel returns 
                                                                    // or import PERFORMANCE_LEVELS at the top.
                                                                    // Check if levelInfo contains recommendations (it usually does if getPerformanceLevel returns the full object)
                                                                    if (levelInfo && levelInfo.recommendations) {
                                                                        planItems = levelInfo.recommendations;
                                                                    }
                                                                } catch (err) {
                                                                    console.warn("Could not generate dynamic plan", err);
                                                                }
                                                            }

                                                            if (planItems.length > 0) {
                                                                return planItems.map((p, i) => (
                                                                    <li key={i} className="flex items-start text-slate-300 font-medium text-sm">
                                                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                                        {p}
                                                                    </li>
                                                                ));
                                                            } else {
                                                                return <p className="text-slate-500 text-sm">No hay plan de mejora disponible para este nivel.</p>;
                                                            }
                                                        })()}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* QUESTION BREAKDOWN GRID */}
                                            {data.question_details && data.question_details.length > 0 && (
                                                <div className="mt-8 pt-6 border-t border-slate-800">
                                                    <h4 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                        <Sparkles size={16} className="text-indigo-400" /> Desglose de Respuestas
                                                    </h4>
                                                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                                        {data.question_details.map((q, idx) => {
                                                            const isCorrect = q.status === 'correct' || q.isCorrect;
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => setSelectedQuestion(q)}
                                                                    className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all hover:scale-110 cursor-pointer group relative ${isCorrect
                                                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                                                        : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                                                        }`}
                                                                >
                                                                    <span className="text-[10px] font-bold opacity-60">P{q.id.replace('P', '')}</span>
                                                                    {isCorrect ? <CheckCircle2 size={16} /> : <Minus size={16} />}

                                                                    {/* Tooltip */}
                                                                    <div className="absolute bottom-full mb-2 bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                                                        <div className="font-bold text-white mb-0.5">Click para ver detalle</div>
                                                                        <div className="font-bold text-white mb-0.5 opacity-50">Pregunta {q.id}</div>
                                                                        <div className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                                                                            {isCorrect ? 'Respuesta Correcta' : 'Respuesta Incorrecta'}
                                                                        </div>
                                                                        {q.value && <div className="text-slate-400 mt-1">Tu respuesta: <span className="text-white font-mono">{q.value}</span></div>}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
                                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Correcta</div>
                                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Incorrecta</div>
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setSelectedArea(null);
                                                    setView('report');
                                                }}
                                                className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg`}
                                            >
                                                Ver Desglose Completo <ArrowRight size={20} />
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STREAK HALL OF FAME MODAL - PROFESSIONAL REDESIGN */}
            <AnimatePresence>
                {showStreakModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setShowStreakModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Main Container */}
                            <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

                                {/* Subtle Background */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]"></div>
                                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px]"></div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setShowStreakModal(false)}
                                    className="absolute top-6 right-6 z-20 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all hover:rotate-90 duration-300"
                                >
                                    <X size={18} />
                                </button>

                                {/* Header */}
                                <div className="relative px-8 pt-8 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl blur-xl"></div>
                                            <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500">
                                                <Trophy size={28} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-black text-white mb-1">
                                                Hall de la Fama
                                            </h2>
                                            <p className="text-sm text-slate-400 font-medium">
                                                Tus récords personales por materia
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative px-8 py-6 max-h-[60vh] overflow-y-auto">
                                    <div className="grid gap-6">
                                        {Object.entries(user.areas).map(([areaName, data], index) => {
                                            // Calculate max streak AND find the "Streak Breaker"
                                            let maxS = 0;
                                            let currS = 0;
                                            let breaker = null;

                                            (data.question_details || []).forEach(q => {
                                                if (q.isCorrect) {
                                                    currS++;
                                                } else {
                                                    // This question ended a streak of length currS
                                                    if (currS >= maxS && currS > 0) {
                                                        maxS = currS;
                                                        breaker = q; // This is the questions that killed the record
                                                    }
                                                    currS = 0;
                                                }
                                            });
                                            // Check if final streak is the record (alive streak, no breaker yet)
                                            if (currS > maxS) {
                                                maxS = currS;
                                                breaker = null; // Record is currently alive!
                                            }

                                            const config = AREA_CONFIG[areaName] || AREA_CONFIG['matematicas'];
                                            const Icon = config.icon;

                                            return (
                                                <motion.div
                                                    key={areaName}
                                                    initial={{ opacity: 0, x: -30 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.08 }}
                                                    className="group relative"
                                                >
                                                    {/* Futuristic Card */}
                                                    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-2 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">

                                                        {/* Holographic Edge Effect */}
                                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>

                                                        <div className="relative flex items-center gap-5">
                                                            {/* Icon Area */}
                                                            <div className="flex-shrink-0">
                                                                <div className={`relative p-3 rounded-xl ${config.bg} border-2 ${config.border} shadow-lg`}>
                                                                    <Icon size={24} className={config.color} />
                                                                    <div className={`absolute inset-0 ${config.bg} rounded-xl blur-md opacity-50`}></div>
                                                                </div>
                                                            </div>

                                                            {/* Subject Name */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-lg font-black text-white capitalize mb-1 truncate drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                                                    {areaName}
                                                                </h3>
                                                                {breaker ? (
                                                                    <button
                                                                        onClick={() => {
                                                                            setShowStreakModal(false);
                                                                            setSelectedArea(areaName);
                                                                        }}
                                                                        className="text-xs font-medium text-red-400 hover:text-red-300 underline decoration-red-500/50 hover:decoration-red-400 transition-colors"
                                                                    >
                                                                        Ver Error #{breaker.id}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            setShowStreakModal(false);
                                                                            setSelectedArea(areaName);
                                                                        }}
                                                                        className="text-xs font-medium text-cyan-400/70 hover:text-cyan-300 underline decoration-cyan-500/30 hover:decoration-cyan-400/50 transition-colors"
                                                                    >
                                                                        Ver Detalle
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* YELLOW AREA - Streak Number */}
                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                className="relative flex-shrink-0"
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-xl opacity-60"></div>
                                                                <div className="relative px-6 py-3 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 border-2 border-yellow-300/50 shadow-[0_0_25px_rgba(251,191,36,0.6)]">
                                                                    <div className="text-center">
                                                                        <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                                                            {maxS}
                                                                        </div>
                                                                        <div className="text-[9px] font-bold text-yellow-100 uppercase tracking-wider">
                                                                            Seguidas
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>

                                                            {/* BLUE AREA - SeamosGenios */}
                                                            <div className="relative flex-shrink-0">
                                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur-lg opacity-50"></div>
                                                                <div className="relative px-4 py-2 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 border-2 border-cyan-300/50 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                                                    <div className="text-xs font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                                                        SeamosGenios
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* RED AREA - Ver Errores Button */}
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => {
                                                                    setShowStreakModal(false);
                                                                    setSelectedArea(areaName);
                                                                }}
                                                                className="relative flex-shrink-0 group/btn"
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl blur-lg opacity-60 group-hover/btn:opacity-80 transition-opacity"></div>
                                                                <div className="relative px-5 py-3 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-rose-600 border-2 border-red-400/50 shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover/btn:shadow-[0_0_30px_rgba(239,68,68,0.7)] transition-all">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-black text-white uppercase tracking-wide drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                                                            Ver Errores
                                                                        </span>
                                                                        <ArrowRight size={16} className="text-white group-hover/btn:translate-x-1 transition-transform" />
                                                                    </div>
                                                                </div>
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="text-center relative z-10">
                                    <p className="text-sm text-indigo-300 font-bold mb-4 animate-pulse">
                                        ¿Crees que puedes romper estos récords? 🚀
                                    </p>
                                    <a
                                        href={`https://wa.me/573008871908?text=${encodeURIComponent("¡Hola NUCLEUS! 🧠 Acabo de ver mis récords de racha y quiero desafiarme. ¿Cuándo es el próximo simulacro o minisimulacro para superarlos?")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-4 rounded-xl shadow-lg hover:shadow-[#25D366]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="text-lg">Solicitar Nuevo Reto</span>
                                        <ArrowRight size={20} />
                                    </a>
                                    <p className="text-[10px] text-slate-500 mt-3 font-medium">
                                        Te contactaremos vía WhatsApp para agendar tu próxima sesión.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* QUESTION ANALYSIS MODAL - "ANALIZA LA IMAGEN" STYLE */}
            <AnimatePresence>
                {selectedQuestion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedQuestion(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-[#0F172A] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#0B1121]">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                        <BrainCircuit size={24} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-2xl font-black text-white leading-none">
                                                {selectedQuestion.id}
                                            </h3>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                                            {selectedArea || "Área Desconocida"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedQuestion(null)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Top Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Your Answer Card */}
                                    <div className={`relative overflow-hidden rounded-2xl border-2 p-6 flex flex-col items-center justify-center min-h-[180px] ${(selectedQuestion.isCorrect || selectedQuestion.status === 'correct')
                                        ? 'border-emerald-500/30 bg-emerald-500/5'
                                        : 'border-red-500/30 bg-red-500/5'
                                        }`}>
                                        <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 absolute top-6">
                                            Tu Respuesta
                                        </h4>

                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${(selectedQuestion.isCorrect || selectedQuestion.status === 'correct')
                                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/20'
                                            : 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/20'
                                            }`}>
                                            {(selectedQuestion.isCorrect || selectedQuestion.status === 'correct')
                                                ? <Check size={40} className="text-white" strokeWidth={3} />
                                                : <X size={40} className="text-white" strokeWidth={3} />
                                            }
                                        </div>

                                        <span className={`text-lg font-black ${(selectedQuestion.isCorrect || selectedQuestion.status === 'correct')
                                            ? 'text-emerald-400'
                                            : 'text-red-400'
                                            }`}>
                                            {(selectedQuestion.isCorrect || selectedQuestion.status === 'correct') ? 'Correcta' : 'Incorrecta'}
                                        </span>
                                    </div>

                                    {/* Global Difficulty Card */}
                                    <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-6 flex flex-col items-center justify-center min-h-[180px]">
                                        <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">
                                            Dificultad Global
                                        </h4>

                                        {/* Minimalist Donut Chart */}
                                        <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                                            {/* Background Ring */}
                                            <div className="absolute inset-0 rounded-full border-[6px] border-slate-700"></div>
                                            {/* Progress Ring (Simulated) */}
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle
                                                    cx="48" cy="48" r="42"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="6"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${263 * 0.604} 263`}
                                                    className="text-amber-500"
                                                />
                                            </svg>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xl font-black text-white">60.4%</span>
                                            </div>
                                        </div>

                                        <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5">
                                            <Zap size={12} className="text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-bold text-amber-400">Moderada</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Distribution Section */}
                                <div className="rounded-2xl border border-slate-700 bg-slate-800/20 p-6">
                                    <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Users size={16} className="text-indigo-400" /> Distribución de Respuestas del Grupo
                                    </h4>

                                    <div className="space-y-4">
                                        {[
                                            { opt: 'A', type: 'correct', count: 29, pct: 60, isAnswer: true },
                                            { opt: 'B', type: 'distractor', count: 6, pct: 13, isAnswer: false },
                                            { opt: 'C', type: 'distractor', count: 3, pct: 6, isAnswer: false },
                                            { opt: 'D', type: 'distractor', count: 10, pct: 21, isAnswer: false }
                                        ].map((item, i) => (
                                            <div key={i} className="group">
                                                <div className="flex items-center justify-between mb-2 text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg ${item.isAnswer
                                                            ? 'bg-emerald-500'
                                                            : 'bg-slate-700 text-slate-400'
                                                            }`}>
                                                            {item.opt}
                                                        </div>
                                                        <span className={`font-bold ${item.isAnswer ? 'text-emerald-400' : 'text-slate-400'}`}>
                                                            {item.isAnswer ? 'Correcta' : 'Distractor'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-slate-400 font-medium text-xs">{item.count} estudiantes</span>
                                                        <span className={`font-black w-8 text-right ${item.isAnswer ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                            {item.pct}%
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.pct}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                        className={`h-full rounded-full ${item.isAnswer ? 'bg-emerald-500' : 'bg-slate-600'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
