import React from 'react';
import { Helmet } from 'react-helmet';

import Header from '../../components/ui/Header';
import Footer from '../landing-page/components/Footer';
import AboutHero from './components/AboutHero';
import CompanyStory from './components/CompanyStory';
import TeamSection from './components/TeamSection';
import MissionVision from './components/MissionVision';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Longonot Movers</title>
        <meta name="description" content="Learn about Longonot Movers - Kenya's trusted moving company with over 10 years of experience in residential and commercial relocations." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />

        {/* Main Content */}
        <main className="main-content-with-topbar">
          <AboutHero />
          <CompanyStory />
          <MissionVision />
          <TeamSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
