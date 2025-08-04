import React from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../landing-page/components/Footer';
import ServicesHero from './components/ServicesHero';
import ServicesList from './components/ServicesList';
import PricingSection from './components/PricingSection';
import Header from '../../components/ui/Header';

const ServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Services - Longonot Movers</title>
        <meta name="description" content="Professional moving services in Kenya - residential, commercial, office relocations, packing, storage and more. Get your free quote today." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />

        {/* Main Content */}
        <main className="main-content-with-topbar">
          <ServicesHero />
          <ServicesList />
          <PricingSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ServicesPage;
