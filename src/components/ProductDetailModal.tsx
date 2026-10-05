import React, { useState } from 'react';
import { X, Star, ShieldCheck, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0e121a] border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image and Warranty */}
          <div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-4">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3.5 bg-[#121620] border border-slate-800 rounded-xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">Commercial Guarantee</span>
                <span className="text-slate-400">{product.warranty}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Order Action */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>PART #{product.id.toUpperCase()}</span>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">{product.name}</h2>

              <div className="flex items-center gap-2 mb-4 text-xs font-mono">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold">{product.rating}</span>
                </div>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{product.reviewsCount} contractor verified reviews</span>
                <span className="text-slate-500">·</span>
                <span className="text-emerald-400 font-semibold">{product.inStock} in stock</span>
              </div>

              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Technical Spec List */}
              <div className="space-y-1.5 border-t border-b border-slate-800 py-4 mb-6 text-xs font-mono">
                {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-1">
                    <span className="text-slate-400">{key}:</span>
                    <span className="text-white font-medium text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Quantity & Add to Cart */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Unit Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm font-mono text-slate-500 line-through tabular-nums">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-2 bg-[#121620] border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-white text-xs">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  added
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Allocated to Equipment Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add {quantity > 1 ? `(${quantity}) Items` : 'to Order'} · ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
