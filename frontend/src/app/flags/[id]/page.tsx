'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/api';
import Header from '@/components/layout/Header';
import {
    ArrowLeft,
    Save,
    Trash2,
    Settings,
    Settings2,
    GitBranch,
    Activity,
    ShieldCheck,
    Zap,
    Clock,
    Info,
    ChevronRight,
    Plus
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import api from '@/lib/api';

export default function FlagDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: flag, isLoading } = useSWR(`/api/flags/${id}`, fetcher);
    const [activeTab, setActiveTab] = useState('targeting');
    const [formData, setFormData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (flag) {
            setFormData(flag);
        }
    }, [flag]);

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            await api.put(`/api/flags/${id}`, formData);
            mutate(`/api/flags/${id}`);
            setIsSaving(false);
        } catch (error) {
            console.error('Failed to update flag:', error);
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this flag? This cannot be undone.')) {
            try {
                await api.delete(`/api/flags/${id}`);
                router.push('/flags');
            } catch (error) {
                console.error('Failed to delete flag:', error);
            }
        }
    };

    if (isLoading || !formData) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <Activity className="size-10 animate-spin text-primary opacity-50" />
            </div>
        );
    }

    const tabs = [
        { id: 'targeting', label: 'Targeting & Rules', icon: GitBranch },
        { id: 'variations', label: 'Variations', icon: Settings },
        { id: 'history', label: 'Change History', icon: Clock },
        { id: 'settings', label: 'Settings', icon: ShieldCheck },
    ];

    return (
        <>
            <Header title={`Flag: ${flag.name}`} />
            <div className="flex-1 overflow-y-auto bg-[#0b0f1a]">

                {/* Flag Hero Header */}
                <div className="bg-[#111827] border-b border-slate-800 px-8 py-8">
                    <button
                        onClick={() => router.push('/flags')}
                        className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 text-sm font-bold group transition-colors"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Flags
                    </button>

                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-4 rounded-2xl shadow-inner border border-primary/20">
                                <Zap className="size-8 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-3xl font-black text-white tracking-tight">{flag.name}</h1>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        flag.enabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                    )}>
                                        {flag.enabled ? 'Live' : 'Off'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="text-primary font-mono text-sm font-bold">{flag.key}</code>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-500 text-sm font-medium">{flag.flagType} Flag</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                                        <Clock className="size-3" />
                                        Updated {formatDate(flag.updatedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {isSaving ? <Activity className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Save Changes
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2.5 bg-slate-800 hover:bg-destructive/20 text-slate-500 hover:text-destructive border border-slate-700 rounded-xl transition-all"
                            >
                                <Trash2 className="size-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center gap-8 mt-10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-2 relative",
                                    activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <tab.icon className="size-4" />
                                {tab.label}
                                {tab.id === 'targeting' && (
                                    <span className="absolute -top-1 -right-4 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-[#111827]">
                                        2
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8 max-w-6xl mx-auto">
                    {activeTab === 'targeting' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

                            {/* Main Toggle Block */}
                            <div className="bg-[#1f2937]/50 border border-slate-800 rounded-3xl p-8 flex items-center justify-between shadow-2xl">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-white text-xl font-black">Production Environment</h3>
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
                                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Healthy
                                        </div>
                                    </div>
                                    <p className="text-slate-400 font-medium text-sm">Control the visibility of this flag for all users in production.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Current State</p>
                                        <p className={cn("text-lg font-bold", formData.enabled ? "text-emerald-500" : "text-slate-500")}>
                                            {formData.enabled ? 'Serving Variants' : 'Off (Default Only)'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                                        className={cn(
                                            "relative inline-flex h-10 w-20 items-center rounded-full transition-all focus:outline-none ring-4 ring-offset-4 ring-offset-[#0b0f1a] ring-transparent",
                                            formData.enabled ? "bg-primary shadow-lg shadow-primary/40 ring-primary/20" : "bg-slate-700"
                                        )}
                                    >
                                        <span className={cn(
                                            "inline-block h-8 w-8 transform rounded-full bg-white transition-transform shadow-md",
                                            formData.enabled ? "translate-x-11" : "translate-x-1"
                                        )} />
                                    </button>
                                </div>
                            </div>

                            {/* Targeting Rules */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white">
                                            <GitBranch className="size-5" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg">Prerequisites & Rules</h3>
                                    </div>
                                    <button className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-xl text-sm font-bold transition-all group">
                                        <Plus className="size-4 group-hover:rotate-90 transition-transform" />
                                        Add Individual Targeting
                                    </button>
                                </div>

                                <div className="bg-[#1f2937]/30 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500">
                                    <GitBranch className="size-12 mx-auto mb-4 opacity-10" />
                                    <p className="text-lg font-bold text-slate-400">No targeting rules yet</p>
                                    <p className="text-sm mt-1 mb-6">This flag will serve the default value to all users.</p>
                                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-700 shadow-sm flex items-center gap-2 mx-auto">
                                        <Settings2 className="size-4" />
                                        Configure Rules
                                    </button>
                                </div>

                                {/* Default Serving Block */}
                                <div className="bg-[#1f2937]/50 border border-slate-800 rounded-3xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-slate-800 px-3 py-1 rounded-full text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-700">
                                            Fallback
                                        </div>
                                        <h4 className="text-white font-bold">If no rules match, serve:</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {formData.flagType === 'BOOLEAN' ? (
                                            ['true', 'false'].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setFormData({ ...formData, defaultValue: val })}
                                                    className={cn(
                                                        "relative p-6 rounded-2xl border transition-all text-left group overflow-hidden",
                                                        formData.defaultValue === val ? "bg-primary/10 border-primary" : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between relative z-10">
                                                        <div>
                                                            <p className={cn("text-sm uppercase font-black tracking-widest mb-1", formData.defaultValue === val ? "text-primary" : "text-slate-500 group-hover:text-slate-400")}>VARIANT {val === 'true' ? 'A' : 'B'}</p>
                                                            <p className={cn("text-2xl font-black", formData.defaultValue === val ? "text-white" : "text-slate-400")}>{val.toUpperCase()}</p>
                                                        </div>
                                                        {formData.defaultValue === val && (
                                                            <div className="bg-primary text-white p-1 rounded-full">
                                                                <Plus className="size-5 rotate-45" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {formData.defaultValue === val && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl rounded-full" />}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="col-span-2">
                                                <textarea
                                                    className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 font-mono text-sm text-slate-200 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all min-h-[120px]"
                                                    value={formData.defaultValue}
                                                    onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-400 text-xs font-black uppercase tracking-widest">Flag Name</label>
                                    <input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-400 text-xs font-black uppercase tracking-widest">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none min-h-[100px] resize-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-800">
                                <h4 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                                    <ShieldCheck className="size-4" />
                                    Danger Zone
                                </h4>
                                <p className="text-slate-500 text-sm mb-4">Deleting a flag is permanent and will remove it from all environments immediately. Make sure no client code depends on this key.</p>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                                >
                                    <Trash2 className="size-4" />
                                    Archive & Delete Flag
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
