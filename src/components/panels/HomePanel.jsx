import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Calculator, Users, FlaskConical, Languages,
    Trophy, ChevronRight, Home, BarChart3, User,
    Zap, Sparkles, BrainCircuit, Flame, ArrowUpRight, Crosshair, X, Divide, Equal
} from 'lucide-react';
import { getPerformanceLevel } from '../../services/performanceLevels';

const AREA_CONFIG = {
    'matematicas': {
        icon: Calculator,
        gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
        textGradient: 'from-rose-400 to-pink-300',
        color: 'text-rose-400',
        glow: 'shadow-rose-500/20',
        border: 'border-rose-500/20'
    },
    'lectura critica': {
        icon: BookOpen,
        gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
        textGradient: 'from-cyan-400 to-blue-300',
        color: 'text-cyan-400',
        glow: 'shadow-cyan-500/20',
        border: 'border-cyan-500/20'
    },
    'sociales y ciudadanas': {
        icon: Users,
        gradient: 'from-amber-500 via-orange-500 to-yellow-600',
        textGradient: 'from-amber-400 to-orange-300',
        color: 'text-amber-400',
        glow: 'shadow-amber-500/20',
        border: 'border-amber-500/20'
    },
    'ciencias naturales': {
        icon: FlaskConical,
        gradient: 'from-emerald-500 via-green-500 to-teal-600',
        textGradient: 'from-emerald-400 to-green-300',
        color: 'text-emerald-400',
        glow: 'shadow-emerald-500/20',
        border: 'border-emerald-500/20'
    },
    'ingles': {
        icon: Languages,
        gradient: 'from-purple-600 via-violet-600 to-fuchsia-700',
        textGradient: 'from-purple-400 to-violet-300',
        color: 'text-purple-400',
        glow: 'shadow-purple-500/40',
        border: 'border-purple-500/30'
    }
};

const DEFAULT_CONFIG = {
    icon: BookOpen,
    gradient: 'from-slate-600 to-slate-700',
    textGradient: 'from-slate-400 to-slate-500',
    glow: 'shadow-slate-500/40',
    border: 'border-slate-500/30',
    color: 'text-slate-400'
};

