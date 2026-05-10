'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Activity, CheckCircle2, XCircle, Clock, RefreshCw,
  Zap, TrendingUp, AlertTriangle, Wifi, WifiOff,
} from 'lucide-react';

interface PingLog {
  id: number;
  status: 'ok' | 'error';
  latency_ms: number;
  message: string;
  pinged_at: string;
}

interface Stats {
  total: number;
  successful: number;
  failed: number;
  uptime: number;
  avgLatency: number;
  lastPing: string | null;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function fmtTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
}

function LatencyBar({ ms }: { ms: number }) {
  const max = 3000;
  const pct = Math.min((ms / max) * 100, 100);
  const color = ms < 500 ? '#22c55e' : ms < 1500 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2" style={{ minWidth: 80 }}>
      <div
        style={{
          height: 4, width: 60, background: '#e8e2d5',
          borderRadius: 99, overflow: 'hidden', flexShrink: 0,
        }}
      >
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {ms}ms
      </span>
    </div>
  );
}

export default function ServerLogsMonitor() {
  const [logs, setLogs] = useState<PingLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchLogs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/ping-logs');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data.logs ?? []);
      setStats(data.stats ?? null);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(() => fetchLogs(true), 60_000);
    return () => clearInterval(id);
  }, [fetchLogs]);

  const uptimeColor =
    (stats?.uptime ?? 100) >= 99 ? '#22c55e'
    : (stats?.uptime ?? 100) >= 95 ? '#f59e0b'
    : '#ef4444';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #e8e2d5', borderTopColor: '#1084a2', borderRadius: '50%' }} />
          <p style={{ marginTop: 12, color: '#8b9aaa', fontSize: 14 }}>Loading server logs…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <AlertTriangle size={36} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
        <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
        <button
          onClick={() => fetchLogs()}
          style={{
            marginTop: 16, padding: '8px 20px', borderRadius: 8, border: 'none',
            background: '#1084a2', color: '#fff', cursor: 'pointer', fontSize: 13,
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {/* Uptime */}
        <div style={{ background: '#fff', border: '1px solid #e8e2d5', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} color="#22c55e" />
            </div>
            <span style={{ fontSize: 12, color: '#8b9aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uptime</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700, color: uptimeColor, lineHeight: 1 }}>{stats?.uptime ?? 100}%</p>
          <p style={{ fontSize: 12, color: '#aab4be', marginTop: 4 }}>Last 100 pings</p>
        </div>

        {/* Avg Latency */}
        <div style={{ background: '#fff', border: '1px solid #e8e2d5', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#3b82f6" />
            </div>
            <span style={{ fontSize: 12, color: '#8b9aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Latency</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{stats?.avgLatency ?? 0}<span style={{ fontSize: 14, fontWeight: 400, color: '#8b9aaa' }}>ms</span></p>
          <p style={{ fontSize: 12, color: '#aab4be', marginTop: 4 }}>DB response time</p>
        </div>

        {/* Successful */}
        <div style={{ background: '#fff', border: '1px solid #e8e2d5', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#22c55e" />
            </div>
            <span style={{ fontSize: 12, color: '#8b9aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Successful</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{stats?.successful ?? 0}</p>
          <p style={{ fontSize: 12, color: '#aab4be', marginTop: 4 }}>{stats?.failed ?? 0} failed</p>
        </div>

        {/* Last Ping */}
        <div style={{ background: '#fff', border: '1px solid #e8e2d5', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="#a855f7" />
            </div>
            <span style={{ fontSize: 12, color: '#8b9aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Ping</span>
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
            {stats?.lastPing ? timeAgo(stats.lastPing) : '—'}
          </p>
          <p style={{ fontSize: 12, color: '#aab4be', marginTop: 4 }}>
            {stats?.lastPing ? fmtTime(stats.lastPing) : 'No pings yet'}
          </p>
        </div>
      </div>

      {/* ── Latency sparkline (mini chart) ── */}
      {logs.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e8e2d5', borderRadius: 14, padding: '18px 20px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>Latency History (last 50 pings)</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60 }}>
            {logs.slice(0, 50).reverse().map((log) => {
              const max = 3000;
              const h = Math.max(4, Math.round((log.latency_ms / max) * 60));
              const color = log.status === 'error' ? '#ef4444' : log.latency_ms < 500 ? '#1084a2' : log.latency_ms < 1500 ? '#f59e0b' : '#ef4444';
              return (
                <div
                  key={log.id}
                  title={`${log.latency_ms}ms — ${fmtTime(log.pinged_at)}`}
                  style={{
                    flex: 1, height: h, background: color, borderRadius: 2,
                    opacity: 0.8, cursor: 'default', transition: 'opacity .15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            {[
              { color: '#1084a2', label: '< 500ms (Good)' },
              { color: '#f59e0b', label: '500–1500ms (Warn)' },
              { color: '#ef4444', label: '> 1500ms / Error' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 11, color: '#aab4be' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Log table ── */}
      <div style={{ background: '#fff', border: '1px solid #e8e2d5', borderRadius: 14, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #f0ede6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={15} color="#1084a2" />
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Ping Log</p>
            <span style={{ fontSize: 11, background: '#f0ede6', borderRadius: 99, padding: '2px 8px', color: '#8b9aaa', fontWeight: 600 }}>
              {logs.length} entries
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {lastRefresh && (
              <span style={{ fontSize: 11, color: '#aab4be' }}>
                Updated {timeAgo(lastRefresh.toISOString())}
              </span>
            )}
            <button
              onClick={() => fetchLogs(true)}
              disabled={refreshing}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 8, border: '1px solid #e8e2d5',
                background: '#fff', cursor: refreshing ? 'default' : 'pointer',
                fontSize: 12, color: '#3d4852', transition: 'all .15s',
              }}
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {logs.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Wifi size={36} style={{ color: '#e8e2d5', margin: '0 auto 12px' }} />
            <p style={{ color: '#8b9aaa', fontSize: 14 }}>No ping logs yet.</p>
            <p style={{ color: '#aab4be', fontSize: 12, marginTop: 4 }}>
              Set up cron-job.org to ping <code style={{ background: '#f0ede6', padding: '1px 6px', borderRadius: 4 }}>https://alen-james.vercel.app/api/ping</code> every 4 minutes.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#faf7f0' }}>
                  {['Status', 'Latency', 'Message', 'Time', 'Ago'].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#aab4be', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr
                    key={log.id}
                    style={{
                      borderTop: '1px solid #f5f2ec',
                      background: i % 2 === 0 ? '#fff' : '#faf7f0',
                      transition: 'background .1s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f0f8fb'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#fff' : '#faf7f0'; }}
                  >
                    {/* Status */}
                    <td style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {log.status === 'ok'
                          ? <><CheckCircle2 size={14} color="#22c55e" /><span style={{ color: '#22c55e', fontWeight: 600 }}>OK</span></>
                          : <><XCircle size={14} color="#ef4444" /><span style={{ color: '#ef4444', fontWeight: 600 }}>ERROR</span></>
                        }
                      </div>
                    </td>
                    {/* Latency */}
                    <td style={{ padding: '10px 20px' }}>
                      <LatencyBar ms={log.latency_ms} />
                    </td>
                    {/* Message */}
                    <td style={{ padding: '10px 20px', color: '#3d4852', maxWidth: 280 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {log.message}
                      </span>
                    </td>
                    {/* Time */}
                    <td style={{ padding: '10px 20px', color: '#8b9aaa', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtTime(log.pinged_at)}
                    </td>
                    {/* Ago */}
                    <td style={{ padding: '10px 20px', color: '#aab4be', whiteSpace: 'nowrap' }}>
                      {timeAgo(log.pinged_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
