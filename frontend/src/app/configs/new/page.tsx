'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import {
    Info,
    Settings2,
    Database,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Save,
    Type,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function NewConfigPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        key: '',
        name: '',
        description: '',
        value: '',
        configType: 'STRING'
    });

    const handleCreate = async () => {
        setIsSubmitting(true);
        try {
            // Ensure value is sent in a format the backend expects for JsonNode if type is JSON
            // For now backend uses JsonNode, so we might need to parse it if it's JSON type
            let payload: any = { ...formData };
            if (formData.configType === 'JSON') {
                try {
                    payload.value = JSON.parse(formData.value);
                } catch (e) {
                    console.error('Invalid JSON value');
                    setIsSubmitting(false);
                    return;
                }
            } else if (formData.configType === 'NUMBER') {
                payload.value = parseFloat(formData.value);
            }

            await api.post('/api/configs', payload);
            router.push('/configs');
        } catch (error) {
            console.error('Failed to create config:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header title="Create New Configuration" />
            <main className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <h1 className="text-white tracking-tight text-4xl font-black leading-tight pb-2">Create New Configuration</h1>
                    <p className="text-slate-400 text-base font-normal">Define a dynamic runtime setting for your application.</p>
                </div>

                <div className="bg-[#1f2937]/50 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl backdrop-blur-sm space-y-6">

                    {/* Key & Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-200 text-sm font-bold flex items-center gap-2">
                                <Database className="size-4 text-primary" />
                                Configuration Key
                                <span className="text-slate-500 cursor-help"><Info className="size-4" /></span>
                            </label>
                            <input
                                className="w-full rounded-xl text-white focus:ring-2 focus:ring-primary/20 border border-slate-800 bg-slate-900/50 h-14 placeholder:text-slate-600 px-4 text-base transition-all outline-none focus:border-primary font-mono"
                                placeholder="e.g. MAX_RETRY_COUNT"
                                autoFocus
                                value={formData.key}
                                onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-200 text-sm font-bold flex items-center gap-2">
                                <Type className="size-4 text-primary" />
                                Display Name
                            </label>
                            <input
                                className="w-full rounded-xl text-white focus:ring-2 focus:ring-primary/20 border border-slate-800 bg-slate-900/50 h-14 placeholder:text-slate-600 px-4 text-base transition-all outline-none focus:border-primary"
                                placeholder="e.g. Max Retry Count"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-200 text-sm font-bold flex items-center gap-2">
                            <FileText className="size-4 text-primary" />
                            Description
                        </label>
                        <input
                            className="w-full rounded-xl text-white focus:ring-2 focus:ring-primary/20 border border-slate-800 bg-slate-900/50 h-14 placeholder:text-slate-600 px-4 text-base transition-all outline-none focus:border-primary"
                            placeholder="What is this configuration used for?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Type Selection */}
                    <div className="flex flex-col gap-4">
                        <label className="text-slate-200 text-sm font-bold text-center">Data Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['STRING', 'NUMBER', 'JSON'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFormData({ ...formData, configType: type })}
                                    className={cn(
                                        "p-4 rounded-xl border text-center transition-all",
                                        formData.configType === type
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                    )}
                                >
                                    <span className="text-xs font-bold uppercase tracking-wide">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Value Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-200 text-sm font-bold">Value</label>
                        {formData.configType === 'JSON' ? (
                            <textarea
                                className="w-full rounded-xl text-white font-mono border border-slate-800 bg-slate-900/50 min-h-[150px] p-4 text-sm transition-all outline-none focus:border-primary"
                                placeholder='{ "timeout": 5000 }'
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            />
                        ) : (
                            <input
                                className="w-full rounded-xl text-white border border-slate-800 bg-slate-900/50 h-14 px-4 text-base outline-none focus:border-primary"
                                type={formData.configType === 'NUMBER' ? 'number' : 'text'}
                                placeholder="Enter value..."
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between max-w-2xl mx-auto mt-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white font-bold transition-colors group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Cancel
                    </button>

                    <button
                        disabled={!formData.key || !formData.name || !formData.value || isSubmitting}
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-10 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none group"
                    >
                        {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : (
                            <>
                                <Save className="size-5" />
                                Create Configuration
                            </>
                        )}
                    </button>
                </div>
            </main>
        </>
    );
}
