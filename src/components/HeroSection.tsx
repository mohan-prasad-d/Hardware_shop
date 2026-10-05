import React from 'react';
import { ArrowDown, Wrench, Shield, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const HeroSection: React.FC = () => {
  const { setExplodeOverride } = useCart();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="mechanics"
      className="relative z-20 min-h-screen flex items-center max-w-7xl mx-auto px-6 pt-28 pb-16"
    >
      <div className="max-w-2xl">
        {/* Unboxed Metadata Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-4 tracking-wider">
          <span>SERIES-8 BRUSHLESS ARCHITECTURE</span>
          <span aria-hidden="true">·</span>
          <span>MIL-STD 810H CERTIFIED</span>
          <span aria-hidden="true">·</span>
          <span>ISO 9001 DEPOT</span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05] mb-6"
          style={{ textWrap: 'balance' }}
        >
          Engineered for <br />
          <span className="text-amber-400">High-Torque</span> Duty.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl font-normal">
          Industrial-grade hardware and contractor machinery engineered to withstand 3-meter job-site drops, extreme continuous duty cycles, and high thermal friction. Scroll down to inspect the exploded internal mechanics.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <button
            onClick={() => scrollToSection('depot')}
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Supply Depot</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setExplodeOverride(0.85);
              scrollToSection('engineering');
            }}
            className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold rounded-xl transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-amber-500" />
            <span>Exploded Schematic</span>
          </button>
        </div>

        {/* Technical Metric Points with Tabular Figures */}
        <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 max-w-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Rotary Torque</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">245 Nm</span>
            <span className="text-[11px] text-slate-500 block">Sustained peak</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Motor Speed</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">3,800</span>
            <span className="text-[11px] text-slate-500 block">RPM brushless</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Protection</span>
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">5-Year</span>
            <span className="text-[11px] text-slate-500 block">Drop guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
