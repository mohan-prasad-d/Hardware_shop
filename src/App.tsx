import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Hardware3DCanvas } from './components/3d/Hardware3DCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EngineeringSection } from './components/EngineeringSection';
import { PerformanceSection } from './components/PerformanceSection';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ContractorRFQModal } from './components/ContractorRFQModal';

const AppContent: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useCart();

  return (
    <div className="relative min-h-screen bg-[#090b0e] text-slate-100 overflow-x-hidden selection:bg-amber-500 selection:text-black">
      {/* 3D WebGL Background Canvas with Scroll Physics */}
      <Hardware3DCanvas />

      {/* Main UI Layer */}
      <Navbar />

      <main className="relative z-20">
        <HeroSection />
        <EngineeringSection />
        <PerformanceSection />
        <CatalogSection onSelectProduct={(prod) => setSelectedProduct(prod)} />
      </main>

      <Footer />

      {/* Interactive Modals and Drawers */}
      <CartDrawer />
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <OrderTrackingModal />
      <ContractorRFQModal />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
