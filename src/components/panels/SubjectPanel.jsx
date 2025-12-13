import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ChevronLeft, ChevronRight, Target, BookOpen, TrendingUp,
    AlertCircle, CheckCircle2, XCircle, BarChart3, Zap, Brain, Hexagon,
    Layers, Search
} from 'lucide-react';
import { getPerformanceLevel } from '../../services/performanceLevels';
import { DiagnosisTab } from './DiagnosisTab';

const AREA_CONFIG = {
    'matematicas': {
        gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
        color: 'text-rose-400',
        bgAccent: 'bg-rose-500/10',
        borderAccent: 'border-rose-500/30',
        shadow: 'shadow-rose-500/20'
    },
    'lectura critica': {
        gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
        color: 'text-cyan-400',
        bgAccent: 'bg-cyan-500/10',
        borderAccent: 'border-cyan-500/30',
        shadow: 'shadow-cyan-500/20'
    },
    'sociales y ciudadanas': {
        gradient: 'from-amber-500 via-orange-500 to-yellow-600',
        color: 'text-amber-400',
        bgAccent: 'bg-amber-500/10',
        borderAccent: 'border-amber-500/30',
        shadow: 'shadow-amber-500/20'
    },
    'ciencias naturales': {
        gradient: 'from-emerald-500 via-green-500 to-teal-600',
        color: 'text-emerald-400',
        bgAccent: 'bg-emerald-500/10',
        borderAccent: 'border-emerald-500/30',
        shadow: 'shadow-emerald-500/20'
    },
    'ingles': {
        gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
        color: 'text-purple-400',
        bgAccent: 'bg-purple-500/10',
        borderAccent: 'border-purple-500/30',
        shadow: 'shadow-purple-500/20'
    }
};

