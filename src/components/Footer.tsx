import React from 'react';
import { Shield, Truck, Award, Headphones, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 bg-[#07090c] border-t border-slate-800/80 text-slate-400 text-xs">
      {/* Trust & Verification Strip */}
      <div className="border-b border-slate-800/60 max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-amber-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs mb-0.5">5-Year Drop Warranty</h4>
              <p className="text-[11px] text-slate-500">Full replacement guarantee against impact drops and internal motor stress failure.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-amber-500">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs mb-0.5">Direct Job-Site Freight</h4>
              <p className="text-[11px] text-slate-500">Same-day dispatch from regional depots with 48-hour freight delivery to commercial docks.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-amber-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs mb-0.5">NIST & ISO 9001 Tested</h4>
              <p className="text-[11px] text-slate-500">All torque wrenches, rotary lasers, and impact drivers calibrated to traceable standards.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-amber-500">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs mb-0.5">Commercial Support</h4>
              <p className="text-[11px] text-slate-500">Direct access to tool repair engineers and replacement part assemblies.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <a href="#" className="text-base font-extrabold tracking-wider text-slate-100 flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-amber-500 rounded-sm" />
            <span>FORGE<span className="text-amber-500">POINT</span></span>
          </a>
          <p className="text-slate-500 text-[11px] max-w-sm">
            Contractor hardware, brushless machinery, and precision measurement equipment for commercial infrastructure and industrial plant manufacturing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#mechanics" className="hover:text-amber-400 transition-colors">3D Mechanics</a>
          <a href="#engineering" className="hover:text-amber-400 transition-colors">Engineering</a>
          <a href="#depot" className="hover:text-amber-400 transition-colors">Supply Catalog</a>
          <button onClick={scrollToTop} className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer">
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Sub-strip */}
      <div className="border-t border-slate-900 bg-black/40 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
          <span>&copy; {new Date().getFullYear()} ForgePoint Industrial Hardware Depot. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Contractor Net-30 Logistics</span>
            <span>·</span>
            <span>ISO 9001:2015</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
