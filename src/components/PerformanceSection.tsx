import React from 'react';
import { Gauge, Flame, Activity, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const PerformanceSection: React.FC = () => {
  const { setExplodeOverride } = useCart();

  return (
    <section className="relative z-20 min-h-[85vh] flex items-center max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 tracking-wider">
          <span>02. QUALITY ASSURANCE</span>
          <span aria-hidden="true">·</span>
          <span>DYNAMICS & STRESS SIMULATION</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-6">
          High-Torque <br />
          <span className="text-amber-400">Stress Dynamics</span>
        </h2>

        <p className="text-base text-slate-300 mb-8 leading-relaxed font-normal">
          Before entering the field, every production batch undergoes 5,000 continuous fastener drive cycles under severe rotational stalls, acoustic noise validation, and drop impact tests on solid concrete.
        </p>

        {/* Verification Checkpoints */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 bg-[#0e121a]/80 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0 mt-0.5">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">245 Nm Sustained Stall Rating</h4>
              <p className="text-xs text-slate-400">The planetary transmission resists up to 245 Nm of instantaneous reverse inertia without stripping internal ring gears.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#0e121a]/80 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0 mt-0.5">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Thermal Overload Cutoff (4ms)</h4>
              <p className="text-xs text-slate-400">Microcontroller continuously monitors armature winding resistance, cutting off voltage spikes in 4 milliseconds to prevent coil burnouts.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#0e121a]/80 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0 mt-0.5">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Balanced Armature Anti-Vibration</h4>
              <p className="text-xs text-slate-400">Laser-balanced rotor minimizes operator wrist strain, reducing high-frequency vibrations to under 8.2 m/s².</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const depot = document.getElementById('depot');
            if (depot) depot.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
        >
          View Equipment in Depot Catalog →
        </button>
      </div>
    </section>
  );
};
