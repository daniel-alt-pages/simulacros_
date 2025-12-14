import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar,
    PieChart, Pie, Cell
} from 'recharts';
import {
    BookOpen, Target, Brain, TrendingUp, AlertCircle, CheckCircle2,
    Award, ArrowRight, Zap, Clock, Calendar, Check, ArrowUpCircle, X, BrainCircuit, Users, Calculator, FlaskConical, Languages, TrendingDown, Minus, Trophy, Star, Sparkles, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomePanel from '../panels/HomePanel';
import SubjectPanel from '../panels/SubjectPanel';
import HallOfFamePanel from '../panels/HallOfFamePanel';
import { StudentAnalyticsEngine } from '../../services/analyticsEngine';
import AnalyticsGrid from '../analytics/AnalyticsGrid';
import ResultsInterpretationGuide from '../insights/ResultsInterpretationGuide';
import PerformanceLevelCard from '../insights/PerformanceLevelCard';
import GlobalPerformanceInsight from '../insights/GlobalPerformanceInsight';
import StudyPlanPanel from '../insights/StudyPlanPanel';
import { getPerformanceLevel } from '../../services/performanceLevels';

const AREA_CONFIG = {
    "matematicas": {
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        icon: Calculator,
        gradient: "from-rose-500 via-pink-600 to-fuchsia-600",
        solid: "bg-rose-600"
    },
    "lectura critica": {
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        icon: BookOpen,
        gradient: "from-cyan-500 via-blue-600 to-indigo-600",
        solid: "bg-cyan-600"
    },
    "sociales y ciudadanas": {
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: Users,
        gradient: "from-amber-500 via-orange-600 to-yellow-600",
        solid: "bg-amber-600"
    },
    "ciencias naturales": {
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: FlaskConical,
        gradient: "from-emerald-500 via-green-600 to-teal-600",
        solid: "bg-emerald-600"
    },
    "ingles": {
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        icon: Languages,
        gradient: "from-purple-500 via-violet-600 to-fuchsia-600",
        solid: "bg-purple-600"
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

export default function StudentDashboard({ user, db, setView, onShowQuestionModal }) {
    const [currentPanel, setCurrentPanel] = useState('home');
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedAreaData, setSelectedAreaData] = useState(null);
    const [showStreakModal, setShowStreakModal] = useState(false);

    // Advanced Analytics using Engine
    const analytics = useMemo(() => {
        if (!user || !user.areas) return null;

        try {
            const allQuestions = Object.entries(user.areas).flatMap(([areaName, area]) =>
                (area.question_details || []).map(q => ({ ...q, areaName }))
            );

            const scores = Object.values(user.areas).map(a => a.score).filter(s => typeof s === 'number');
            const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

            // Calculate Radar Data
            const radarData = Object.entries(user.areas).map(([key, data]) => ({
                subject: key.charAt(0).toUpperCase() + key.slice(1).substring(0, 3), // Short name for radar
                fullSubject: key,
                score: data.score || 0,
            }));

            // Calc max/min areas
            const validAreas = Object.entries(user.areas).filter(([, d]) => typeof d.score === 'number');
            const maxArea = validAreas.reduce((max, curr) => curr[1].score > max[1].score ? curr : max, validAreas[0] || ['', { score: 0 }]);
            const minArea = validAreas.reduce((min, curr) => curr[1].score < min[1].score ? curr : min, validAreas[0] || ['', { score: 0 }]);

            // Engine Instance
            let engineStats = { streakData: { maxStreak: 0, currentStreak: 0 } };
            try {
                const engine = new StudentAnalyticsEngine(allQuestions);
                engineStats.streakData = engine.getStreakAnalysis() || { maxStreak: 0, currentStreak: 0 };
            } catch (e) { }

            return {
                avgScore,
                radarData,
                maxArea: { name: maxArea[0], ...maxArea[1] },
                minArea: { name: minArea[0], ...minArea[1] },
                streakData: engineStats.streakData,
                badges: [] // Simplifying for brevity
            };

        } catch (error) {
            console.error("Error calculating analytics", error);
            return null;
        }
    }, [user]);

    // Navigation Logic
    const handleNavigateToSubject = (areaKey, areaData) => {
        setSelectedArea(areaKey);
        setSelectedAreaData(areaData);
        setCurrentPanel('subject');
    };

    if (!user || !analytics) return <div className="min-h-screen flex items-center justify-center text-white">Cargando perfil...</div>;

    // --- PANEL ROUTING ---
    if (currentPanel === 'subject') {
        return <SubjectPanel
            areaKey={selectedArea}
            areaData={selectedAreaData}
            onBack={() => setCurrentPanel('home')}
            onQuestionClick={(q) => {
                // Shape the data for the modal
                const areaStats = db?.admin_analytics?.[selectedArea] || {};
                const globalStat = areaStats[q.id] || null;

                const statsObject = {
                    ...q,
                    label: q.id,
                    areaName: selectedArea,
                    answer: q.correctAnswer || globalStat?.correct_answer || 'A',
                    global: globalStat || { correct_rate: 0, total_attempts: 0, distractors: {} },
                    userStatus: (q.isCorrect || q.status === 'correct') ? 'correct' : 'incorrect',
                    userSelected: q.value || 'N/A'
                };

                if (onShowQuestionModal) {
                    onShowQuestionModal(statsObject);
                }
            }}
        />;
    }
    if (currentPanel === 'halloffame') {
        return <HallOfFamePanel
            user={user}
            allStudents={db?.students || []}
            onBack={() => setCurrentPanel('home')}
            onViewKiller={(areaKey, question) => {
                const areaStats = db?.admin_analytics?.[areaKey] || {};
                const globalStat = areaStats[question.id] || null;

                const statsObject = {
                    ...question,
                    label: question.id,
                    areaName: areaKey,
                    answer: question.correctAnswer || globalStat?.correct_answer || 'A',
                    global: globalStat || { correct_rate: 0, total_attempts: 0, distractors: {} },
                    userStatus: (question.isCorrect || question.status === 'correct') ? 'correct' : 'incorrect',
                    userSelected: question.value || 'N/A'
                };

                if (onShowQuestionModal) {
                    onShowQuestionModal(statsObject);
                }
            }}
        />;
    }

    // --- MAIN DASHBOARD (BENTO GRID LAYOUT) ---
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[1920px] mx-auto pb-24 md:pb-20 px-4 sm:px-6 md:px-8 space-y-6 md:space-y-8"
        >
            {/* 1. Header Section */}
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 md:gap-6 py-2 md:py-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        <span className="block text-xl sm:text-2xl md:text-3xl text-slate-400 font-bold mb-1">Bienvenido de nuevo,</span>
                        {user.name.split(' ')[0]} <span className="text-indigo-500">.</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3 w-full xl:w-auto">
                    <button
                        onClick={() => setCurrentPanel('halloffame')}
                        className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-xl hover:bg-amber-500/20 hover:scale-105 transition-all active:scale-95"
                    >
                        <Trophy size={18} />
                        <span className="inline">Hall of Fame</span>
                    </button>
                    <div className="hidden sm:flex bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl px-5 py-3 items-center gap-3">
                        <Calendar size={18} className="text-slate-400" />
                        <span className="text-slate-200 font-mono font-bold text-sm">SIMULACRO #1</span>
                    </div>
                </div>
            </header>

            {/* 2. Hero Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

                {/* A. Global Score Card (Large) */}
                <motion.div variants={itemVariants} className="lg:col-span-12 xl:col-span-8 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden group border border-indigo-500/20 shadow-2xl shadow-indigo-900/20">
                    <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/20 rounded-full blur-[80px] md:blur-[120px] -mr-32 -mt-32 group-hover:bg-indigo-500/30 transition-colors duration-700 pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end h-full gap-8">
                        <div className="space-y-4 md:space-y-6 w-full text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] md:text-xs font-black uppercase tracking-wider backdrop-blur-md">
                                <Sparkles size={12} /> Resultados Oficiales
                            </div>
                            <div>
                                <h3 className="text-slate-400 font-bold text-base md:text-lg mb-2">Puntaje Global</h3>
                                <div className="flex items-baseline justify-center md:justify-start gap-2 md:gap-4">
                                    <span className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-black text-white tracking-tighter leading-none">
                                        {user.global_score}
                                    </span>
                                    <span className="text-xl md:text-3xl font-black text-slate-500/50">/500</span>
                                </div>
                            </div>
                            <div className="flex justify-center md:justify-start items-center gap-4 md:gap-6 pt-4 border-t border-indigo-500/20">
                                <div>
                                    <div className="text-[10px] md:text-xs text-slate-400 font-bold uppercase mb-1">Percentil</div>
                                    <div className="text-lg md:text-xl font-black text-emerald-400">Top 12%</div>
                                </div>
                                <div className="w-px h-8 bg-indigo-500/20" />
                                <div>
                                    <div className="text-[10px] md:text-xs text-slate-400 font-bold uppercase mb-1">Promedio</div>
                                    <div className="text-lg md:text-xl font-black text-indigo-300">{analytics.avgScore} pts</div>
                                </div>
                            </div>
                        </div>

                        {/* Radar Chart Mini - Hidden on very small screens if needed, or scaled */}
                        <div className="w-full sm:w-64 h-48 sm:h-56 bg-slate-900/50 rounded-3xl border border-indigo-500/10 p-2 backdrop-blur-sm self-center md:self-stretch flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={analytics.radarData} outerRadius="70%">
                                    <PolarGrid stroke="#ffffff10" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Score" dataKey="score" stroke="#818cf8" strokeWidth={2} fill="#818cf8" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                {/* B. Stats Column (Vertical Stack on PC, Grid on Tablet) */}
                <div className="lg:col-span-12 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 md:gap-6">
                    {/* Top Area */}
                    <motion.div variants={itemVariants} className="bg-slate-900/80 backdrop-blur rounded-[2rem] p-6 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl">
                                    <Trophy className="text-emerald-400" size={20} />
                                </div>
                                <span className="text-emerald-500 font-bold text-[10px] md:text-xs uppercase bg-emerald-500/10 px-2 py-1 rounded-lg">Mejor Área</span>
                            </div>
                            <h4 className="text-xl md:text-2xl font-black text-white capitalize mb-1 truncate">{analytics.maxArea.name}</h4>
                            <p className="text-emerald-400 font-black text-3xl">{analytics.maxArea.score} <span className="text-sm text-slate-500 font-bold">pts</span></p>
                        </div>
                    </motion.div>

                    {/* Opportunity Area */}
                    <motion.div variants={itemVariants} className="bg-slate-900/80 backdrop-blur rounded-[2rem] p-6 border border-slate-800 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-rose-500/10 rounded-xl">
                                    <Target className="text-rose-400" size={20} />
                                </div>
                                <span className="text-rose-500 font-bold text-[10px] md:text-xs uppercase bg-rose-500/10 px-2 py-1 rounded-lg">A Mejorar</span>
                            </div>
                            <h4 className="text-xl md:text-2xl font-black text-white capitalize mb-1 truncate">{analytics.minArea.name}</h4>
                            <p className="text-rose-400 font-black text-3xl">{analytics.minArea.score} <span className="text-sm text-slate-500 font-bold">pts</span></p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 3. Subjects Grid */}
            <motion.div variants={containerVariants}>
                <div className="flex items-center justify-between mb-4 md:mb-6 px-2">
                    <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
                        <LayoutDashboard className="text-indigo-500" size={24} />
                        Materias
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {Object.entries(user.areas).map(([key, data]) => {
                        const config = AREA_CONFIG[key] || AREA_CONFIG["matematicas"];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={key}
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleNavigateToSubject(key, data)}
                                className="bg-slate-900/60 backdrop-blur border border-slate-800 hover:border-slate-700 p-5 md:p-6 rounded-[2rem] cursor-pointer group relative overflow-hidden transition-all shadow-lg"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                <div className="relative z-10 flex flex-col h-full min-h-[160px] md:min-h-[180px] justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-3 rounded-2xl ${config.bg} ${config.border} border`}>
                                            <Icon size={24} className={config.color} />
                                        </div>
                                        <div className={`text-3xl font-black ${config.color}`}>{data.score}</div>
                                    </div>

                                    <div>
                                        <h4 className="text-base md:text-lg font-bold text-white capitalize leading-tight mb-1">{key}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex-1">
                                                <div className={`h-full ${config.solid} w-[${(data.score / 100) * 100}%]`} style={{ width: `${data.score}%` }} />
                                            </div>
                                            <span className="text-xs text-slate-400 font-bold whitespace-nowrap">{data.level_title || 'Nvl 1'}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* 4. Performance Levels (ICFES) - FULL WIDTH */}
            <motion.section variants={itemVariants} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <BrainCircuit className="text-indigo-400" size={24} />
                    <h3 className="text-xl md:text-2xl font-black text-white">Niveles de Desempeño</h3>
                </div>
                {/* Optimized Grid for 5 items: 1 col mobile, 2 col tablet, 3 col desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {Object.entries(user.areas).map(([areaName, data]) => {
                        const levelData = getPerformanceLevel(areaName, data.score || 0);
                        return levelData ? (
                            <PerformanceLevelCard
                                key={areaName}
                                levelData={levelData}
                                areaName={areaName}
                                currentScore={data.score || 0}
                                onViewDetails={() => handleNavigateToSubject(areaName, data)}
                            />
                        ) : null;
                    })}
                </div>
            </motion.section>

            {/* 5. Streak & Consistency - FULL WIDTH */}
            <div className="w-full">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <Zap className="text-amber-400" size={24} />
                    <h3 className="text-xl md:text-2xl font-black text-white">Hábitos de Estudio</h3>
                </div>
                <AnalyticsGrid
                    analytics={analytics}
                    onStreakClick={() => setShowStreakModal(true)}
                />
            </div>

            {/* 5. Detailed Reports */}
            <motion.div variants={itemVariants}>
                <ResultsInterpretationGuide studentData={user} />
            </motion.div>

            {/* 6. STUDY PLANS SECTION */}
            <motion.div variants={itemVariants} className="pt-8 border-t border-slate-800">
                <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                        <BookOpen className="text-purple-400" size={28} />
                        Planes de Estudio
                    </h3>
                    <p className="text-slate-400 mt-2 font-medium text-sm md:text-base">
                        Rutas generadas según tu nivel actual.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(user.areas).map(([areaName, data]) => {
                        const levelData = getPerformanceLevel(areaName, data.score || 0);
                        if (!levelData) return null;

                        return (
                            <StudyPlanPanel
                                key={areaName}
                                areaName={areaName}
                                currentLevel={levelData.level}
                                currentScore={data.score || 0}
                                totalQuestions={data.question_details?.length || 0}
                            />
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}
