import React, { useState } from 'react';
import { ArrowRight, BrainCircuit, Users, X, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginView({ onLogin, error }) {
    const [docInput, setDocInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate loading for better UX
        setTimeout(() => {
            onLogin(docInput);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B1121] relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -top-40 -left-40 animate-pulse"></div>
                <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -bottom-40 -right-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-900/70 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700/50 relative z-10 group"
            >
                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>

                {/* Logo and Title */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-2xl mb-6 shadow-xl shadow-indigo-500/30 transform group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-gradient"></div>
                        <BrainCircuit size={48} className="text-indigo-400 relative z-10" />
                        <motion.div
                            className="absolute top-0 right-0"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles size={16} className="text-purple-400" />
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl font-black text-white tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400"
                    >
                        Nucleus Analytics
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-400 font-semibold flex items-center justify-center gap-2"
                    >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                        Suite Profesional v4.0
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="group/input"
                    >
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 group-focus-within/input:text-indigo-400 transition-colors">
                            Identificación de Usuario
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={docInput}
                                onChange={(e) => setDocInput(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-700 bg-slate-950/50 text-white focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-semibold placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Documento o 'admin'"
                                required
                            />
                            <div className="absolute left-4 top-4 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors">
                                <Users size={20} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-900/40 hover:shadow-indigo-600/60 transform active:scale-[0.98] flex items-center justify-center gap-2 border border-indigo-500/20 disabled:border-slate-700 disabled:cursor-not-allowed hover:scale-[1.02]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Autenticando...
                            </>
                        ) : (
                            <>
                                Ingresar al Sistema <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>
                </form>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-6 flex items-center gap-3 text-red-300 bg-red-500/10 p-4 rounded-xl border border-red-500/30 backdrop-blur-sm"
                        >
                            <X size={18} className="flex-shrink-0" />
                            <span className="font-semibold">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Access Hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
                >
                    <div className="text-xs text-slate-400 font-medium text-center">
                        <span className="block mb-2 font-bold text-slate-300">Acceso Rápido</span>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <code className="px-2 py-1 bg-slate-900 rounded text-indigo-400 font-mono">admin</code>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-500">Panel Administrativo</span>
                        </div>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-xs text-slate-600 mt-8 font-medium"
                >
                    &copy; 2025 Nucleus Education. Powered by AI.
                </motion.p>
            </motion.div>
        </div>
    );
}
