'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    Flag,
    Settings2,
    History,
    Settings,
    Bell,
    Search,
    BookOpen,
    User,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/components/ui/AppContextProvider';

interface NavItemProps {
    href: string;
    icon: any;
    label: string;
    active?: boolean;
}

function NavItem({ href, icon: Icon, label, active }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm",
                active
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            )}
        >
            <Icon className={cn("size-5", active ? "text-white" : "text-slate-500")} />
            {label}
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { userName, userRole } = useAppContext();

    const isNavItemActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname.startsWith(href)) return true;
        return false;
    };

    return (
        <>
            <button
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="fixed left-4 top-4 z-40 rounded-lg border border-slate-700 bg-[#111827] p-2 text-slate-200 lg:hidden"
                onClick={() => setIsOpen((value) => !value)}
                type="button"
            >
                {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            {isOpen && (
                <button
                    aria-label="Close navigation drawer"
                    className="fixed inset-0 z-20 bg-black/60 lg:hidden"
                    onClick={() => setIsOpen(false)}
                    type="button"
                />
            )}
            <aside
                className={cn(
                    'fixed z-30 flex h-full w-64 flex-col border-r border-slate-800 bg-[#111827] shadow-2xl transition-transform',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    'lg:translate-x-0'
                )}
            >
            <div className="p-8 flex items-center gap-3 mb-4">
                <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 rotate-3">
                    <Flag className="size-6 fill-current" />
                </div>
                <div>
                    <h1 className="text-xl font-black leading-none text-white tracking-tighter">FeatureFlow</h1>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1.5 opacity-80">Control Center</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <NavItem href="/" icon={LayoutDashboard} label="Dashboard" active={isNavItemActive('/')} />
                <NavItem href="/flags" icon={Flag} label="Feature Flags" active={isNavItemActive('/flags')} />
                <NavItem href="/configs" icon={Settings2} label="Remote Config" active={isNavItemActive('/configs')} />
                <NavItem href="/audit" icon={History} label="Audit Logs" active={isNavItemActive('/audit')} />
                <div className="pt-8 pb-2 px-4">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Management</p>
                </div>
                <NavItem href="/settings" icon={Settings} label="Project Settings" active={isNavItemActive('/settings')} />
            </nav>

            <div className="p-6 border-t border-slate-800/50 bg-slate-900/20">
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:bg-slate-800/50 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="bg-gradient-to-br from-primary to-indigo-600 size-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                        {userName
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate">{userName}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                            {userRole}
                        </p>
                    </div>
                </div>
            </div>
            </aside>
        </>
    );
}
