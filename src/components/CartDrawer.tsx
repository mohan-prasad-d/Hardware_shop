import React, { useState } from 'react';
import { X, Trash2, ArrowRight, CheckCircle2, ShieldCheck, Truck, CreditCard, FileCheck, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Order } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    shipping,
    total,
    setLastConfirmedOrder,
    setIsTrackingOpen,
    setTrackingOrderId
  } = useCart();

  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Commercial Net 30 PO');

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const payload = {
        customerName,
        customerEmail,
        companyName,
        shippingAddress,
        city,
        postalCode,
        paymentMethod,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder(data.order);
        setLastConfirmedOrder(data.order);
        clearCart();
        setStep('confirmed');
      } else {
        setErrorMsg(data.error || 'Failed to submit order. Please check your details.');
      }
    } catch (err: any) {
      setErrorMsg('Network error connecting to logistics server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#0e121a] border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-amber-500 uppercase tracking-wider block">
              {step === 'cart' && '01 // PALLET ALLOCATION'}
              {step === 'checkout' && '02 // DISPATCH & PROCUREMENT'}
              {step === 'confirmed' && '03 // DISPATCH CONFIRMATION'}
            </span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {step === 'cart' && 'Equipment Order'}
              {step === 'checkout' && 'Job-Site Procurement'}
              {step === 'confirmed' && 'Order Allocated'}
            </h2>
          </div>

          <button
            onClick={() => {
              setIsCartOpen(false);
              setStep('cart');
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="py-20 text-center text-slate-500">
                  <p className="text-sm font-semibold mb-2">Your equipment pallet is empty.</p>
                  <p className="text-xs">Browse the catalog above to allocate contractor tools.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800 space-y-4">
                  {cart.map((item) => (
                    <div key={item.productId} className="pt-4 first:pt-0 flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-slate-400 block truncate">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate mb-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-400 font-bold text-xs">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-[#121620] border border-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-mono font-bold text-white text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    Contractor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Marcus Sterling"
                    className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    Company / Firm
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Apex Builders Ltd"
                    className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                  Corporate Email for Invoice *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="contractor@buildfirm.com"
                  className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                  Job-Site Shipping Address *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Pier 14 Industrial Yard, Bay 3"
                  className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Chicago, IL"
                    className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="60607"
                    className="w-full bg-[#121620] border border-slate-800 focus:border-amber-500 text-white p-2.5 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Payment Terms Selector */}
              <div>
                <label className="text-slate-400 block mb-1.5 font-mono uppercase text-[10px]">
                  Procurement Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Commercial Net 30 PO', label: 'Net 30 PO' },
                    { id: 'Credit Card', label: 'Corporate Card' },
                    { id: 'Cash On Delivery', label: 'COD / Job-Site' }
                  ].map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                        paymentMethod === method.id
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                          : 'border-slate-800 bg-[#121620] text-slate-400 hover:text-white'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-black text-white">Order Confirmed</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Your hardware requisition has been verified and registered in the dispatch queue.
              </p>

              <div className="bg-[#121620] border border-slate-800 rounded-xl p-4 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Reference:</span>
                  <span className="text-amber-400 font-bold">{confirmedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tracking Code:</span>
                  <span className="text-slate-200">{confirmedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Billed:</span>
                  <span className="text-white font-bold">${confirmedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Terms:</span>
                  <span className="text-slate-300">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Delivery:</span>
                  <span className="text-emerald-400 font-semibold">Within 48 Hours</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setTrackingOrderId(confirmedOrder.id);
                    setIsCartOpen(false);
                    setIsTrackingOpen(true);
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Track Order in Logistics Registry
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setStep('cart');
                  }}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Return to Store
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions and Totals */}
        {step !== 'confirmed' && cart.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-[#0c0f15]">
            <div className="space-y-1.5 text-xs font-mono mb-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Commercial Tax (8%)</span>
                <span className="text-white tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Freight Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {shipping === 0 ? 'FREE (Over $150)' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Requisition</span>
                <span className="text-amber-400 font-mono tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>Proceed to Job-Site Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-800 transition-colors cursor-pointer text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 text-xs"
                >
                  <span>{loading ? 'Transmitting Order...' : 'Confirm Job Requisition'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
