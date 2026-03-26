import { NextResponse } from 'next/server';

export async function GET() {
    const preferredBaseUrl = process.env.BACKEND_INTERNAL_URL;
    const publicBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    const baseUrls = [
        preferredBaseUrl,
        // In Docker networks, backend is reachable by service name.
        'http://backend:8080',
        publicBaseUrl,
        'http://localhost:8080',
    ].filter(Boolean) as string[];

    const errors: string[] = [];

    for (const baseUrl of baseUrls) {
        const targetUrl = `${baseUrl}/actuator/health`;
        try {
            const response = await fetch(targetUrl, { cache: 'no-store' });
            if (!response.ok) {
                errors.push(`${targetUrl} -> ${response.status}`);
                continue;
            }

            const data = await response.json();
            return NextResponse.json(data, { status: 200 });
        } catch {
            errors.push(`${targetUrl} -> unreachable`);
        }
    }

    return NextResponse.json(
        {
            status: 'DOWN',
            error: 'Unable to reach backend health endpoint',
            attempts: errors,
        },
        { status: 200 }
    );
}
