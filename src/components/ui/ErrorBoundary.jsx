import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary - Previene pantallas blancas cuando hay errores
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error('🔴 ErrorBoundary caught:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                    <div className="bg-slate-900/80 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">
                            Algo salió mal
                        </h2>

                        <p className="text-slate-400 mb-6 text-sm">
                            Ha ocurrido un error inesperado. Por favor, recarga la página para continuar.
                        </p>

                        <button
                            onClick={this.handleReload}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Recargar página
                        </button>

                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-slate-500 text-xs cursor-pointer hover:text-slate-400">
                                    Detalles del error (desarrollo)
                                </summary>
                                <pre className="mt-2 p-3 bg-slate-800 rounded-lg text-xs text-red-400 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
