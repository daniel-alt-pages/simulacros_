import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

/**
 * Toast Context - Sistema de notificaciones global
 */
const ToastContext = createContext(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

const TOAST_TYPES = {
    success: {
        icon: CheckCircle,
        className: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
        iconClass: 'text-emerald-400'
    },
    error: {
        icon: AlertCircle,
        className: 'bg-red-500/20 border-red-500/50 text-red-300',
        iconClass: 'text-red-400'
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
        iconClass: 'text-amber-400'
    },
    info: {
        icon: Info,
        className: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
        iconClass: 'text-blue-400'
    }
};

function Toast({ id, type, message, onDismiss }) {
    const config = TOAST_TYPES[type] || TOAST_TYPES.info;
    const Icon = config.icon;

    useEffect(() => {
        const timer = setTimeout(() => onDismiss(id), 4000);
        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg ${config.className}`}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconClass}`} />
            <span className="text-sm font-medium flex-1">{message}</span>
            <button
                onClick={() => onDismiss(id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        return id;
    };

    const dismissToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const toast = {
        success: (msg) => addToast('success', msg),
        error: (msg) => addToast('error', msg),
        warning: (msg) => addToast('warning', msg),
        info: (msg) => addToast('info', msg)
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => (
                        <Toast
                            key={t.id}
                            id={t.id}
                            type={t.type}
                            message={t.message}
                            onDismiss={dismissToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export default ToastProvider;
