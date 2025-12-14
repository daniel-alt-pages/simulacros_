import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'

// ========================================
// SISTEMA DE SEGURIDAD NUCLEUS
// ========================================
import { initSecureEnvironment } from './utils/secureLogger';

// Inicializar Seguridad (Consola Encriptada & Bloqueos)
initSecureEnvironment();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)

