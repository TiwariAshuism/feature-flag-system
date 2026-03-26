import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { AppContextProvider } from '@/components/ui/AppContextProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';
import Sidebar from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-background text-foreground antialiased`}>
                <AppContextProvider>
                    <ToastProvider>
                        <div className="flex min-h-screen">
                            <Sidebar />
                            <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
                                {children}
                            </div>
                        </div>
                    </ToastProvider>
                </AppContextProvider>
            </body>
        </html>
    );
}
