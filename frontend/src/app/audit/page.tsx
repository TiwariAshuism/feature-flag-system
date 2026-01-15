'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import Header from '@/components/layout/Header';
import {
    Search,
    History,
    User,
    Filter,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export default function AuditLogsPage() {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useSWR(`/api/audit?page=${page}&size=10&sort=createdAt,desc`, fetcher);
    const logs = data?.content;
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLogs = logs?.filter((log: any) =>
        log.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Header title="Audit & Compliance Logs" />
            <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Page Heading */}
                <div className="flex items-end justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-white text-3xl font-black tracking-tight">Audit Trail</h2>
                        <p className="text-slate-400 text-sm font-medium">
                            A comprehensive history of all changes made to flags and configurations.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-[#1f2937] hover:bg-slate-700 text-white border border-slate-800 px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                            <Calendar className="size-4" />
                            Last 30 Days
                        </button>
                        <button className="flex items-center gap-2 bg-[#1f2937] hover:bg-slate-700 text-white border border-slate-800 px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#1a1426] rounded-2xl border border-slate-800 p-2 mb-6 flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-slate-500 size-5 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-[#111827] border-none focus:ring-2 focus:ring-primary/40 rounded-xl text-sm text-white placeholder:text-slate-500 transition-all outline-none"
                            placeholder="Filter by user, flag key, or action..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 pr-2">
                        <button className="px-4 py-3 bg-[#111827] hover:bg-slate-800 rounded-xl text-sm font-semibold text-slate-400 border border-slate-800">
                            User: All
                        </button>
                        <button className="px-4 py-3 bg-[#111827] hover:bg-slate-800 rounded-xl text-sm font-semibold text-slate-400 border border-slate-800">
                            Action: All
                        </button>
                    </div>
                </div>

                {/* Audit List */}
                <div className="bg-[#1f2937]/50 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-800/50">
                        {isLoading && (
                            <div className="p-20 text-center">
                                <History className="size-10 mx-auto mb-2 animate-spin text-primary opacity-50" />
                                <p className="text-slate-500">Loading audit trail...</p>
                            </div>
                        )}

                        {filteredLogs?.map((log: any) => (
                            <div key={log.id} className="p-6 hover:bg-slate-800/30 transition-all group">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex gap-4 flex-1">
                                        <div className="bg-slate-800 size-12 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                            <User className="size-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-100">{log.userId || 'System'}</span>
                                                <span className="text-slate-500 text-sm font-medium uppercase tracking-tighter">—</span>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                                                    log.action === 'CREATE' ? "bg-emerald-500/10 text-emerald-400" :
                                                        log.action === 'DELETE' ? "bg-red-500/10 text-red-400" : "bg-primary/10 text-primary"
                                                )}>
                                                    {log.action}
                                                </span>
                                                <span className="text-slate-500 text-sm">—</span>
                                                <code className="text-primary/70 font-mono text-xs">{log.entityType}</code>
                                            </div>
                                            <p className="text-slate-400 text-sm mb-3">
                                                Performed <span className="text-slate-200 font-medium lowercase">{log.action}</span> action on
                                                <span className="text-slate-200 font-medium mx-1">{log.entityType.toLowerCase()}</span>
                                                with ID <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300 mx-1">{log.entityId}</code>
                                            </p>

                                            {/* Diff Preview / Metadata */}
                                            <div className="bg-[#111827] rounded-xl border border-slate-800 p-4 font-mono text-xs flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <ShieldCheck className="size-3 text-emerald-500" />
                                                    <span>Request IP: 127.0.0.1</span>
                                                    <span className="mx-1">•</span>
                                                    <span>Environment: Production</span>
                                                </div>
                                                {log.metadata && (
                                                    <pre className="text-slate-400 overflow-x-auto scrollbar-hide">
                                                        {JSON.stringify(log.metadata, null, 2)}
                                                    </pre>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-4">
                                        <span className="text-xs text-slate-500 font-bold whitespace-nowrap bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
                                            {formatDate(log.createdAt)}
                                        </span>
                                        <button className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 px-4 py-2 rounded-xl">
                                            View Details
                                            <ArrowRight className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {!isLoading && filteredLogs?.length === 0 && (
                            <div className="p-20 text-center">
                                <History className="size-16 mx-auto mb-4 opacity-10" />
                                <p className="text-lg font-bold text-slate-400">No logs found</p>
                                <p className="text-sm mt-1 text-slate-500">Try adjusting your search criteria.</p>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-5 bg-[#111827]/50 border-t border-slate-800 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Page {page + 1} of {data?.totalPages || 1} ({data?.totalElements || 0} total)
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:bg-slate-800 disabled:opacity-30"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= (data?.totalPages || 1) - 1}
                                className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:bg-slate-800 disabled:opacity-30"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
