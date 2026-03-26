'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import Header from '@/components/layout/Header';
import {
    PlusCircle,
    Search,
    Settings2,
    Edit,
    Trash2,
    Settings,
    Database,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ConfigItem, PageResponse } from '@/lib/types';
import PaginationControls from '@/components/ui/PaginationControls';
import { useAppContext } from '@/components/ui/AppContextProvider';
import { useToast } from '@/components/ui/ToastProvider';
import api from '@/lib/api';
import { mutate } from 'swr';

export default function ConfigsPage() {
    const [page, setPage] = useState(0);
    const swrKey = `/api/configs?page=${page}&size=9`;
    const { data, isLoading } = useSWR<PageResponse<ConfigItem>>(
        swrKey,
        fetcher
    );
    const configs = data?.content;
    const [searchQuery, setSearchQuery] = useState('');
    const { environment } = useAppContext();
    const { success, error: showError } = useToast();

    const filteredConfigs = configs?.filter((config) =>
        config.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(config.value).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deleteConfig = async (id: string, key: string) => {
        if (!confirm(`Delete config "${key}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/api/configs/${id}`);
            await mutate(swrKey);
            success('Configuration deleted successfully.');
        } catch {
            showError('Could not delete configuration. Please retry.');
        }
    };

    return (
        <>
            <Header title="Dynamic Configurations" />
            <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Page Heading */}
                <div className="flex items-end justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-white text-3xl font-black tracking-tight">System Configs</h2>
                        <p className="text-slate-400 text-sm font-medium">
                            Manage non-boolean runtime settings for {environment}.
                        </p>
                    </div>
                    <Link href="/configs/new" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20">
                        <PlusCircle className="size-5" />
                        Create Config
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="bg-[#1a1426] rounded-2xl border border-slate-800 p-2 mb-6 flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-slate-500 size-5 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            aria-label="Search configurations"
                            className="w-full pl-12 pr-4 py-3 bg-[#111827] border-none focus:ring-2 focus:ring-primary/40 rounded-xl text-sm text-white placeholder:text-slate-500 transition-all outline-none"
                            placeholder="Search configs by key or value..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Configs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && (
                        <div className="col-span-full py-20 text-center">
                            <Settings className="size-8 mx-auto mb-2 animate-spin text-primary opacity-50" />
                            <p className="text-slate-500">Loading configurations...</p>
                        </div>
                    )}

                    {filteredConfigs?.map((config) => (
                        <div key={config.id} className="bg-[#1f2937]/50 border border-slate-800 rounded-2xl p-6 hover:border-primary/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <Link href={`/configs/${config.id}`} className="p-1.5 bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary rounded-lg">
                                    <Edit className="size-4" />
                                </Link>
                                <button
                                    aria-label={`Delete config ${config.key}`}
                                    className="p-1.5 bg-slate-800 hover:bg-destructive/20 text-slate-400 hover:text-destructive rounded-lg"
                                    onClick={() => deleteConfig(config.id, config.key)}
                                    type="button"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-slate-800 p-3 rounded-xl group-hover:text-primary transition-colors">
                                    <Database className="size-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-slate-100 font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">
                                        {config.key}
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded border border-primary/20">
                                            {config.configType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 mb-4 font-mono text-xs text-slate-300 break-all max-h-24 overflow-y-auto scrollbar-hide">
                                {config.value}
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Synced to Redis
                                </span>
                                <span>Updated {formatDate(config.updatedAt)}</span>
                            </div>
                        </div>
                    ))}

                    {!isLoading && filteredConfigs?.length === 0 && (
                        <div className="col-span-full bg-[#1a1426] rounded-2xl border border-slate-800 border-dashed p-20 text-center">
                            <Settings2 className="size-16 mx-auto mb-4 opacity-10" />
                            <p className="text-lg font-bold text-slate-400">No configurations found</p>
                            <p className="text-sm mt-1 text-slate-500">Dynamic configs allow you to tune your app without redeploying.</p>
                            <Link href="/configs/new" className="mt-6 text-primary font-bold hover:underline">Create your first config</Link>
                        </div>
                    )}
                </div>

                {/* Pagination Footer */}
                <div className="mt-10 px-6 py-4 bg-[#111827]/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                        Page {page + 1} of {data?.totalPages || 1} ({data?.totalElements || 0} total)
                    </span>
                        <PaginationControls
                            onNext={() => setPage((p) => p + 1)}
                            onPrevious={() => setPage((p) => Math.max(0, p - 1))}
                            page={page}
                            totalPages={data?.totalPages || 1}
                        />
                </div>
            </div>
        </>
    );
}
