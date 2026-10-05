import React, { useState, useEffect } from 'react';
import { ShoppingBag, FileText, Search, PackageCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen, setIsTrackingOpen, setIsRfqOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-[#090b0e]/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg'
          : 'bg-transparent border-b border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-lg font-extrabold tracking-wider text-slate-100 flex items-center gap-2 group"
        >
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm group-hover:rotate-45 transition-transform" />
          <span>FORGE<span className="text-amber-500">POINT</span></span>
        </a>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-slate-300">
          <a
            href="#mechanics"
            className="hover:text-amber-400 transition-colors py-1 hover:underline underline-offset-8"
          >
            3D MECHANICS
          </a>
          <a
            href="#engineering"
            className="hover:text-amber-400 transition-colors py-1 hover:underline underline-offset-8"
          >
            ENGINEERING
          </a>
          <a
            href="#depot"
            className="hover:text-amber-400 transition-colors py-1 hover:underline underline-offset-8"
          >
            SUPPLY DEPOT
          </a>
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hover:text-amber-400 transition-colors py-1 hover:underline underline-offset-8 flex items-center gap-1.5 cursor-pointer"
          >
            TRACK ORDER
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRfqOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>Contractor RFQ</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline text-xs font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="font-mono text-xs bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded font-bold min-w-5 text-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