export default function SubjectPanel({
    areaKey,
    areaData,
    onBack,
    onQuestionClick
}) {
    const [activeTab, setActiveTab] = useState('questions');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const config = AREA_CONFIG[areaKey] || AREA_CONFIG['matematicas'];
    const level = getPerformanceLevel(areaKey, areaData?.score || 0);

    const totalQuestions = areaData?.question_details?.length || 0;
    const correctQuestions = areaData?.question_details?.filter(q => q.isCorrect || q.status === 'correct').length || 0;
    const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#050914] flex flex-col md:flex-row text-slate-200 overflow-hidden relative">
            {/* Background Ambience */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px] bg-gradient-to-b ${config.gradient} pointer-events-none`} />

            {/* Sidebar (Desktop) */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarCollapsed ? 70 : 300 }}
                className="hidden md:flex flex-col bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 relative z-20"
            >
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3 top-8 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors z-30 shadow-lg text-white"
                >
                    {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {!sidebarCollapsed ? (
                    <div className="p-8 flex flex-col h-full">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2 opacity-60">
                                <Layers size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Materia</span>
                            </div>
                            <h2 className="text-2xl font-black text-white capitalize leading-tight">
                                {areaKey}
                            </h2>
                        </div>

                        <div className="relative mb-8 group">
                            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`} />
                            <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-center backdrop-blur-sm">
                                <div className={`text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br ${config.gradient}`}>
                                    {areaData?.score || 0}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Puntaje Global</div>
                            </div>
                        </div>

                        {level && (
                            <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Nivel Actual</span>
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${config.bgAccent} ${config.color}`}>
                                        NVL {level.level}
                                    </span>
                                </div>
                                <div className="font-bold text-white text-sm leading-snug">
                                    {level.title}
                                </div>
                            </div>
                        )}

                        <div className="mt-auto space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-400">Precisión</span>
                                    <span className={config.color}>{accuracy}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${accuracy}%` }}
                                        className={`h-full bg-gradient-to-r ${config.gradient}`}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                                <span className="text-slate-400">Total Preguntas</span>
                                <span className="text-white">{correctQuestions} <span className="text-slate-500">/ {totalQuestions}</span></span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 flex flex-col items-center gap-6 mt-8">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-black text-lg">{areaData?.score || 0}</span>
                        </div>
                        <div className="h-px w-8 bg-slate-700" />
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                <layers size={20} />
                            </div>
                        </div>
                    </div>
                )}
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
                {/* Header Backdrop Blur */}
                <header className="flex-shrink-0 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 p-4 md:p-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center transition-all hover:-translate-x-1"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-white capitalize md:hidden">
                                {areaKey}
                            </h1>
                            <p className="hidden md:block text-sm text-slate-400 font-medium">Analizando rendimiento académico</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                        {[
                            { id: 'questions', label: 'Preguntas', icon: BarChart3 },
                            { id: 'diagnosis', label: 'Diagnóstico', icon: Brain },
                            { id: 'plan', label: 'Plan', icon: TrendingUp }
                        ].map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-300'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabBg"
                                            className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-lg shadow-sm`}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Icon size={16} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </header>

                {/* Content Body */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <AnimatePresence mode="wait">
                        {activeTab === 'questions' && (
                            <QuestionsGrid
                                key="questions"
                                questions={areaData?.question_details || []}
                                config={config}
                                onQuestionClick={onQuestionClick}
                            />
                        )}
                        {activeTab === 'diagnosis' && (
                            <DiagnosisTab
                                key="diagnosis"
                                areaKey={areaKey}
                                areaData={areaData}
                                level={level}
                                config={config}
                            />
                        )}
                        {activeTab === 'plan' && (
                            <PlanTab
                                key="plan"
                                areaKey={areaKey}
                                level={level}
                                config={config}
                            />
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

// Sub-components

function QuestionsGrid({ questions, config, onQuestionClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl mx-auto"
        >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">Matriz de Preguntas</h2>
                <div className="flex gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        <span className="text-slate-300">Correcta</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                        <span className="text-slate-300">Incorrecta</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {questions.map((q, idx) => {
                    const isCorrect = q.isCorrect || q.status === 'correct';
                    return (
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            whileHover={{ scale: 1.1, translateY: -5, zIndex: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onQuestionClick?.(q)}
                            className={`relative aspect-square rounded-2xl flex items-center justify-center font-black text-lg transition-all group ${isCorrect
                                    ? 'bg-slate-800 border-2 border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                    : 'bg-slate-800 border-2 border-red-500/30 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                }`}
                        >
                            {/* Inner Glow */}
                            <div className={`absolute inset-0 rounded-xl opacity-20 ${isCorrect ? 'bg-gradient-to-br from-emerald-500 to-transparent' : 'bg-gradient-to-br from-red-500 to-transparent'
                                }`} />

                            <span className={`relative z-10 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                {idx + 1}
                            </span>

                            {/* Status Indicator Dot */}
                            <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                                }`} />
                        </motion.button>
                    );
                })}
            </div>

            {/* Quick Stats Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <CheckCircle2 className="text-emerald-400" size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">
                            {questions.filter(q => q.isCorrect || q.status === 'correct').length}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase">Aciertos</div>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                        <XCircle className="text-red-400" size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">
                            {questions.filter(q => !(q.isCorrect || q.status === 'correct')).length}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase">Errores</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function PlanTab({ areaKey, level, config }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto space-y-8"
        >
            <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/50 p-8">
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${config.gradient} opacity-20 blur-3xl rounded-full -mr-20 -mt-20`} />
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${config.bgAccent} ${config.borderAccent} border`}>
                            <TrendingUp className={config.color} size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-white">Próximo Objetivo: Nivel {(level?.level || 0) + 1}</h2>
                    </div>
                    <p className="text-slate-300 text-lg max-w-2xl">
                        Basado en tus resultados, hemos generado una ruta de aprendizaje para fortalecer tus áreas débiles y potenciar tus fortalezas.
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {['Conceptos Fundamentales', 'Práctica Guiada', 'Simulacro Avanzado'].map((step, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors group">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-slate-500 group-hover:text-white group-hover:border-indigo-500 transition-all">
                            {i + 1}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{step}</h3>
                            <p className="text-sm text-slate-400">Módulo desbloqueable al completar el nivel anterior.</p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="text-slate-500" />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
