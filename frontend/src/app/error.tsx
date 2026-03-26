'use client';

import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
            <AlertTriangle className="size-10 text-red-400" />
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="max-w-md text-slate-400">
                We hit an unexpected issue while loading this view.
            </p>
            <button
                className="rounded-lg bg-primary px-4 py-2 font-semibold text-white"
                onClick={reset}
                type="button"
            >
                Try again
            </button>
        </div>
    );
}
