'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error';

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const push = useCallback(
        (message: string, type: ToastType) => {
            const id = Date.now() + Math.floor(Math.random() * 1000);
            setToasts((current) => [...current, { id, message, type }]);
            setTimeout(() => dismiss(id), 3500);
        },
        [dismiss]
    );

    const value = useMemo(
        () => ({
            success: (message: string) => push(message, 'success'),
            error: (message: string) => push(message, 'error'),
        }),
        [push]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                aria-live="polite"
                className="fixed right-4 top-4 z-[100] flex w-[320px] flex-col gap-3"
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        role="status"
                        className={cn(
                            'flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg',
                            toast.type === 'success'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : 'border-red-500/30 bg-red-500/10 text-red-300'
                        )}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                        ) : (
                            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                        )}
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            aria-label="Dismiss notification"
                            className="rounded p-1 hover:bg-black/20"
                            onClick={() => dismiss(toast.id)}
                            type="button"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
