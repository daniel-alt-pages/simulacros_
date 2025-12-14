import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, UserCog, LogOut, BrainCircuit, ChevronLeft, ChevronRight, Grid3x3, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ user, view, setView, handleLogout, isCollapsed, setIsCollapsed }) {
    // Local state removed in favor of lifting state up

    // Safe extraction of name
    const displayName = user?.name ? user.name.split(' ')[0] : 'Usuario';
    const displayRole = user?.role || 'Invitado';
    const initials = displayName.substring(0, 2).toUpperCase();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 320 }}
            className="bg-slate-900/95 backdrop-blur-xl text-slate-300 flex-shrink-0 h-screen sticky top-0 md:fixed z-20 flex flex-col justify-between border-r border-slate-800 shadow-[5px_0_30px_rgba(0,0,0,0.3)] hidden md:flex"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors z-50 border border-slate-600"
            >
                {isCollapsed ?
                    <ChevronRight className="w-4 h-4 text-white" /> :
                    <ChevronLeft className="w-4 h-4 text-white" />
                }
            </button>

            <div>
                {/* Header */}
                <div className={`p-8 border-b border-slate-800 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent"></div>
                    <div className="relative z-10 w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center shadow-lg group flex-shrink-0">
                        <BrainCircuit size={24} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    </div>
                    {!isCollapsed && (
                        <div className="relative z-10">
                            <span className="font-black text-2xl tracking-tight text-white">Nucleus</span>
                            <p className="text-xs text-indigo-400 font-bold tracking-wider uppercase">Analytics Suite</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className={`p-6 space-y-3 ${isCollapsed ? 'px-3' : ''}`}>
                    {user?.role === 'student' ? (
                        <>
                            <button
                                onClick={() => setView('dashboard')}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-5 py-4 rounded-xl font-bold transition-all duration-300 border ${view === 'dashboard'
                                    ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_20px_rgba(79,70,229,0.15)]'
                                    : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                                    }`}
                                title={isCollapsed ? "Mis Resultados" : ""}
                            >
                                <Grid3x3 size={22} className={view === 'dashboard' ? "animate-pulse" : ""} />
                                {!isCollapsed && <span>Mis Resultados</span>}
                            </button>
                            <button
                                onClick={() => setView('report')}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-5 py-4 rounded-xl font-bold transition-all duration-300 border ${view === 'report'
                                    ? 'bg-cyan-600/10 border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(8,145,178,0.15)]'
                                    : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                                    }`}
                                title={isCollapsed ? "Análisis Detallado" : ""}
                            >
                                <BookOpen size={22} className={view === 'report' ? "animate-pulse" : ""} />
                                {!isCollapsed && <span>Análisis Detallado</span>}
                            </button>
                            <button
                                onClick={() => setView('planner')}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-5 py-4 rounded-xl font-bold transition-all duration-300 border ${view === 'planner'
                                    ? 'bg-emerald-600/10 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                    : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                                    }`}
                                title={isCollapsed ? "Plan de Estudio" : ""}
                            >
                                <Calendar size={22} className={view === 'planner' ? "animate-pulse" : ""} />
                                {!isCollapsed && <span>Plan de Estudio</span>}
                            </button>
                        </>
                    ) : (
                        <button
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/50 hover:shadow-indigo-900/70 transition-all border border-indigo-400/20`}
                            title={isCollapsed ? "Panel Administrativo" : ""}
                        >
                            <UserCog size={22} />
                            {!isCollapsed && <span>Panel Administrativo</span>}
                        </button>
                    )}
                </nav>
            </div>

            {/* User Section */}
            <div className="p-6 bg-slate-950/30 backdrop-blur-sm border-t border-slate-800 relative">
                {!isCollapsed ? (
                    <>
                        <div className="flex items-center gap-4 mb-5 px-2">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-lg border border-white/10 ${user?.role === 'admin'
                                ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white'
                                : 'bg-slate-800 text-indigo-400'
                                }`}>
                                {initials}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate text-slate-200">{displayName}</p>
                                <p className="text-xs text-slate-500 capitalize font-semibold">{displayRole}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                        >
                            <LogOut size={18} /> Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-lg border border-white/10 ${user?.role === 'admin'
                            ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white'
                            : 'bg-slate-800 text-indigo-400'
                            }`}>
                            {initials}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-12 h-12 flex items-center justify-center text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}
