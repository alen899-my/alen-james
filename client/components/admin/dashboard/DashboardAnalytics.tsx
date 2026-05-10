'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Eye, Activity, Clock, MousePointerClick, 
  MonitorSmartphone, Globe, Zap, Server, TrendingUp, TrendingDown,
  BarChart3, PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data Generators ---
const generateSparkline = (count: number, min: number, max: number) => 
  Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);

interface PingStats {
  uptime: number;
  avgLatency: number;
  total: number;
  successful: number;
}

export default function DashboardAnalytics({ 
  dbStats 
}: { 
  dbStats: { works: number; blogs: number; skills: number; experiences: number; } 
}) {
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  const [pingStats, setPingStats] = useState<PingStats | null>(null);
  
  // Dynamic arrays
  const [trafficData, setTrafficData] = useState<number[]>(Array(24).fill(0));
  const [latencyData, setLatencyData] = useState<number[]>(Array(20).fill(0));
  const [topSources, setTopSources] = useState<{name: string, val: number, color: string}[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const data = await res.json();
          setActiveUsers(data.activeUsers);
          setTotalViews(data.totalViews);
          setEngagementScore(data.engagementScore);
          setTrafficData(data.hourlyTraffic?.length === 24 ? data.hourlyTraffic : Array(24).fill(0));
          setTopSources(data.topPaths?.length > 0 ? data.topPaths : [
            { name: 'No traffic yet', val: 100, color: '#e8e2d5' }
          ]);
        }
      } catch (err) {}
    };

    const fetchPings = async () => {
      try {
        const res = await fetch('/api/admin/ping-logs');
        if (res.ok) {
          const data = await res.json();
          setPingStats(data.stats);
          if (data.logs && data.logs.length > 0) {
            setLatencyData(data.logs.slice(0, 20).map((l: any) => l.latency_ms).reverse());
          }
        }
      } catch (err) {}
    };

    fetchAnalytics();
    fetchPings();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchPings();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Row: Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Active Users */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users size={80} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Users size={20} />
            </div>
            <span className="text-sm font-semibold text-[#8b9aaa] uppercase tracking-wider">Active Now</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#1a1a1a]">{activeUsers}</span>
            <div className="flex items-center gap-1 text-green-500 text-sm font-medium mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
          </div>
          <p className="text-sm text-[#aab4be] mt-2">Currently on site</p>
        </div>

        {/* Page Views */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
              <Eye size={20} />
            </div>
            <span className="text-sm font-semibold text-[#8b9aaa] uppercase tracking-wider">Page Views</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#1a1a1a]">
              {totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews}
            </span>
          </div>
          <p className="text-sm text-[#aab4be] mt-2">Total tracked views</p>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <MousePointerClick size={20} />
            </div>
            <span className="text-sm font-semibold text-[#8b9aaa] uppercase tracking-wider">Engagement</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#1a1a1a]">{engagementScore}%</span>
          </div>
          <p className="text-sm text-[#aab4be] mt-2">Visitor interaction</p>
        </div>

        {/* Server Uptime */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
              <Server size={20} />
            </div>
            <span className="text-sm font-semibold text-[#8b9aaa] uppercase tracking-wider">Server Status</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#1a1a1a]">{pingStats?.uptime ?? 100}%</span>
            <div className="flex items-center gap-1 text-green-500 text-sm font-medium mb-1">
              {pingStats?.avgLatency ?? 0}ms
            </div>
          </div>
          <p className="text-sm text-[#aab4be] mt-2">Neon DB & Vercel</p>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Traffic Overview */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                <BarChart3 size={20} className="text-[#1084a2]" />
                Traffic Overview
              </h3>
              <p className="text-sm text-[#8b9aaa]">Visitors over the last 24 hours</p>
            </div>
            <select className="bg-[#faf7f0] border-none text-sm font-medium text-[#3d4852] py-2 px-4 rounded-lg outline-none cursor-pointer">
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div className="h-[240px] flex items-end gap-2">
            {trafficData.map((val, i) => {
              const maxTraffic = Math.max(...trafficData, 10);
              const height = (val / maxTraffic) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                    className="w-full bg-[#e8e2d5] rounded-t-md group-hover:bg-[#1084a2] transition-colors relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      {val} visits
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-[#aab4be] px-2 border-t border-[#e8e2d5] pt-4">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Visitors Source & Device */}
        <div className="flex flex-col gap-6">
          {/* Top Sources */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm flex-1">
            <h3 className="text-base font-bold text-[#1a1a1a] mb-5 flex items-center gap-2">
              <Globe size={18} className="text-[#1084a2]" />
              Top Visited Pages
            </h3>
            <div className="space-y-4">
              {topSources.map(src => (
                <div key={src.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[#3d4852]">{src.name}</span>
                    <span className="font-bold text-[#1a1a1a]">{src.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#f0ede6] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${src.val}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: src.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database Content Stats */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm flex-1">
            <h3 className="text-base font-bold text-[#1a1a1a] mb-5 flex items-center gap-2">
              <PieChart size={18} className="text-[#1084a2]" />
              Content Distribution
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#faf7f0] p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-[#1a1a1a]">{dbStats.works}</p>
                <p className="text-xs font-semibold text-[#8b9aaa] uppercase tracking-wide mt-1">Projects</p>
              </div>
              <div className="bg-[#faf7f0] p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-[#1a1a1a]">{dbStats.experiences}</p>
                <p className="text-xs font-semibold text-[#8b9aaa] uppercase tracking-wide mt-1">Roles</p>
              </div>
              <div className="bg-[#faf7f0] p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-[#1a1a1a]">{dbStats.skills}</p>
                <p className="text-xs font-semibold text-[#8b9aaa] uppercase tracking-wide mt-1">Skills</p>
              </div>
              <div className="bg-[#faf7f0] p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-[#1a1a1a]">{dbStats.blogs}</p>
                <p className="text-xs font-semibold text-[#8b9aaa] uppercase tracking-wide mt-1">Articles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Server Performance Monitor */}
      <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
              <Activity size={20} className="text-[#22c55e]" />
              Live Server Performance
            </h3>
            <p className="text-sm text-[#8b9aaa]">Database ping latency (ms)</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a]">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            Monitoring Active
          </div>
        </div>
        
        <div className="h-[120px] flex items-end gap-1">
          {latencyData.map((val, i) => {
            const height = Math.min((val / 200) * 100, 100);
            const color = val > 150 ? '#ef4444' : val > 80 ? '#f59e0b' : '#22c55e';
            return (
              <div key={i} className="flex-1 flex flex-col justify-end group relative cursor-pointer h-full">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, height)}%` }}
                  transition={{ duration: 0.5 }}
                  className="w-full rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: color }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  {val}ms
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
