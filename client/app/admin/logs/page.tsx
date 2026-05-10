import ServerLogsMonitor from '@/components/admin/logs/ServerLogsMonitor';

export const metadata = { title: 'Server Logs — Admin' };

export default function ServerLogsPage() {
  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5]">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 0 3px rgba(34,197,94,.2)',
              animation: 'pulse 2s infinite',
            }}
          />
          <h1 className="text-xl font-bold text-[#1a1a1a]">Server Logs</h1>
        </div>
        <p className="text-sm text-[#8b9aaa] mt-0.5">
          Monitor keep-alive pings · DB latency · Uptime tracking
        </p>
      </div>

      <div className="p-8">
        <ServerLogsMonitor />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
