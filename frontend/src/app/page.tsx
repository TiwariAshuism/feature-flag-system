'use client';

import useSWR from 'swr';
import { ComponentType } from 'react';
import { fetcher } from '@/lib/api';
import Header from '@/components/layout/Header';
import {
    TrendingUp,
    History,
    Activity,
    PlusCircle,
    Settings,
    Zap,
    CheckCircle2,
    Clock,
    ArrowRight,
    User
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { AuditLog, FeatureFlag, ConfigItem, PageResponse } from '@/lib/types';

interface StatCardProps {
    label: string;
    value: number;
    trend?: string;
    icon: ComponentType<{ className?: string }>;
    trendColor: string;
}

function StatCard({ label, value, trend, icon: Icon, trendColor }: StatCardProps) {
    return (
        <div className="bg-[#1f2937] p-6 rounded-xl border border-slate-800 flex flex-col gap-1 shadow-sm hover:border-slate-700 transition-colors group">
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-400 text-sm font-medium">{label}</p>
                <div className="p-2 bg-slate-800 rounded-lg group-hover:text-primary transition-colors">
                    <Icon className="size-4" />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{value}</span>
                {trend && (
                    <span className={cn("text-sm font-medium flex items-center gap-0.5", trendColor)}>
                        <TrendingUp className="size-3" />
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { data: flagData } = useSWR<PageResponse<FeatureFlag>>('/api/flags?size=1', fetcher);
    const { data: configData } = useSWR<PageResponse<ConfigItem>>('/api/configs?size=1', fetcher);
    const { data: logData } = useSWR<PageResponse<AuditLog>>('/api/audit?size=5&sort=createdAt,desc', fetcher);

    const recentLogs = logData?.content;
    const activeFlags = flagData?.totalElements || 0; // Approximate for now

    const stats = [
        { label: 'Total Flags', value: flagData?.totalElements || 0, icon: Activity, trendColor: 'text-emerald-500' },
        { label: 'Total Configs', value: configData?.totalElements || 0, icon: Settings, trendColor: 'text-emerald-500' },
        { label: 'Recent Changes', value: logData?.totalElements || 0, icon: History, trendColor: 'text-orange-500' },
        { label: 'Active Flags', value: activeFlags, trend: 'Live', icon: Zap, trendColor: 'text-primary' },
    ];

    return (
        <>
            <Header title="Dashboard Overview" />
            <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                {/* Quick Actions */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/flags/new" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                            <PlusCircle className="size-5" />
                            Create New Flag
                        </Link>
                        <Link href="/configs" className="flex items-center gap-2 bg-[#1f2937] hover:bg-slate-700 text-white border border-slate-800 px-5 py-2.5 rounded-xl font-bold transition-all">
                            <Settings className="size-5" />
                            Create New Config
                        </Link>
                        <Link
                            className="flex items-center gap-2 bg-[#1f2937] hover:bg-slate-700 text-white border border-slate-800 px-5 py-2.5 rounded-xl font-bold transition-all"
                            href="/health"
                        >
                            <Zap className="size-5" />
                            System Health
                        </Link>
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="bg-[#1f2937] rounded-xl border border-slate-800 shadow-sm overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-white">Recent Activity</h3>
                        <Link className="text-primary text-sm font-medium hover:underline flex items-center gap-1" href="/audit">
                            View all logs
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-800">
                        {recentLogs?.slice(0, 5).map((log) => (
                            <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
                                <div className="bg-slate-800 size-10 rounded-full flex items-center justify-center text-slate-400">
                                    <User className="size-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium text-slate-200">
                                            {log.userId || 'System'}
                                            <span className="text-slate-500 font-normal mx-1">{log.action.toLowerCase()}ed</span>
                                            <code className="bg-slate-900 px-1.5 py-0.5 rounded text-primary font-mono text-xs">{log.entityType}</code>
                                            <span className="text-slate-500 font-normal ml-1">in {log.metadata?.env || 'Production'}</span>
                                        </p>
                                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                            <Clock className="size-3" />
                                            {formatDate(log.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            log.action === 'CREATE' ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"
                                        )}>
                                            {log.action}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">ID: {log.entityId}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!recentLogs?.length && (
                            <div className="p-12 text-center text-slate-500">
                                <History className="size-12 mx-auto mb-4 opacity-20" />
                                No recent activity found.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
