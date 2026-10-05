import React from 'react';
import { Cpu, Cog, ShieldCheck, BatteryCharging, Crosshair } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const EngineeringSection: React.FC = () => {
  const { focusPart, setFocusPart, setExplodeOverride } = useCart();

  const components = [
    {
      id: 'stator',
      title: 'Neodymium Brushless Stator',
      spec: '40% higher efficiency / Zero carbon brush wear',
      icon: Cpu,
      description: 'Enclosed pure copper armature windings paired with high-flux neodymium magnets eliminate mechanical contact friction and continuous rotor heat build-up.'
    },
    {
      id: 'gearbox',
      title: 'Forged S2 All-Steel Planetary Gears',
      spec: '220 - 245 Nm rotary impact rating',
      icon: Cog,
      description: 'Computer-modeled involute gear teeth forged from high-manganese shock alloy. Provides high-ratio rotary torque multiplication without tooth shearing.'
    },
    {
      id: 'chuck',
      title: '1/4-Inch Auto-Locking Quick Chuck',
      spec: 'Dual ball-bearing detent collar',
      icon: Crosshair,
      description: 'Hardened blackened carbon steel collet with spring-assisted quick sleeve. Accepts standard 1/4" hex power bits with zero rotational play.'
    },
    {
      id: 'battery',
      title: 'CoolPack 24V Thermal Diffusion Cell',
      spec: '5.0Ah high-drain lithium pack',
      icon: BatteryCharging,
      description: 'Cell-level thermoplastic cooling ribs channel internal resistance heat outwards, doubling battery service life and preventing thermal shutdown under load.'
    }
  ];

  return (
    <section
      id="engineering"
      className="relative z-20 min-h-screen flex items-center justify-end max-w-7xl mx-auto px-6 py-28"
    >
      <div className="w-full max-w-xl bg-[#0e121a]/90 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 tracking-wider">
          <span>01. MECHANICAL SCHEMATIC</span>
          <span aria-hidden="true">·</span>
          <span>SUB-ASSEMBLY BREAKDOWN</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-4">
          Brushless Core Architecture
        </h2>

        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Every component in the Series-8 powertrain is engineered for continuous duty under severe vibration. Select a module below to inspect its internal mechanics in the 3D viewport.
        </p>

        {/* Interactive Hotspot Selector */}
        <div className="space-y-4">
          {components.map((comp) => {
            const isSelected = focusPart === comp.id;
            const Icon = comp.icon;
            return (
              <div
                key={comp.id}
                onClick={() => {
                  setExplodeOverride(0.9);
                  setFocusPart(isSelected ? null : comp.id);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-bold text-white text-base">{comp.title}</h3>
                      <span className="text-[11px] font-mono text-amber-400/90">
                        {isSelected ? 'INSPECTING' : 'CLICK TO VIEW'}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400 block mb-1.5">
                      {comp.spec}
                    </span>
                    <p className="text-xs text-slate-400 leading-normal">
                      {comp.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
