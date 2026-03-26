import { Bell, Search, BookOpen } from 'lucide-react';
import { useAppContext } from '@/components/ui/AppContextProvider';

export default function Header({ title }: { title: string }) {
    const { environment } = useAppContext();
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-[#111827]/80 px-8 backdrop-blur-md">
            <div className="flex items-center gap-4 flex-1">
                <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
                <div className="max-w-md w-full ml-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 size-4 group-focus-within:text-primary transition-colors" />
                        <label className="sr-only" htmlFor="global-search">
                            Search flags, configurations, or logs
                        </label>
                        <input
                            id="global-search"
                            aria-label="Global search"
                            className="w-full pl-10 pr-4 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-slate-200"
                            placeholder={`Search (${environment})`}
                            type="text"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    aria-label="Open notifications"
                    className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                    type="button"
                >
                    <Bell className="size-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#111827]"></span>
                </button>
                <button
                    aria-label="Open documentation"
                    className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                    type="button"
                >
                    <BookOpen className="size-4" />
                    Documentation
                </button>
            </div>
        </header>
    );
}
