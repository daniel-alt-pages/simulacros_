import React from 'react';
import { X, BrainCircuit, Check, Users } from 'lucide-react';

export default function QuestionStatsModal({ stats, onClose }) {
    if (!stats) return null;

    // Helper function to generate insights
    const generateInsight = (globalStats) => {
        const rate = globalStats.correct_rate || 0;
        if (rate < 30) {
            return "Esta pregunta representa un desafío significativo para la mayoría de estudiantes. Dominarla te dará una ventaja competitiva importante.";
        } else if (rate < 70) {
            return "Pregunta de dificultad moderada que requiere comprensión sólida del concepto.";
        } else {
            return "Esta es una pregunta fundamental que la mayoría domina. Asegúrate de no cometer errores en este tipo de preguntas.";
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 w-full max-w-2xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden relative animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                {/* Header */}
                <div className="relative p-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                                    <BrainCircuit size={20} className="text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">{stats.label}</h3>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{stats.areaName}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all hover:rotate-90 duration-300"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="relative p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* 1. Your Result vs Difficulty - Side by Side */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Your Answer */}
                        <div className={`relative p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center overflow-hidden group transition-all duration-300 ${stats.userStatus === 'correct'
                            ? 'bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500/60 hover:bg-emerald-500/15'
                            : 'bg-red-500/10 border-red-500/40 hover:border-red-500/60 hover:bg-red-500/15'
                            }`}>
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${stats.userStatus === 'correct' ? 'bg-emerald-500/5' : 'bg-red-500/5'
                                }`}></div>
                            <span className="relative text-xs font-black uppercase tracking-wider mb-3 text-slate-300">Tu Respuesta</span>
                            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-2 transition-transform group-hover:scale-110 duration-300 ${stats.userStatus === 'correct'
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/40'
                                : 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/40'
                                }`}>
                                {stats.userStatus === 'correct' ? <Check size={32} /> : stats.userSelected}
                            </div>
                            <span className={`relative text-base font-bold ${stats.userStatus === 'correct' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {stats.userStatus === 'correct' ? 'Correcta' : 'Incorrecta'}
                            </span>
                        </div>

                        {/* Difficulty Gauge */}
                        <div className="relative p-6 rounded-2xl border-2 border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/50 flex flex-col items-center justify-center text-center transition-all duration-300 group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative text-xs font-black uppercase tracking-wider mb-3 text-slate-300">Dificultad Global</span>
                            <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="34"
                                        stroke={stats.global.correct_rate < 30 ? '#ef4444' : stats.global.correct_rate < 70 ? '#f59e0b' : '#10b981'}
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={213.628}
                                        strokeDashoffset={213.628 - (213.628 * stats.global.correct_rate) / 100}
                                        className="transition-all duration-1000 drop-shadow-[0_0_8px_currentColor]"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-xl font-black text-white">{stats.global.correct_rate}%</span>
                            </div>
                            <span className={`relative text-sm font-bold px-3 py-1 rounded-full ${stats.global.correct_rate < 30
                                ? 'text-red-400 bg-red-500/20'
                                : stats.global.correct_rate < 70
                                    ? 'text-amber-400 bg-amber-500/20'
                                    : 'text-emerald-400 bg-emerald-500/20'
                                }`}>
                                {stats.global.correct_rate < 30 ? '🔥 Muy Difícil' : stats.global.correct_rate < 70 ? '⚡ Moderada' : '✨ Fácil'}
                            </span>
                        </div>
                    </div>

                    {/* 2. Detailed Answer Distribution - ALL OPTIONS */}
                    <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                        <h4 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
                            <Users size={18} className="text-cyan-400" />
                            Distribución de Respuestas del Grupo
                        </h4>
                        <div className="space-y-4">
                            {['A', 'B', 'C', 'D'].map((option) => {
                                const isCorrect = option === stats.answer;
                                const isUserChoice = option === stats.userSelected;
                                const count = stats.global.distractors?.[option] || 0;
                                const totalAttempts = stats.global.total_attempts || 1;
                                const percentage = Math.round((count / totalAttempts) * 100);

                                return (
                                    <div key={option} className={`group transition-all duration-300 ${isUserChoice ? 'scale-105' : ''}`}>
                                        <div className="flex justify-between items-center text-sm font-bold mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${isCorrect
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                    : isUserChoice
                                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                                        : 'bg-slate-700 text-slate-300'
                                                    }`}>
                                                    {option}
                                                </span>
                                                <span className={`${isCorrect ? 'text-emerald-400' : isUserChoice ? 'text-red-400' : 'text-slate-400'
                                                    }`}>
                                                    {isCorrect && '✓ Correcta'}
                                                    {!isCorrect && isUserChoice && '✗ Tu elección'}
                                                    {!isCorrect && !isUserChoice && 'Distractor'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-300 font-mono">{count} estudiantes</span>
                                                <span className={`font-black text-lg ${isCorrect ? 'text-emerald-400' : isUserChoice ? 'text-red-400' : 'text-slate-400'
                                                    }`}>
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-3 w-full bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/30">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isCorrect
                                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                                                    : isUserChoice
                                                        ? 'bg-gradient-to-r from-red-500 to-red-400 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                                                        : 'bg-gradient-to-r from-slate-600 to-slate-500'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary Stats */}
                        <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between text-xs">
                            <span className="text-slate-400 font-semibold">Total de respuestas: <span className="text-white font-bold">{stats.global.total_attempts}</span></span>
                            <span className="text-slate-400 font-semibold">Tasa de acierto: <span className="text-emerald-400 font-bold">{stats.global.correct_rate}%</span></span>
                        </div>
                    </div>

                    {/* 3. AI Analysis Insight */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5 rounded-2xl border border-indigo-500/30 flex gap-4 hover:border-indigo-500/50 transition-all duration-300 group">
                        <div className="p-3 bg-indigo-500/20 rounded-xl h-fit text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                            <BrainCircuit size={24} />
                        </div>
                        <div className="flex-1">
                            <h5 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                                Análisis de NUCLEUS
                                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">AI</span>
                            </h5>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                {generateInsight(stats.global)}
                                {stats.userStatus === 'incorrect' && " 💡 Revisa la justificación teórica en tus apuntes y practica preguntas similares."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
