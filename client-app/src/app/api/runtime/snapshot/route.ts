import { NextResponse } from 'next/server';

type Flag = {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
};

type Config = {
  id: string;
  key: string;
  value: string;
  configType: string;
};

type Pageable<T> = {
  content: T[];
  totalElements: number;
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function GET() {
  const apiBase =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://backend:8080';

  const [flags, configs, health] = await Promise.all([
    fetchJson<Pageable<Flag>>(`${apiBase}/api/flags?page=0&size=50`),
    fetchJson<Pageable<Config>>(`${apiBase}/api/configs?page=0&size=50`),
    fetchJson<{ status: string }>(`${apiBase}/actuator/health`)
  ]);

  return NextResponse.json(
    {
      fetchedAt: new Date().toISOString(),
      health: health?.status || 'DOWN',
      flags: flags?.content || [],
      configs: configs?.content || []
    },
    { status: 200 }
  );
}
