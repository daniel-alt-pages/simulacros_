import React from 'react';
import { LayoutDashboard, BookOpen, UserCog, LogOut, BrainCircuit } from 'lucide-react';

export default function Sidebar({ user, view, setView, handleLogout }) {
    // Safe extraction of name
    const displayName = user?.name ? user.name.split(' ')[0] : 'Usuario';
    const displayRole = user?.role || 'Invitado';

    return (
        <aside className="w-full md:w-80 bg-slate-900/95 backdrop-blur-xl text-slate-300 flex-shrink-0 md:h-screen sticky top-0 md:fixed z-30 flex flex-col justify-between border-r border-slate-800 shadow-[5px_0_30px_rgba(0,0,0,0.3)]">
            <div>
                <div className="p-8 border-b border-slate-800 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent"></div>
                    <div className="relative z-10 w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center shadow-lg group">
                        <BrainCircuit size={24} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    </div>
                    <div className="relative z-10">
                        <span className="font-black text-2xl tracking-tight text-white">Nucleus</span>
                        <p className="text-xs text-indigo-400 font-bold tracking-wider uppercase">Analytics Suite</p>
                    </div>
                </div>

                <nav className="p-6 space-y-3">
                    {user?.role === 'student' ? (
                        <>
                            <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all duration-300 border ${view === 'dashboard' ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                                <LayoutDashboard size={22} className={view === 'dashboard' ? "animate-pulse" : ""} /> Mis Resultados
                            </button>
                            <button onClick={() => setView('report')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all duration-300 border ${view === 'report' ? 'bg-cyan-600/10 border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(8,145,178,0.15)]' : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                                <BookOpen size={22} className={view === 'report' ? "animate-pulse" : ""} /> Análisis Detallado
                            </button>
                        </>
                    ) : (
                        <button className="w-full flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/50 hover:shadow-indigo-900/70 transition-all border border-indigo-400/20">
                            <UserCog size={22} /> Panel Administrativo
                        </button>
                    )}
                </nav>
            </div>

            <div className="p-6 bg-slate-950/30 backdrop-blur-sm border-t border-slate-800 relative">
                <div className="flex items-center gap-4 mb-5 px-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-lg border border-white/10 ${user?.role === 'admin' ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                        {displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-slate-200">{displayName}</p>
                        <p className="text-xs text-slate-500 capitalize font-semibold">{displayRole}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}

