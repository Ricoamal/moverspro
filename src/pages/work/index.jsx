import React from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../landing-page/components/Footer';
import WorkHero from './components/WorkHero';
import ProjectGallery from './components/ProjectGallery';
import TestimonialsSection from './components/TestimonialsSection';
import CaseStudies from './components/CaseStudies';

const WorkPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Work - Longonot Movers</title>
        <meta name="description" content="See our completed moving projects, client testimonials, and case studies. Trusted by thousands of families and businesses across Kenya." />
      </Helmet>

      <div className="min-h-screen bg-white">
        

        {/* Main Content */}
        <main className="main-content-with-topbar">
          <WorkHero />
          <ProjectGallery />
          <TestimonialsSection />
          <CaseStudies />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WorkPage;
