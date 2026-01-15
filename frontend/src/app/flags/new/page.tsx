'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import {
    Info,
    Settings2,
    GitBranch,
    Eye,
    ArrowRight,
    ArrowLeft,
    Lock,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const steps = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'value', label: 'Default Value', icon: Settings2 },
    { id: 'rules', label: 'Rollout Rules', icon: GitBranch },
    { id: 'review', label: 'Review', icon: Eye },
];

export default function NewFlagPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        key: '',
        description: '',
        flagType: 'BOOLEAN',
        defaultValue: 'false',
        enabled: false,
        tags: [] as string[],
    });

    const updateKey = (name: string) => {
        const key = name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        setFormData({ ...formData, name, key });
    };

    const handleCreate = async () => {
        setIsSubmitting(true);
        try {
            await api.post('/api/flags', {
                ...formData,
                tags: formData.tags.length > 0 ? formData.tags : null
            });
            router.push('/flags');
        } catch (error) {
            console.error('Failed to create flag:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header title="Create New Flag" />
            <main className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <h1 className="text-white tracking-tight text-4xl font-black leading-tight pb-2">Create New Feature Flag</h1>
                    <p className="text-slate-400 text-base font-normal">Define the core identity of your flag and its initial behavior.</p>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-start mb-12 px-4 relative">
                    <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-800 z-0" />
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = idx === currentStep;
                        const isCompleted = idx < currentStep;
                        return (
                            <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
                                <div className={cn(
                                    "size-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                                    isActive ? "bg-primary text-white shadow-lg shadow-primary/40 scale-110" :
                                        isCompleted ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500 border border-slate-700"
                                )}>
                                    {isCompleted ? <CheckCircle2 className="size-6" /> : <Icon className="size-6" />}
                                </div>
                                <p className={cn(
                                    "text-sm font-semibold transition-colors",
                                    isActive ? "text-primary" : isCompleted ? "text-emerald-500" : "text-slate-500"
                                )}>
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Form Container */}
                <div className="bg-[#1f2937]/50 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl backdrop-blur-sm">
                    {currentStep === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-200 text-sm font-bold flex items-center gap-2">
                                    Flag Name
                                    <span className="text-slate-500 cursor-help"><Info className="size-4" /></span>
                                </label>
                                <input
                                    className="w-full rounded-xl text-white focus:ring-2 focus:ring-primary/20 border border-slate-800 bg-slate-900/50 h-14 placeholder:text-slate-600 px-4 text-base transition-all outline-none focus:border-primary"
                                    placeholder="e.g. New Checkout Beta"
                                    autoFocus
                                    value={formData.name}
                                    onChange={(e) => updateKey(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-200 text-sm font-bold flex items-center gap-2">
                                    Key
                                    <span className="text-slate-500 cursor-help"><Lock className="size-4" /></span>
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-xl text-slate-400 border border-slate-800 bg-slate-900/20 h-14 px-4 text-base font-mono outline-none cursor-not-allowed"
                                        placeholder="new-checkout-beta"
                                        readOnly
                                        value={formData.key}
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 size-5" />
                                </div>
                                <p className="text-slate-600 text-xs">The key is used to reference the flag in your code. It's generated from the name.</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-200 text-sm font-bold">Description</label>
                                <textarea
                                    className="w-full rounded-xl text-white focus:ring-2 focus:ring-primary/20 border border-slate-800 bg-slate-900/50 min-h-[120px] placeholder:text-slate-600 p-4 text-base resize-none transition-all outline-none focus:border-primary"
                                    placeholder="What does this feature flag control?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                                <div className="flex flex-col">
                                    <span className="text-slate-200 text-sm font-bold">Enabled by default</span>
                                    <span className="text-slate-500 text-xs font-medium">Flag will be active immediately upon creation.</span>
                                </div>
                                <button
                                    onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-[#1f2937] ring-transparent focus:ring-primary/40",
                                        formData.enabled ? "bg-primary" : "bg-slate-700"
                                    )}
                                >
                                    <span className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        formData.enabled ? "translate-x-6" : "translate-x-1"
                                    )} />
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="flex flex-col gap-4">
                                <label className="text-slate-200 text-sm font-bold">Select Flag Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['BOOLEAN', 'STRING', 'NUMBER', 'JSON'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFormData({ ...formData, flagType: type, defaultValue: type === 'BOOLEAN' ? 'false' : '' })}
                                            className={cn(
                                                "p-4 rounded-xl border text-left transition-all group",
                                                formData.flagType === type
                                                    ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5"
                                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                            )}
                                        >
                                            <span className="text-sm font-bold uppercase tracking-wide block mb-1">{type}</span>
                                            <span className="text-xs opacity-60 font-medium">
                                                {type === 'BOOLEAN' ? 'True or False toggle' :
                                                    type === 'STRING' ? 'Text value configuration' :
                                                        type === 'NUMBER' ? 'Numeric thresholds' : 'Complex nested configuration'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-4">
                                <label className="text-slate-200 text-sm font-bold">Default Fallback Value</label>
                                {formData.flagType === 'BOOLEAN' ? (
                                    <div className="flex gap-4">
                                        {['true', 'false'].map((val) => (
                                            <button
                                                key={val}
                                                onClick={() => setFormData({ ...formData, defaultValue: val })}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl border font-bold transition-all",
                                                    formData.defaultValue === val
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                                                )}
                                            >
                                                {val.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                ) : formData.flagType === 'JSON' ? (
                                    <textarea
                                        className="w-full rounded-xl text-white font-mono border border-slate-800 bg-slate-900/50 min-h-[120px] p-4 text-sm transition-all outline-none focus:border-primary"
                                        placeholder='{ "key": "value" }'
                                        value={formData.defaultValue}
                                        onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                                    />
                                ) : (
                                    <input
                                        className="w-full rounded-xl text-white border border-slate-800 bg-slate-900/50 h-14 px-4 text-base outline-none focus:border-primary"
                                        type={formData.flagType === 'NUMBER' ? 'number' : 'text'}
                                        value={formData.defaultValue}
                                        onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 py-8 text-center">
                            <div className="bg-primary/10 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <GitBranch className="text-primary size-8" />
                            </div>
                            <h3 className="text-white text-xl font-bold">Advanced Rollout Rules</h3>
                            <p className="text-slate-400 max-w-sm mx-auto">
                                You can add complex rules like percentage rollouts, user segments, or geographic targeting after creating the flag.
                            </p>
                            <div className="p-4 bg-slate-900/30 rounded-xl border border-dashed border-slate-800 text-slate-500 text-sm font-medium">
                                Initial rollout: 100% to Default Value
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-white text-lg font-bold border-b border-slate-800 pb-3">Final Review</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Name</p>
                                        <p className="text-slate-200 font-bold">{formData.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Key</p>
                                        <p className="text-primary font-mono text-sm">{formData.key}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Type</p>
                                        <p className="text-slate-200 font-bold uppercase">{formData.flagType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Initial State</p>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                                            formData.enabled ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                        )}>
                                            {formData.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-800/30 rounded-xl">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Default value</p>
                                <code className="text-slate-300 font-mono text-sm">{formData.defaultValue}</code>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between max-w-2xl mx-auto mt-10">
                    <button
                        onClick={() => currentStep === 0 ? router.back() : setCurrentStep(currentStep - 1)}
                        className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white font-bold transition-colors group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        {currentStep === 0 ? 'Cancel' : 'Back'}
                    </button>

                    <button
                        disabled={currentStep === 0 && !formData.name || isSubmitting}
                        onClick={() => currentStep === steps.length - 1 ? handleCreate() : setCurrentStep(currentStep + 1)}
                        className="flex items-center gap-2 px-10 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none group"
                    >
                        {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : (
                            <>
                                {currentStep === steps.length - 1 ? 'Create Flag' : 'Next Step'}
                                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </main>
        </>
    );
}
