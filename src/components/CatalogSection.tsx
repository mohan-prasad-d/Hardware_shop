import React, { useState, useEffect } from 'react';
import { Search, Plus, Star, Check, SlidersHorizontal, Info, ShieldAlert } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { FALLBACK_PRODUCTS } from '../data/catalogFallback';

interface CatalogSectionProps {
  onSelectProduct: (p: Product) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({ onSelectProduct }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Equipment');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories = [
    'All Equipment',
    'Power Tools',
    'Precision Measurement',
    'Accessories',
    'Pneumatics'
  ];

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery, sortBy]);

  const filterFallbackList = () => {
    let list = [...FALLBACK_PRODUCTS];
    if (activeCategory !== 'All Equipment') {
      list = list.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'All Equipment') params.append('category', activeCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || filterFallbackList());
      } else {
        setProducts(filterFallbackList());
      }
    } catch {
      // Fallback for static environments like GitHub Pages
      setProducts(filterFallbackList());
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedNotice(product.id);
    setTimeout(() => {
      setAddedNotice((current) => (current === product.id ? null : current));
    }, 1500);
  };

  return (
    <section id="depot" className="relative z-20 max-w-7xl mx-auto px-6 py-28">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-800 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 tracking-wider">
            <span>02. SUPPLY DEPOT CATALOG</span>
            <span aria-hidden="true">·</span>
            <span>CONTRACTOR SPECIFICATION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Industrial Inventory
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Contractor-grade machinery, calibrated measurement gear, and impact accessories tested to DIN EN ISO standards.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools, torque, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121620] border border-slate-800 focus:border-amber-500 text-xs text-white pl-9 pr-4 py-2.5 rounded-lg w-full sm:w-64 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#121620] border border-slate-800 rounded-lg px-3 py-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-300 py-1.5 outline-none cursor-pointer"
            >
              <option value="rating" className="bg-[#121620]">Highest Rated</option>
              <option value="price-low" className="bg-[#121620]">Price: Low to High</option>
              <option value="price-high" className="bg-[#121620]">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs (Functional Segmented Control) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-[#121620] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 rounded-2xl bg-[#0e121a] border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-[#0e121a] border border-slate-800 rounded-2xl p-8">
          <p className="text-base text-slate-300 font-semibold mb-2">No matching hardware found.</p>
          <p className="text-xs text-slate-500 mb-4">Try clearing filters or search terms.</p>
          <button
            onClick={() => {
              setActiveCategory('All Equipment');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
          >
            Reset Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isAdded = addedNotice === product.id;
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group bg-[#0e121a]/90 border border-slate-800/90 hover:border-amber-500/60 transition-all duration-200 rounded-2xl p-5 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Clean unboxed metadata header */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                        In Stock ({product.inStock})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-500">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Product Image Slot with Fallback */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-950 border border-slate-800/70">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback container
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4">
                              <span class="text-xs font-mono uppercase font-bold text-amber-500 mb-1">FORGEPOINT SPEC</span>
                              <span class="text-xs text-center text-slate-400">${product.name}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2 line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Technical Specs Callout Box */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                    {product.torqueRating && product.torqueRating !== 'N/A' && (
                      <div className="bg-[#121620] border border-slate-800 p-2 rounded-lg">
                        <span className="text-slate-500 text-[10px] block">TORQUE RATING</span>
                        <span className="text-slate-200 font-bold">{product.torqueRating}</span>
                      </div>
                    )}
                    {product.rpm && (
                      <div className="bg-[#121620] border border-slate-800 p-2 rounded-lg">
                        <span className="text-slate-500 text-[10px] block">DRIVE SPEED</span>
                        <span className="text-slate-200 font-bold">{product.rpm}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Baseline & Quick Add CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">CONTRACTOR PRICE</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold font-mono text-white tabular-nums">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs font-mono text-slate-500 line-through tabular-nums">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="p-2.5 text-slate-400 hover:text-white bg-[#121620] hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Inspect Specifications"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
