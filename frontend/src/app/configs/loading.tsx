import { Activity } from 'lucide-react';

export default function ConfigsLoading() {
    return (
        <div className="flex min-h-[40vh] items-center justify-center">
            <Activity className="size-8 animate-spin text-primary" />
        </div>
    );
}
