import React from 'react';
import { Helmet } from 'react-helmet';

import Header from '../../components/ui/Header';
import Footer from '../landing-page/components/Footer';
import ContactHero from './components/ContactHero';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import LocationMap from './components/LocationMap';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - Longonot Movers</title>
        <meta name="description" content="Get in touch with Longonot Movers for your moving needs. Call us, email us, or visit our offices in Nairobi. Free quotes available." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />

        {/* Main Content */}
        <main className="main-content-with-topbar">
          <ContactHero />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <ContactForm />
            <ContactInfo />
          </div>
          <LocationMap />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
