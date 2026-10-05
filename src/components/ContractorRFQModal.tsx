import React, { useState } from 'react';
import { X, CheckCircle2, Calculator, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ContractorRFQModal: React.FC = () => {
  const { isRfqOpen, setIsRfqOpen } = useCart();
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [estimatedUnits, setEstimatedUnits] = useState('25-50 Units');
  const [projectType, setProjectType] = useState('Commercial Structural Assembly');
  const [notes, setNotes] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isRfqOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactName,
          email,
          phone,
          estimatedUnits,
          projectType,
          notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedId(data.quoteReference);
      }
    } catch {
      alert('Could not submit RFQ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0e121a] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={() => {
            setIsRfqOpen(false);
            setSubmittedId(null);
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedId ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h3 className="text-2xl font-black text-white">Commercial RFQ Transmitted</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your bulk requisition has been assigned reference ID{' '}
              <span className="text-amber-400 font-mono font-bold">{submittedId}</span>.
              A technical account specialist will provide volume price tiers within 2 business hours.
            </p>
            <button
              onClick={() => {
                setIsRfqOpen(false);
                setSubmittedId(null);
              }}
              className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <span>B2B COMMERCIAL CONTRACTS</span>
              <span aria-hidden="true">·</span>
              <span>VOLUME PRICING SCHEDULE</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
              Contractor Volume RFQ
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Procure direct-from-depot contractor pricing with Net-30/60 billing terms and custom fleet serialization.
            </p>

            {/* Discount Schedule Banner */}
            <div className="bg-[#121620] border border-slate-800 rounded-xl p-3 mb-6 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 bg-slate-900/80 rounded-lg">
                <span className="text-slate-500 block text-[10px]">10 - 24 UNITS</span>
                <span className="text-amber-400 font-bold">15% Off MSP</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg">
                <span className="text-slate-500 block text-[10px]">25 - 99 UNITS</span>
                <span className="text-amber-400 font-bold">25% Off MSP</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg">
                <span className="text-slate-500 block text-[10px]">100+ UNITS</span>
                <span className="text-emerald-400 font-bold">32% Off + Free Spares</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    Contracting Firm *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Sterling Structural Ltd"
                    className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    Primary Contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="David Vance"
                    className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    Procurement Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@sterling.com"
                    className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    Phone Direct
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (312) 555-0199"
                    className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    Requisition Volume
                  </label>
                  <select
                    value={estimatedUnits}
                    onChange={(e) => setEstimatedUnits(e.target.value)}
                    className="w-full bg-[#121620] border border-slate-800 text-white p-2.5 rounded-lg outline-none"
                  >
                    <option value="10-24 Units">10 - 24 Units</option>
                    <option value="25-50 Units">25 - 50 Units</option>
                    <option value="50-100 Units">50 - 100 Units</option>
                    <option value="100+ Enterprise Fleet">100+ Enterprise Fleet</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    Project Domain
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-[#121620] border border-slate-800 text-white p-2.5 rounded-lg outline-none"
                  >
                    <option value="Commercial Structural">Commercial Structural</option>
                    <option value="Industrial Maintenance">Industrial Plant Maintenance</option>
                    <option value="Mechanical & Plumbing">Mechanical & Heavy HVAC</option>
                    <option value="Civil Infrastructure">Civil Infrastructure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                  Specific Tool Requirements / Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Need custom engraving for fleet management, 40x Impact Drivers and 20x Digital Torque Wrenches..."
                  className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 text-xs mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Requisition...' : 'Transmit Requisition for Volume Quote'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
