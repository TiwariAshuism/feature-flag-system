'use client';

import useSWR from 'swr';
import Header from '@/components/layout/Header';
import { Activity, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
    name: string;
    status: 'UP' | 'DOWN';
    details?: string;
}

function ServiceCard({ name, status, details }: ServiceCardProps) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-[#1f2937]/50 p-5">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">{name}</h3>
                <span
                    className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest',
                        status === 'UP'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                    )}
                >
                    {status}
                </span>
            </div>
            <p className="text-xs text-slate-400">{details || 'No extra details'}</p>
        </div>
    );
}

async function healthFetcher(url: string) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error('Failed to fetch health');
    }
    return response.json();
}

export default function HealthPage() {
    const { data, isLoading, mutate } = useSWR('/api/system/health', healthFetcher, {
        refreshInterval: 15000,
    });

    const backendStatus: 'UP' | 'DOWN' = data?.status === 'UP' ? 'UP' : 'DOWN';
    const dbStatus: 'UP' | 'DOWN' =
        data?.components?.db?.status === 'UP' ? 'UP' : 'DOWN';
    const redisStatus: 'UP' | 'DOWN' =
        data?.components?.redis?.status === 'UP' ? 'UP' : 'DOWN';

    return (
        <>
            <Header title="System Health" />
            <div className="space-y-6 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white">
                            Runtime Health Overview
                        </h2>
                        <p className="text-sm text-slate-400">
                            Auto-refreshes every 15 seconds.
                        </p>
                    </div>
                    <button
                        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-slate-700"
                        onClick={() => mutate()}
                        type="button"
                    >
                        <RefreshCw className="size-4" />
                        Refresh
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#111827]/60 p-5">
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-slate-400">
                            <Activity className="size-5 animate-spin" />
                            Checking service health...
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {backendStatus === 'UP' ? (
                                <CheckCircle2 className="size-6 text-emerald-400" />
                            ) : (
                                <XCircle className="size-6 text-red-400" />
                            )}
                            <p className="font-bold text-white">
                                Backend is currently {backendStatus}
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <ServiceCard
                        details="Spring Boot API and GraphQL services"
                        name="Backend API"
                        status={backendStatus}
                    />
                    <ServiceCard
                        details="Primary PostgreSQL connection state"
                        name="PostgreSQL"
                        status={dbStatus}
                    />
                    <ServiceCard
                        details="Redis cache connectivity state"
                        name="Redis"
                        status={redisStatus}
                    />
                </div>
            </div>
        </>
    );
}
