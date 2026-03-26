import { Activity } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <Activity className="size-8 animate-spin text-primary" />
        </div>
    );
}