export default function HomePanel({ user, onNavigateToSubject, onNavigateToHallOfFame }) {
    // Modal state for Score Calculation
    const [showScoreDetails, setShowScoreDetails] = useState(false);

    // Use pre-calculated global score from data service (official weighted score)
    const globalScore = user?.global_score || 0;

    // Identificar área más débil para la "Misión del Día"
    const sortedAreas = user?.areas ? Object.entries(user.areas).sort(([, a], [, b]) => a.score - b.score) : [];
    const weakestArea = sortedAreas.length > 0 ? sortedAreas[0] : null;

    // Configuración segura
    const weakestAreaConfig = weakestArea
        ? (AREA_CONFIG[weakestArea[0]] || DEFAULT_CONFIG)
        : DEFAULT_CONFIG;

    // Asegurar que textGradient exista
    const missionGradient = weakestAreaConfig.textGradient || DEFAULT_CONFIG.textGradient;

    // Helper data for calculation modal
    const areas = user?.areas || {};
    const mat = areas['matematicas']?.score || 0;
    const lec = areas['lectura critica']?.score || 0;
    const soc = areas['sociales y ciudadanas']?.score || 0;
    const cie = areas['ciencias naturales']?.score || 0;
    const ing = areas['ingles']?.score || 0;

    const sumWeighted = (mat * 3) + (lec * 3) + (soc * 3) + (cie * 3) + (ing * 1);
    const average = (sumWeighted / 13).toFixed(2);
    const finalCalc = (average * 5).toFixed(1);

    return (
        <div className="min-h-screen bg-[#050914] text-white pb-32 relative overflow-hidden font-sans selection:bg-indigo-500/30">

            {/* Score Calculation Modal */}
            <AnimatePresence>
                {showScoreDetails && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowScoreDetails(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-slate-800/50 p-6 flex justify-between items-center border-b border-slate-700">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Cálculo Oficial</h3>
                                    <p className="text-xs text-slate-400">Modelo de Ponderación ICFES</p>
                                </div>
                                <button
                                    onClick={() => setShowScoreDetails(false)}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Formula Visual */}
                                <div className="space-y-2">
                                    <div className="grid grid-cols-5 gap-2 text-center text-xs text-slate-400 font-mono mb-1">
                                        <div>MAT</div><div>LEC</div><div>SOC</div><div>NAT</div><div>ING</div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm sm:text-base font-bold bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                        <div className="text-rose-400">{mat}<span className="text-slate-500 text-xs">x3</span></div>
                                        <div className="text-slate-600">+</div>
                                        <div className="text-cyan-400">{lec}<span className="text-slate-500 text-xs">x3</span></div>
                                        <div className="text-slate-600">+</div>
                                        <div className="text-amber-400">{soc}<span className="text-slate-500 text-xs">x3</span></div>
                                        <div className="text-slate-600">+</div>
                                        <div className="text-emerald-400">{cie}<span className="text-slate-500 text-xs">x3</span></div>
                                        <div className="text-slate-600">+</div>
                                        <div className="text-purple-400">{ing}<span className="text-slate-500 text-xs">x1</span></div>
                                    </div>

                                    <div className="flex justify-center my-2">
                                        <div className="h-px w-full bg-slate-600 relative">
                                            <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-slate-900 px-2 text-slate-500 text-xs">
                                                Divide entre 13
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 text-xl font-black">
                                        <span className="text-white">{average}</span>
                                        <span className="text-indigo-400">x 5</span>
                                        <Equal className="text-slate-500" />
                                        <span className="text-indigo-400">{finalCalc}</span>
                                    </div>
                                </div>

                                {/* Result */}
                                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-8 h-8 text-indigo-400" />
                                        <div>
                                            <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Puntaje Global</div>
                                            <div className="text-2xl font-black text-white">{globalScore}</div>
                                        </div>
                                    </div>
                                    <div className="text-right text-[10px] text-indigo-300/60 max-w-[100px] leading-tight">
                                        Redondeado al entero más cercano
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[150px]" />
            </div>

            {/* Header Moderno */}
            <header className="relative z-10 px-6 pt-12 pb-6 flex items-start justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <p className="text-slate-400 text-sm font-medium mb-1">Bienvenido de vuelta,</p>
                    <h1 className="text-2xl font-bold text-white">
                        {user?.name?.split(' ')[0] || 'Estudiante'}
                    </h1>
                </motion.div>

                {/* Score Indicator Compacto & Clickable */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowScoreDetails(true)}
                    className="flex flex-col items-end group cursor-pointer"
                >
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">
                            {globalScore}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">/ 500</span>
                    </div>
                    <span className="text-[10px] text-indigo-400/0 group-hover:text-indigo-400 transition-all transform translate-y-2 group-hover:translate-y-0">
                        Ver desglose
                    </span>
                </motion.button>
            </header>

            {/* SECCIÓN 1: ACCIÓN INTELIGENTE (Misión del Día) */}
            <section className="px-6 mb-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden rounded-3xl p-1 p-[1px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 blur-xl"></div>

                    <div className="relative bg-[#0F1629]/90 backdrop-blur-xl rounded-[23px] p-5 overflow-hidden">
                        {/* Background subtle texture */}
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Crosshair size={120} />
                        </div>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
                                <Zap className="w-6 h-6 text-white" fill="currentColor" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                                        Misión Diaria
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white leading-tight mb-2">
                                    Mejora tu puntaje en <span className={`text-transparent bg-clip-text bg-gradient-to-r ${missionGradient} capitalize`}>{weakestArea ? weakestArea[0] : 'Matemáticas'}</span>
                                </h3>
                                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                                    Hemos detectado 3 temas clave que puedes reforzar hoy para subir de nivel.
                                </p>

                                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 hover:from-indigo-600 hover:to-indigo-700 border border-slate-600 hover:border-indigo-500/50 text-white text-sm font-bold transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 group">
                                    <span>Iniciar Entrenamiento</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* SECCIÓN 2: ACCESOS RÁPIDOS FUNCIONALES */}
            <section className="px-6 mb-8 grid grid-cols-2 gap-3 relative z-10">
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 p-4 rounded-2xl text-left transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-rose-500/20">
                        <Flame className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-200 text-sm">Repasar Errores</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Convierte fallos en aciertos</p>
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 p-4 rounded-2xl text-left transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-cyan-500/20">
                        <BrainCircuit className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-200 text-sm">Simulacro Express</h4>
                    <p className="text-[10px] text-slate-500 mt-1">10 minutos, 15 preguntas</p>
                </motion.button>
            </section>

            {/* SECCIÓN 3: RESULTADOS POR ÁREA (Mejorado) */}
            <main className="relative z-10 px-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Tus Materias
                    </h2>
                </div>

                <div className="space-y-3">
                    {user?.areas && Object.entries(user.areas).map(([areaKey, areaData], index) => {
                        const config = AREA_CONFIG[areaKey];
                        const Icon = config?.icon || BookOpen;
                        const level = getPerformanceLevel(areaKey, areaData.score);

                        return (
                            <motion.button
                                key={areaKey}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                                onClick={() => onNavigateToSubject(areaKey, areaData)}
                                className={`
                                    w-full relative overflow-hidden group
                                    bg-[#0F1629]/60 backdrop-blur-md
                                    border border-slate-800 hover:border-slate-600
                                    rounded-2xl p-4 transition-all duration-300
                                    hover:shadow-lg ${config?.glow.replace('shadow', 'hover:shadow')}
                                `}
                            >
                                {/* Active Indicator Bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config?.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />

                                <div className="flex items-center gap-4">
                                    {/* Icon Box */}
                                    <div className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                                        bg-gradient-to-br ${config?.gradient} shadow-md
                                        group-hover:scale-105 transition-transform duration-300
                                    `}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 text-left">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-200 text-sm capitalize mb-1 group-hover:text-white transition-colors">
                                                {areaKey}
                                            </h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border bg-opacity-10 font-bold ${config?.border} ${config?.color.replace('text', 'bg').replace('400', '500')} bg-opacity-10`}>
                                                Nivel {level?.level}
                                            </span>
                                        </div>

                                        {/* Score Bar */}
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${areaData.score}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className={`h-full bg-gradient-to-r ${config?.gradient}`}
                                                />
                                            </div>
                                            <span className={`text-sm font-black ${config?.color}`}>{areaData.score}</span>
                                        </div>
                                    </div>

                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </main>

            {/* Floating Dock Navigation (Mejorado) */}
            <div className="fixed bottom-6 left-0 right-0 z-50 px-6 flex justify-center">
                <div className="bg-[#0F1629]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/80 flex items-center gap-1">
                    {[
                        { icon: Home, label: 'Home', active: true },
                        { icon: BarChart3, label: 'Stats', active: false },
                        {
                            icon: Trophy,
                            label: 'Ranking',
                            active: false,
                            customClass: "bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25",
                            iconClass: "text-white",
                            onClick: onNavigateToHallOfFame
                        },
                        { icon: User, label: 'Perfil', active: false }
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        const isPrimary = item.customClass;

                        return (
                            <button
                                key={idx}
                                onClick={item.onClick}
                                className={`
                                    relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                                    ${isPrimary
                                        ? item.customClass
                                        : item.active
                                            ? 'bg-slate-700 text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }
                                    active:scale-90
                                `}
                            >
                                <Icon className={`w-5 h-5 ${item.iconClass || ''}`} />
                                {!isPrimary && item.active && (
                                    <span className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full box-content border-2 border-[#0F1629]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
