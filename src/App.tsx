import React from 'react';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import FeaturesSection from './components/FeaturesSection';
import SolaceSection from './components/SolaceSection';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      {/* SECTION 1: HERO */}
      <HeroSection />

      {/* SECTION 2: KEY BENEFITS */}
      <BenefitsSection />

      {/* SECTION 3: GLOWING FEATURE CARDS (V2, V3, V4) */}
      <FeaturesSection />

      {/* SECTION 4: FAQ & FOUNDER CONTACT */}
      <SolaceSection />
    </div>
  );
};

export default App;
