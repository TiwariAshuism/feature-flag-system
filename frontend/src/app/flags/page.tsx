'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/api';
import Header from '@/components/layout/Header';
import {
    PlusCircle,
    Search,
    Filter,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Flag as FlagIcon,
    Activity
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';
import api from '@/lib/api';

export default function FlagsPage() {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useSWR(`/api/flags?page=${page}&size=10`, fetcher);
    const flags = data?.content;
    const [searchQuery, setSearchQuery] = useState('');

    const toggleFlag = async (id: string) => {
        try {
            await api.post(`/api/flags/${id}/toggle`);
            mutate('/api/flags');
        } catch (error) {
            console.error('Failed to toggle flag:', error);
        }
    };

    const filteredFlags = flags?.filter((flag: any) =>
        flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <>
            <Header title="Feature Flags" />
            <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Page Heading */}
                <div className="flex items-end justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-white text-3xl font-black tracking-tight">Feature Flags</h2>
                        <p className="text-slate-400 text-sm font-medium">
                            Showing {filteredFlags?.length || 0} active flags across Production
                        </p>
                    </div>
                    <Link href="/flags/new" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20">
                        <PlusCircle className="size-5" />
                        Create Flag
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="bg-[#1a1426] rounded-2xl border border-slate-800 p-2 mb-6 flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-slate-500 size-5 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-[#111827] border-none focus:ring-2 focus:ring-primary/40 rounded-xl text-sm text-white placeholder:text-slate-500 transition-all outline-none"
                            placeholder="Search flags by name, key, or tag..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                        <button className="flex items-center gap-2 px-4 py-3 bg-[#111827] hover:bg-slate-800 rounded-xl text-sm font-semibold text-slate-400 transition-colors border border-slate-800">
                            <Filter className="size-4" />
                            Status: All
                        </button>
                    </div>
                </div>

                {/* Flags Table */}
                <div className="bg-[#1a1426] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#111827]/50 border-b border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Key</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tags</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-slate-300">
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <Activity className="size-8 mx-auto mb-2 animate-spin text-primary opacity-50" />
                                        Loading feature flags...
                                    </td>
                                </tr>
                            )}
                            {filteredFlags?.map((flag: any) => (
                                <tr key={flag.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <Link href={`/flags/${flag.id}`} className="text-sm font-bold text-slate-100 hover:text-primary transition-colors">
                                                {flag.name}
                                            </Link>
                                            <span className="text-xs text-slate-500 truncate max-w-[200px]">{flag.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="px-2 py-1 bg-[#111827] rounded-md text-[13px] font-mono text-primary/80">
                                            {flag.key}
                                        </code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => toggleFlag(flag.id)}
                                                className={cn(
                                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-[#1a1426] ring-transparent focus:ring-primary/40",
                                                    flag.enabled ? "bg-primary" : "bg-slate-700"
                                                )}
                                            >
                                                <span className={cn(
                                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                    flag.enabled ? "translate-x-6" : "translate-x-1"
                                                )} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-bold uppercase rounded-md border border-primary/20">
                                            {flag.flagType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {flag.tags?.map((tag: string) => (
                                                <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[11px] font-medium rounded-full">
                                                    {tag}
                                                </span>
                                            )) || <span className="text-slate-600 text-xs">-</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/flags/${flag.id}`} className="p-1.5 text-slate-500 hover:text-primary transition-colors">
                                                <Edit className="size-4" />
                                            </Link>
                                            <button className="p-1.5 text-slate-500 hover:text-destructive transition-colors">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && filteredFlags?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                                        <FlagIcon className="size-16 mx-auto mb-4 opacity-10" />
                                        <p className="text-lg font-bold text-slate-400">No flags found</p>
                                        <p className="text-sm mt-1">Try adjusting your search or create a new flag.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="px-6 py-4 bg-[#111827]/50 flex items-center justify-between border-t border-slate-800">
                        <span className="text-xs font-medium text-slate-500">
                            Page {page + 1} of {data?.totalPages || 1} ({data?.totalElements || 0} total)
                        </span>
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
