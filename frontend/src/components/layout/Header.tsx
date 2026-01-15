import { Bell, Search, BookOpen } from 'lucide-react';

export default function Header({ title }: { title: string }) {
    return (
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#111827]/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-4 flex-1">
                <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
                <div className="max-w-md w-full ml-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 size-4 group-focus-within:text-primary transition-colors" />
                        <input
                            className="w-full pl-10 pr-4 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-slate-200"
                            placeholder="Search flags, configs, or logs (CMD+K)"
                            type="text"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg relative transition-colors">
                    <Bell className="size-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#111827]"></span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors">
                    <BookOpen className="size-4" />
                    Documentation
                </button>
            </div>
        </header>
    );
}
