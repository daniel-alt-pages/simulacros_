import React, { useState } from 'react';
import { Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
// Bloques de 2 horas para simplificar la UX
const BLOCKS = [
    { id: 'morning_1', label: '6AM - 8AM', type: 'morning' },
    { id: 'morning_2', label: '8AM - 10AM', type: 'morning' },
    { id: 'morning_3', label: '10AM - 12PM', type: 'morning' },
    { id: 'afternoon_1', label: '2PM - 4PM', type: 'afternoon' },
    { id: 'afternoon_2', label: '4PM - 6PM', type: 'afternoon' },
    { id: 'evening_1', label: '6PM - 8PM', type: 'evening' },
    { id: 'evening_2', label: '8PM - 10PM', type: 'evening' } // Late night study
];

export default function TimeSlotSelector({ onChange }) {
    // Estado: Matriz de disponibilidad [dayIndex][blockId] -> boolean
    const [selectedSlots, setSelectedSlots] = useState({});

    const toggleSlot = (dayIdx, blockId) => {
        const key = `${dayIdx}-${blockId}`;
        setSelectedSlots(prev => {
            const newState = { ...prev };
            if (newState[key]) {
                delete newState[key];
            } else {
                newState[key] = true;
            }

            // Notificar al padre
            if (onChange) onChange(newState);
            return newState;
        });
    };

    // Calcular horas totales
    const totalHours = Object.keys(selectedSlots).length * 2; // Cada bloque son 2 horas

    return (
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-indigo-400" />
                        Tu Disponibilidad Semanal
                    </h3>
                    <p className="text-sm text-slate-400">Selecciona los bloques de tiempo que dedicarás al estudio.</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-indigo-400">{totalHours}h</div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Horas / Semana</div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    {/* Header Días */}
                    <div className="grid grid-cols-8 gap-2 mb-2">
                        <div className="text-xs font-bold text-slate-500 uppercase text-center pt-2">Bloque</div>
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-sm font-bold text-slate-300 bg-slate-800/50 py-2 rounded-lg">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Grid de Bloques */}
                    {BLOCKS.map(block => (
                        <div key={block.id} className="grid grid-cols-8 gap-2 mb-2">
                            {/* Label Horario */}
                            <div className="flex items-center justify-center text-[10px] font-bold text-slate-500 bg-slate-900/30 rounded-lg border border-slate-800/50">
                                {block.label}
                            </div>

                            {/* Checkboxes por día */}
                            {DAYS.map((_, dayIdx) => {
                                const isSelected = selectedSlots[`${dayIdx}-${block.id}`];
                                return (
                                    <motion.button
                                        key={`${dayIdx}-${block.id}`}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleSlot(dayIdx, block.id)}
                                        className={`
                                            h-10 rounded-lg flex items-center justify-center transition-all border
                                            ${isSelected
                                                ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]'
                                                : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'}
                                        `}
                                    >
                                        {isSelected && <Check size={16} className="text-white" />}
                                    </motion.button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-slate-800/30 border border-slate-700/50"></div> No disponible</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-indigo-600"></div> Estudio Intensivo</div>
            </div>
        </div>
    );
}
