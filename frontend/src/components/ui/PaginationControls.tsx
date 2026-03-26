import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}

export default function PaginationControls({
    page,
    totalPages,
    onPrevious,
    onNext,
}: PaginationControlsProps) {
    return (
        <div className="flex items-center gap-2">
            <button
                aria-label="Go to previous page"
                className="rounded-lg border border-slate-800 p-2 text-slate-400 disabled:opacity-30 hover:bg-slate-800"
                disabled={page === 0}
                onClick={onPrevious}
                type="button"
            >
                <ChevronLeft className="size-4" />
            </button>
            <button
                aria-label="Go to next page"
                className="rounded-lg border border-slate-800 p-2 text-slate-400 disabled:opacity-30 hover:bg-slate-800"
                disabled={page >= totalPages - 1}
                onClick={onNext}
                type="button"
            >
                <ChevronRight className="size-4" />
            </button>
        </div>
    );
}
