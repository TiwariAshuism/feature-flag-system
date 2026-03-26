'use client';

import { useEffect, useMemo, useState } from 'react';

type Flag = { id: string; key: string; name: string; enabled: boolean };
type Config = { id: string; key: string; value: string; configType: string };
type Snapshot = {
  fetchedAt: string;
  health: string;
  flags: Flag[];
  configs: Config[];
};

async function loadSnapshot(): Promise<Snapshot | null> {
  try {
    const response = await fetch('/api/runtime/snapshot', { cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as Snapshot;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamConnected, setStreamConnected] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const data = await loadSnapshot();
    if (!data) {
      setError('Could not fetch runtime snapshot from backend.');
      setLoading(false);
      return;
    }

    setSnapshot(data);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
    const pollingTimer = setInterval(() => {
      void refresh();
    }, 10000);

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/stream/events`
    );

    eventSource.onopen = () => {
      setStreamConnected(true);
    };

    eventSource.onmessage = () => {
      void refresh();
    };

    eventSource.onerror = () => {
      setStreamConnected(false);
    };

    return () => {
      clearInterval(pollingTimer);
      eventSource.close();
    };
  }, []);

  const flagsByKey = useMemo(() => {
    const map = new Map<string, boolean>();
    snapshot?.flags.forEach((flag) => map.set(flag.key.toLowerCase(), flag.enabled));
    return map;
  }, [snapshot]);

  const configsByKey = useMemo(() => {
    const map = new Map<string, string>();
    snapshot?.configs.forEach((config) =>
      map.set(config.key.toLowerCase(), String(config.value))
    );
    return map;
  }, [snapshot]);

  const isEnabled = (key: string, fallback = false) =>
    flagsByKey.get(key.toLowerCase()) ?? fallback;
  const getConfig = (key: string, fallback: string) =>
    configsByKey.get(key.toLowerCase()) ?? fallback;

  const showMaintenance = isEnabled('maintenance_mode', false);
  const showExpressCheckout = isEnabled('express_checkout', true);
  const showNewSearch = isEnabled('new_search_v2', false);
  const recommendModel = getConfig('recommendation_model', 'baseline-v1');
  const checkoutMessage = getConfig(
    'checkout_banner_text',
    'Free shipping for orders over $50.'
  );
  const maxCartItems = Number(getConfig('max_cart_items', '20'));

  return (
    <main>
      <div className="top-row">
        <div>
          <h1>Commerce Client Demo</h1>
          <p>A meaningful consumer app driven by live flags/configs.</p>
        </div>
        <button className="refresh-btn" onClick={() => void refresh()} type="button">
          Refresh now
        </button>
      </div>

      {loading && <p>Loading runtime controls...</p>}
      {error && <p className="error-text">{error}</p>}

      <section className="card">
        <h2>Runtime Status</h2>
        <p>
          Backend:{' '}
          <span className={`pill ${snapshot?.health === 'UP' ? 'up' : 'down'}`}>
            {snapshot?.health || 'DOWN'}
          </span>
        </p>
        <p>
          Live stream:{' '}
          <span className={`pill ${streamConnected ? 'up' : 'down'}`}>
            {streamConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </p>
        <p className="muted">
          Last sync: {snapshot?.fetchedAt ? new Date(snapshot.fetchedAt).toLocaleTimeString() : '-'}
        </p>
      </section>

      {showMaintenance && (
        <section className="card danger">
          <h2>Maintenance Banner (Feature Flag)</h2>
          <p>The app is in maintenance mode. Checkout interactions are read-only.</p>
        </section>
      )}

      <section className="grid">
        <div className="card">
          <h3>Checkout Experience</h3>
          <p>{checkoutMessage}</p>
          <p>Max cart items from config: <strong>{maxCartItems}</strong></p>
          <button className="action-btn" disabled={!showExpressCheckout || showMaintenance} type="button">
            {showExpressCheckout ? 'Express Checkout Enabled' : 'Express Checkout Disabled'}
          </button>
        </div>

        <div className="card">
          <h3>Search Experience</h3>
          <p>
            Active engine:{' '}
            <strong>{showNewSearch ? 'Semantic Search V2' : 'Legacy Search V1'}</strong>
          </p>
          <p className="muted">
            Controlled by flag key: <code>new_search_v2</code>
          </p>
        </div>

        <div className="card">
          <h3>Recommendations</h3>
          <p>
            Serving model: <strong>{recommendModel}</strong>
          </p>
          <p className="muted">
            Controlled by config key: <code>recommendation_model</code>
          </p>
        </div>
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h2>Live Controls Snapshot</h2>
        <div className="grid">
          <div className="card">
            <h3>Flags ({snapshot?.flags.length || 0})</h3>
            <ul className="list">
              {snapshot?.flags.slice(0, 12).map((flag) => (
                <li key={flag.id}>
                  <span>{flag.key}</span>
                  <span className={`pill ${flag.enabled ? 'up' : 'down'}`}>
                    {flag.enabled ? 'ON' : 'OFF'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Configs ({snapshot?.configs.length || 0})</h3>
            <ul className="list">
              {snapshot?.configs.slice(0, 12).map((config) => (
                <li key={config.id}>
                  <span>{config.key}</span>
                  <code>{String(config.value)}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
