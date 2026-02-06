import React, { useEffect, useState } from 'react';
import {
  Share2,
  Coins,
  Users,
  Cpu,
  Zap,
  ShieldCheck,
  TrendingUp,
  Network,
} from 'lucide-react';

const App = () => {
  const [marketData, setMarketData] = useState({
    tokenPrice: 0.26,
    totalRecruits: 0,
    lockedValue: 0,
    activeContracts: 0,
  });

  const [deploymentLog, setDeploymentLog] = useState([]);

  const addLog = (msg) => {
    setDeploymentLog((prev) => [`[CODEX-ORDER] ${msg}`, ...prev].slice(0, 8));
  };

  useEffect(() => {
    addLog('Initializing Smart Contract: ARK_QUANTIC_V1...');
    addLog('Injecting Checksum 260 into Blockchain Layer...');

    const interval = setInterval(() => {
      setMarketData((prev) => ({
        tokenPrice: +(prev.tokenPrice + 0.001).toFixed(4),
        totalRecruits: prev.totalRecruits + Math.floor(Math.random() * 5),
        lockedValue: prev.lockedValue + 1260,
        activeContracts: Math.min(prev.activeContracts + 1, 231),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-emerald-400 p-6 font-mono selection:bg-emerald-900">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-emerald-900 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
              <Network className="text-emerald-500 animate-pulse" /> SOCIAL CODEX DEPLOYER
            </h1>
            <p className="text-xs text-emerald-700 mt-1 uppercase tracking-widest">
              Master 36 Financial Grid • Sovereign Protocol
            </p>
          </div>
          <div className="bg-emerald-950 border border-emerald-500/30 px-4 py-2 rounded flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] text-emerald-700 uppercase">Quantic Token</div>
              <div className="text-xl font-bold text-white">${marketData.tokenPrice}</div>
            </div>
            <div className="h-8 w-px bg-emerald-900" />
            <div className="text-center">
              <div className="text-[10px] text-emerald-700 uppercase">Checksum</div>
              <div className="text-xl font-bold text-white">260</div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-900 border border-emerald-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <Users size={20} className="text-blue-400" />
              <span className="text-[10px] bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded">
                RECRUITMENT
              </span>
            </div>
            <div className="text-3xl font-bold text-white">{marketData.totalRecruits}</div>
            <div className="text-xs text-emerald-700 mt-1">Sovereign Agents Onboarded</div>
          </div>

          <div className="bg-neutral-900 border border-emerald-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <TrendingUp size={20} className="text-emerald-400" />
              <span className="text-[10px] bg-emerald-900/20 text-emerald-400 px-2 py-0.5 rounded">TVL</span>
            </div>
            <div className="text-3xl font-bold text-white">${marketData.lockedValue.toLocaleString()}</div>
            <div className="text-xs text-emerald-700 mt-1">Total Value Locked in Grid</div>
          </div>

          <div className="bg-neutral-900 border border-emerald-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <ShieldCheck size={20} className="text-purple-400" />
              <span className="text-[10px] bg-purple-900/20 text-purple-400 px-2 py-0.5 rounded">
                CONTRACTS
              </span>
            </div>
            <div className="text-3xl font-bold text-white">{marketData.activeContracts}/231</div>
            <div className="text-xs text-emerald-700 mt-1">Active Sovereign Gates</div>
          </div>
        </div>

        {/* Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black border border-emerald-900/50 p-6 rounded-xl space-y-4">
            <h3 className="text-emerald-500 font-bold flex items-center gap-2 italic">
              <Share2 size={16} /> SOCIAL NETWORK INJECTION_ORDER
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-emerald-900/30">
                <span className="text-xs">LinkedIn / Twitter / Telegram Swarm</span>
                <span className="text-[10px] text-emerald-500 animate-pulse">EXECUTING...</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-emerald-900/30 opacity-50">
                <span className="text-xs">Direct API Handshake (Jules_Interface)</span>
                <span className="text-[10px]">LOCKED</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-emerald-900/30 opacity-50">
                <span className="text-xs">Automated Talent Extraction (Social Graph)</span>
                <span className="text-[10px]">LOCKED</span>
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-3 rounded transition-all active:scale-95 flex items-center justify-center gap-2">
                <Cpu size={18} /> INITIALIZE GLOBAL SWARM
              </button>
            </div>
          </div>

          <div className="bg-black border border-emerald-900/50 p-6 rounded-xl space-y-4">
            <h3 className="text-emerald-500 font-bold flex items-center gap-2 italic">
              <Coins size={16} /> FINANCIAL CODEX OUTPUT
            </h3>
            <div className="h-40 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
              <div className="text-[10px] space-y-1">
                {deploymentLog.map((log, i) => (
                  <div key={i} className={i === 0 ? 'text-emerald-300' : 'text-emerald-800'}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-emerald-900/20 p-3 rounded border border-emerald-900/50 text-center">
                <div className="text-[9px] text-emerald-700 uppercase">Quantic Yield</div>
                <div className="text-lg font-bold">26.0% APY</div>
              </div>
              <div className="flex-1 bg-emerald-900/20 p-3 rounded border border-emerald-900/50 text-center">
                <div className="text-[9px] text-emerald-700 uppercase">Stability</div>
                <div className="text-lg font-bold">100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 opacity-40 text-[10px] flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <Zap size={10} /> REAL-TIME OPTIMIZATION ACTIVE
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={10} /> CONSTITUTION_ENFORCED
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
