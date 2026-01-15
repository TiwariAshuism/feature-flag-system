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
    Database,
    Activity,
    ShieldCheck,
    Clock,
    Info,
    Code,
    Copy,
    Check
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import api from '@/lib/api';

export default function ConfigDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: config, isLoading } = useSWR(`/api/configs/${id}`, fetcher);
    const [formData, setFormData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (config) {
            setFormData(config);
        }
    }, [config]);

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            await api.put(`/api/configs/${id}`, formData);
            mutate(`/api/configs/${id}`);
            setIsSaving(false);
        } catch (error) {
            console.error('Failed to update config:', error);
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this configuration? This cannot be undone.')) {
            try {
                await api.delete(`/api/configs/${id}`);
                router.push('/configs');
            } catch (error) {
                console.error('Failed to delete config:', error);
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(formData.key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading || !formData) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <Activity className="size-10 animate-spin text-primary opacity-50" />
            </div>
        );
    }

    return (
        <>
            <Header title={`Config: ${config.key}`} />
            <div className="flex-1 overflow-y-auto bg-[#0b0f1a] p-8">
                <div className="max-w-5xl mx-auto">

                    <button
                        onClick={() => router.push('/configs')}
                        className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 text-sm font-bold group transition-colors"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Configs
                    </button>

                    <div className="flex items-start justify-between mb-12">
                        <div className="flex items-center gap-6">
                            <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 shadow-2xl">
                                <Database className="size-10 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-black text-white tracking-tighter">{formData.key}</h1>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-primary transition-all"
                                    >
                                        {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-black uppercase rounded-md border border-primary/20 tracking-widest">
                                        {formData.configType}
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                                        <Clock className="size-3" />
                                        Updated {formatDate(formData.updatedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl text-sm font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {isSaving ? <Activity className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Save Configuration
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-8">
                            <div className="bg-[#1f2937]/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Code className="size-5 text-primary" />
                                        <h3 className="text-white font-bold text-lg">Configuration Value</h3>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
                                        <div className="size-1.5 rounded-full bg-emerald-500" />
                                        Redis Active
                                    </div>
                                </div>

                                <div className="relative group">
                                    <textarea
                                        className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 font-mono text-sm text-slate-200 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all min-h-[300px] resize-none overflow-y-auto"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    />
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-900/80 px-2 py-1 rounded">Text Editor</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1f2937]/50 border border-slate-800 rounded-3xl p-8">
                                <h3 className="text-white font-bold mb-4">Implementation Snippet</h3>
                                <div className="bg-[#0b0f1a] rounded-xl p-4 font-mono text-xs text-slate-400 overflow-x-auto">
                                    <pre>
                                        {`// Fetch this config in your application
const configValue = await client.getConfig('${formData.key}');

if (configValue) {
  // Use the value: ${formData.value.length > 20 ? formData.value.substring(0, 20) + '...' : formData.value}
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#1f2937]/50 border border-slate-800 rounded-3xl p-8">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <Info className="size-5 text-primary" />
                                    Metadata
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Created At</p>
                                        <p className="text-slate-300 text-sm font-medium">{formatDate(formData.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Last Modified By</p>
                                        <div className="flex items-center gap-2">
                                            <div className="size-6 bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase">A</div>
                                            <p className="text-slate-300 text-sm font-medium">Alex Chen</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Data Source</p>
                                        <div className="flex items-center gap-2">
                                            <Database className="size-4 text-emerald-500" />
                                            <p className="text-slate-300 text-sm font-medium">PostgreSQL + Redis Cache</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
                                <h4 className="text-red-500 font-bold mb-2">Danger Zone</h4>
                                <p className="text-slate-500 text-xs mb-6">Deleting this config will remove it from Redis and Postgres. This may cause runtime errors in clients if they expect this key.</p>
                                <button
                                    onClick={handleDelete}
                                    className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest"
                                >
                                    Delete Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
