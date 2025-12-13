import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Flame, Zap, Target, TrendingUp, AlertTriangle, Medal, Crown } from 'lucide-react';

const AREA_CONFIG = {
    'matematicas': {
        gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
        color: 'text-rose-400',
        glowColor: 'shadow-rose-500/50',
        icon: '🔢'
    },
    'lectura critica': {
        gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
        color: 'text-cyan-400',
        glowColor: 'shadow-cyan-500/50',
        icon: '📖'
    },
    'sociales y ciudadanas': {
        gradient: 'from-amber-500 via-orange-500 to-yellow-600',
        color: 'text-amber-400',
        glowColor: 'shadow-amber-500/50',
        icon: '👥'
    },
    'ciencias naturales': {
        gradient: 'from-emerald-500 via-green-500 to-teal-600',
        color: 'text-emerald-400',
        glowColor: 'shadow-emerald-500/50',
        icon: '🧪'
    },
    'ingles': {
        gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
        color: 'text-purple-400',
        glowColor: 'shadow-purple-500/50',
        icon: '🌐'
    }
};

export default function HallOfFamePanel({ user, allStudents = [], onBack, onViewKiller }) {
    const [activeTab, setActiveTab] = useState('leaderboard');

    // Calcular rachas por materia (Personal)
    const streakData = useMemo(() => {
        if (!user?.areas) return [];
        return Object.entries(user.areas).map(([areaKey, areaData]) => {
            const questions = areaData.question_details || [];
            let maxStreak = 0;
            let currentStreak = 0;
            let killerQuestion = null;
            let killerIndex = -1;

            questions.forEach((q, idx) => {
                const isCorrect = q.isCorrect || q.status === 'correct';
                if (isCorrect) {
                    currentStreak++;
                    maxStreak = Math.max(maxStreak, currentStreak);
                } else {
                    if (currentStreak > 0) {
                        killerQuestion = q;
                        killerIndex = idx;
                    }
                    currentStreak = 0;
                }
            });

            return {
                areaKey,
                maxStreak,
                killerQuestion,
                killerIndex,
                totalQuestions: questions.length
            };
        });
    }, [user]);

    // Calcular Leaderboard (Global)
    const leaderboardData = useMemo(() => {
        if (!allStudents || allStudents.length === 0) return [];
        return allStudents
            .map(s => ({
                id: s.id,
                name: s.name,
                score: s.global_score || 0, // Use pre-calculated global score (0-500)
                isCurrentUser: s.id === user.id || s.name === user.name
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 50); // Top 50
    }, [allStudents, user]);

    const globalMaxStreak = Math.max(...streakData.map(s => s.maxStreak), 0);

    return (
        <div className="min-h-screen bg-[#050914] relative overflow-hidden flex flex-col">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col p-4 pb-24 max-w-2xl mx-auto w-full">
                {/* Header */}
                <header className="mb-6 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50 flex items-center justify-center hover:bg-slate-700/50 transition-all text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-bold text-amber-500">Hall of Fame</span>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-800/50 rounded-xl mb-6 backdrop-blur-md border border-slate-700/50">
                    {[
                        { id: 'leaderboard', label: 'Ranking Global', icon: Crown },
                        { id: 'streaks', label: 'Mis Rachas', icon: Flame }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all relative ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-slate-700 rounded-lg shadow-sm"
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'leaderboard' ? (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {/* Current User Rank Card (if visible) */}
                            {leaderboardData.map((student, index) => {
                                const rank = index + 1;
                                const isTop3 = rank <= 3;
                                const medalColor = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-slate-300' : 'text-amber-600';

                                return (
                                    <motion.div
                                        key={student.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`relative overflow-hidden rounded-2xl p-4 flex items-center gap-4 border transition-all ${student.isCurrentUser
                                            ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                                            : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60'
                                            }`}
                                    >
                                        {/* Rank Badge */}
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg ${isTop3 ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 ' + medalColor : 'text-slate-500 bg-slate-800'
                                            }`}>
                                            {isTop3 ? <Medal className="w-6 h-6" /> : rank}
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-bold truncate ${student.isCurrentUser ? 'text-indigo-300' : 'text-slate-200'}`}>
                                                {student.name} {student.isCurrentUser && '(Tú)'}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium tracking-wider uppercase">
                                                Estudiante
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-white tracking-tight">
                                                {student.score}
                                            </div>
                                            <div className="text-[10px] items-center justify-end flex gap-1 text-slate-400 font-bold uppercase tracking-wider">
                                                Puntos
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="streaks"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            {/* Global Record */}
                            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-amber-900/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Tu Récord Global</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{globalMaxStreak}</span>
                                            <span className="text-lg text-slate-400">seguidas</span>
                                        </div>
                                    </div>
                                    <Flame className="w-16 h-16 text-orange-500 animate-pulse drop-shadow-lg" />
                                </div>
                            </div>

                            {/* Streaks List */}
                            {streakData.map((data, index) => {
                                const config = AREA_CONFIG[data.areaKey] || AREA_CONFIG['matematicas'];
                                const isTopStreak = data.maxStreak === globalMaxStreak && globalMaxStreak > 0;

                                return (
                                    <div key={data.areaKey} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 hover:bg-slate-800/60 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-xl shadow-lg`}>
                                                {config.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white capitalize text-sm">{data.areaKey}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Zap className={`w-3 h-3 ${config.color}`} />
                                                    <span className={`text-xl font-black ${config.color}`}>{data.maxStreak}</span>
                                                    <span className="text-xs text-slate-500">aciertos</span>
                                                </div>
                                            </div>
                                            {data.killerQuestion && (
                                                <button
                                                    onClick={() => onViewKiller?.(data.areaKey, data.killerQuestion)}
                                                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                                                >
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Ver Error
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
