'use client';

export default function FlagsError({ reset }: { reset: () => void }) {
    return (
        <div className="p-8">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                <p className="font-semibold">Could not load flags.</p>
                <button
                    className="mt-3 rounded bg-red-500 px-3 py-1.5 text-sm font-semibold text-white"
                    onClick={reset}
                    type="button"
                >
                    Retry
                </button>
            </div>
        </div>
    );
}
