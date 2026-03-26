'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AppContextValue {
    userName: string;
    userRole: string;
    environment: string;
    setUserName: (value: string) => void;
    setUserRole: (value: string) => void;
    setEnvironment: (value: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userName, setUserName] = useState(
        process.env.NEXT_PUBLIC_USER_NAME || 'Current User'
    );
    const [userRole, setUserRole] = useState(
        process.env.NEXT_PUBLIC_USER_ROLE || 'Administrator'
    );
    const [environment, setEnvironment] = useState(
        process.env.NEXT_PUBLIC_ENVIRONMENT || 'Production'
    );

    useEffect(() => {
        const storedUserName = localStorage.getItem('app.userName');
        const storedUserRole = localStorage.getItem('app.userRole');
        const storedEnvironment = localStorage.getItem('app.environment');
        if (storedUserName) setUserName(storedUserName);
        if (storedUserRole) setUserRole(storedUserRole);
        if (storedEnvironment) setEnvironment(storedEnvironment);
    }, []);

    const value = useMemo(() => {
        const updateUserName = (nextValue: string) => {
            localStorage.setItem('app.userName', nextValue);
            setUserName(nextValue);
        };
        const updateUserRole = (nextValue: string) => {
            localStorage.setItem('app.userRole', nextValue);
            setUserRole(nextValue);
        };
        const updateEnvironment = (nextValue: string) => {
            localStorage.setItem('app.environment', nextValue);
            setEnvironment(nextValue);
        };

        return {
            userName,
            userRole,
            environment,
            setUserName: updateUserName,
            setUserRole: updateUserRole,
            setEnvironment: updateEnvironment,
        };
    }, [environment, userName, userRole]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppContextProvider');
    }
    return context;
}
