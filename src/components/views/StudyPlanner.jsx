import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Save, Download, Sparkles, BookOpen, Clock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import TimeSlotSelector from '../planning/TimeSlotSelector';
import { generatePersonalizedPlan, exportPlanToPDF } from '../../services/studyPlanGenerator';
// import { saveStudyPlan, getStudyPlan } from '../../services/firebase'; // Removed for local version

export default function StudyPlanner({ user }) {
    const [availability, setAvailability] = useState({});
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success, error

    // Load existing plan from LocalStorage
    useEffect(() => {
        async function loadExistingPlan() {
            if (user?.id) {
                try {
                    // Local Storage implementation
                    const saved = localStorage.getItem(`nucleus_study_plan_${user.id}`);
                    if (saved) {
                        const parsedPlan = JSON.parse(saved);
                        console.log("Plan recuperado de LocalStorage:", parsedPlan);
                        setGeneratedPlan(parsedPlan);
                        if (parsedPlan.availability) {
                            setAvailability(parsedPlan.availability);
                        }
                        setSaveStatus('success');
                    }
                } catch (error) {
                    console.error("Error cargando plan local:", error);
                }
            }
        }
        loadExistingPlan();
    }, [user]);

    // Extraer puntajes del usuario de forma segura
    const getScores = () => {
        const scores = {};
        if (user && user.areas) {
            Object.entries(user.areas).forEach(([key, data]) => {
                scores[key] = data.score;
            });
        }
        return scores;
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simular proceso de "pensamiento" de IA
        setTimeout(async () => {
            const plan = generatePersonalizedPlan(
                user.name,
                getScores(),
                availability
            );
            setGeneratedPlan(plan);
            setIsGenerating(false);

            // Auto-guardado al generar (LocalStorage)
            setSaveStatus('saving');
            try {
                localStorage.setItem(`nucleus_study_plan_${user.id}`, JSON.stringify(plan));
                setSaveStatus('success');
            } catch (e) {
                console.error("Error saving to localStorage", e);
                setSaveStatus('error');
            }
        }, 1500);
    };

    const handleSaveToCloud = async () => {
        if (!generatedPlan) return;
        setSaveStatus('saving');
        // Simulate cloud save with local storage
        try {
            localStorage.setItem(`nucleus_study_plan_${user.id}`, JSON.stringify(generatedPlan));
            setTimeout(() => {
                setSaveStatus('success');
            }, 500);
        } catch (e) {
            setSaveStatus('error');
        }
    };

    const handleExportPDF = () => {
        if (generatedPlan) exportPlanToPDF(generatedPlan);
    };

    if (!user) return <div className="text-white">Cargando perfil...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        Generador de Rutas de Aprendizaje
                    </h1>
                    <p className="text-slate-400">
                        Diseña tu estrategia personalizada basada en tu tiempo real disponible.
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center gap-3">
                        <Sparkles size={20} className="text-indigo-400" />
                        <span className="text-sm font-bold text-indigo-300">Powered by NUCLEUS Engine</span>
                    </div>
                </div>
            </div>

            {/* Paso 1: Disponibilidad */}
            <TimeSlotSelector onChange={setAvailability} />

            {/* Acción Principal */}
            <div className="flex justify-center">
                <button
                    onClick={handleGenerate}
                    disabled={Object.keys(availability).length === 0 || isGenerating}
                    className={`
                        group relative overflow-hidden rounded-2xl px-12 py-5 font-black text-lg transition-all
                        ${Object.keys(availability).length === 0
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95'}
                    `}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        {isGenerating ? (
                            <>
                                <Sparkles className="animate-spin" /> Analizando Brechas...
                            </>
                        ) : (
                            <>
                                <Sparkles className="group-hover:rotate-12 transition-transform" />
                                GENERAR MI RUTA INTELIGENTE
                            </>
                        )}
                    </span>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-xl"></div>
                </button>
            </div>

            {/* Resultados del Plan */}
            <AnimatePresence>
                {generatedPlan && !generatedPlan.error && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 my-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tu Ruta Personalizada</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                        </div>

                        {/* Toolbar de Acciones */}
                        <div className="flex flex-wrap gap-4 justify-end mb-4">
                            <button
                                onClick={handleSaveToCloud}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${saveStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    saveStatus === 'saving' ? 'bg-slate-800 text-slate-400 cursor-wait' :
                                        'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                                    }`}
                            >
                                {saveStatus === 'success' ? <CheckCircle2 size={18} /> : <Save size={18} />}
                                {saveStatus === 'success' ? 'Guardado en Nube' : saveStatus === 'saving' ? 'Guardando...' : 'Guardar Progreso'}
                            </button>

                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                            >
                                <Download size={18} /> Descargar PDF Oficial
                            </button>
                        </div>

                        {/* Timeline Visual */}
                        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                            <div className="space-y-8">
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => {
                                    const dayEvents = generatedPlan.schedule.filter(s => s.dayName === day);
                                    if (dayEvents.length === 0) return null;

                                    return (
                                        <div key={day} className="relative pl-8 border-l-2 border-slate-800">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600"></div>
                                            <h4 className="text-xl font-black text-white mb-4">{day}</h4>

                                            <div className="grid gap-4">
                                                {dayEvents.map((event, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700 p-4 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 group"
                                                    >
                                                        <div className="min-w-[140px] flex items-center gap-2 text-slate-400 font-mono text-sm">
                                                            <Clock size={14} />
                                                            {event.blockLabel}
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-900 ${event.color?.replace?.('text-', 'text-') || 'text-white'}`}>
                                                                    {event.areaName}
                                                                </span>
                                                                <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                                                                    <ArrowRight size={10} /> {event.focusLevel}
                                                                </span>
                                                            </div>
                                                            <p className="text-slate-200 font-medium leading-relaxed">
                                                                {event.topic}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}

                {generatedPlan && generatedPlan.error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3 mt-6">
                        <AlertCircle size={20} />
                        {generatedPlan.error}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


