import React, { useState, useEffect } from 'react';
import { X, Search, Package, CheckCircle2, Truck, Clock, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Order } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { isTrackingOpen, setIsTrackingOpen, trackingOrderId, setTrackingOrderId } = useCart();
  const [query, setQuery] = useState(trackingOrderId || 'FP-9824-X');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isTrackingOpen && query) {
      handleLookup(query);
    }
  }, [isTrackingOpen]);

  const handleLookup = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(data.error || 'Order reference not found.');
      }
    } catch {
      setError('Logistics registry service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  if (!isTrackingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0e121a] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
          <span>CENTRAL LOGISTICS REGISTRY</span>
          <span aria-hidden="true">·</span>
          <span>DISPATCH TRACKING</span>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Order Status Tracker
        </h2>

        {/* Search input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup(query);
          }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. FP-9824-X"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white font-mono text-xs pl-9 pr-4 py-2.5 rounded-xl outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block">ORDER REFERENCE</span>
                  <span className="text-amber-400 font-bold text-sm">{order.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">CARRIER WAYBILL</span>
                  <span className="text-slate-200">{order.trackingNumber}</span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto font-bold">
                    ✓
                  </div>
                  <span className="text-slate-300 font-bold block">Received</span>
                  <span className="text-slate-500 block">04 Oct</span>
                </div>

                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto font-bold">
                    ✓
                  </div>
                  <span className="text-slate-300 font-bold block">Depot Pick</span>
                  <span className="text-slate-500 block">04 Oct</span>
                </div>

                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto font-bold animate-pulse">
                    3
                  </div>
                  <span className="text-amber-400 font-bold block">In Transit</span>
                  <span className="text-slate-400 block">Regional Hub</span>
                </div>

                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    4
                  </div>
                  <span className="text-slate-500 block">Site Delivery</span>
                  <span className="text-slate-600 block">Expected 48h</span>
                </div>
              </div>
            </div>

            {/* Logistics Particulars */}
            <div className="space-y-2 text-xs font-mono bg-[#121620]/60 border border-slate-800/80 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient:</span>
                <span className="text-white font-medium">{order.customerName}</span>
              </div>
              {order.companyName && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Firm / Contractor:</span>
                  <span className="text-slate-200">{order.companyName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Destination Yard:</span>
                <span className="text-slate-200">{order.shippingAddress}, {order.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Billed:</span>
                <span className="text-amber-400 font-bold tabular-nums">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Line Items List */}
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-2">ALLOCATED ITEMS ({order.items.length})</span>
              <div className="divide-y divide-slate-800 border-t border-b border-slate-800 max-h-36 overflow-y-auto">
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center text-xs">
                    <span className="text-slate-300 truncate max-w-[280px]">{it.name}</span>
                    <span className="font-mono text-slate-400">Qty: {it.quantity} × ${it.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
