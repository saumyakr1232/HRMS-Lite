import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Check, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 4000);
    return id;
  }, []);

  const toast = useCallback({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
  }, [addToast]);

  // Make toast callable and have methods
  const toastFn = useCallback(
    (msg, type) => addToast(msg, type),
    [addToast]
  );
  toastFn.success = (msg) => addToast(msg, 'success');
  toastFn.error = (msg) => addToast(msg, 'error');

  return (
    <ToastContext.Provider value={toastFn}>
      {children}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-xl shadow-lg shadow-black/8 border
              ${t.exiting ? 'animate-toast-out' : 'animate-toast-in'}
              ${t.type === 'success'
                ? 'bg-surface-raised border-success/20 text-ink'
                : 'bg-surface-raised border-danger/20 text-ink'
              }`}
            style={{ minWidth: '280px', maxWidth: '420px' }}
          >
            {t.type === 'success' ? (
              <div className="w-7 h-7 rounded-full bg-success-light flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-success" strokeWidth={2.5} />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-danger-light flex items-center justify-center shrink-0">
                <X className="w-4 h-4 text-danger" strokeWidth={2.5} />
              </div>
            )}
            <p className="text-sm font-medium leading-snug">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
