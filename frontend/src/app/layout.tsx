import Sidebar from '@/components/layout/Sidebar';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-background text-foreground antialiased`}>
                <div className="flex min-h-screen">
                    <Sidebar />
                    <div className="flex-1 ml-64 flex flex-col">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
