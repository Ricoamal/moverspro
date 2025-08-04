import React from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import TrustSection from './components/TrustSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

const LandingPage = () => {

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
            <HeroSection />
            <ServicesSection />
            <TrustSection />
            <ContactSection />
      </main>
      
      <Footer />
      </div>
  );
};

export default LandingPage;