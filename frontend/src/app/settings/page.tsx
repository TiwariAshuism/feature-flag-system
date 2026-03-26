'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAppContext } from '@/components/ui/AppContextProvider';
import { useToast } from '@/components/ui/ToastProvider';
import { Save, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
    const {
        userName,
        userRole,
        environment,
        setUserName,
        setUserRole,
        setEnvironment,
    } = useAppContext();
    const { success } = useToast();

    const [draftUserName, setDraftUserName] = useState(userName);
    const [draftUserRole, setDraftUserRole] = useState(userRole);
    const [draftEnvironment, setDraftEnvironment] = useState(environment);

    const saveSettings = () => {
        setUserName(draftUserName.trim() || 'Current User');
        setUserRole(draftUserRole.trim() || 'Administrator');
        setEnvironment(draftEnvironment.trim() || 'Production');
        success('Project settings saved.');
    };

    const resetDefaults = () => {
        setDraftUserName('Current User');
        setDraftUserRole('Administrator');
        setDraftEnvironment('Production');
        setUserName('Current User');
        setUserRole('Administrator');
        setEnvironment('Production');
        success('Settings reset to defaults.');
    };

    return (
        <>
            <Header title="Project Settings" />
            <div className="mx-auto max-w-3xl space-y-6 p-8">
                <div>
                    <h2 className="text-2xl font-black text-white">Workspace Preferences</h2>
                    <p className="text-sm text-slate-400">
                        These values are stored locally in your browser and used across
                        the dashboard UI.
                    </p>
                </div>

                <div className="space-y-5 rounded-2xl border border-slate-800 bg-[#1f2937]/40 p-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200" htmlFor="settings-user-name">
                            Display Name
                        </label>
                        <input
                            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-slate-100 outline-none focus:border-primary"
                            id="settings-user-name"
                            onChange={(event) => setDraftUserName(event.target.value)}
                            value={draftUserName}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200" htmlFor="settings-user-role">
                            Role
                        </label>
                        <input
                            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-slate-100 outline-none focus:border-primary"
                            id="settings-user-role"
                            onChange={(event) => setDraftUserRole(event.target.value)}
                            value={draftUserRole}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200" htmlFor="settings-environment">
                            Environment Label
                        </label>
                        <input
                            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-slate-100 outline-none focus:border-primary"
                            id="settings-environment"
                            onChange={(event) => setDraftEnvironment(event.target.value)}
                            value={draftEnvironment}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-700"
                        onClick={resetDefaults}
                        type="button"
                    >
                        <RotateCcw className="size-4" />
                        Reset
                    </button>
                    <button
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90"
                        onClick={saveSettings}
                        type="button"
                    >
                        <Save className="size-4" />
                        Save Settings
                    </button>
                </div>
            </div>
        </>
    );
}
