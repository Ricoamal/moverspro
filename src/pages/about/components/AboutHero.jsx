import React from 'react';
import Icon from '../../../components/AppIcon';

const AboutHero = () => {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/images/page-tittles/tittle1.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          About Longonot Movers
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
          Kenya's trusted moving company with over 10 years of experience in residential and commercial relocations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm md:text-base">
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
            <Icon name="Calendar" size={20} />
            <span className="font-medium">Est. 2014</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
            <Icon name="Users" size={20} />
            <span className="font-medium">5000+ Happy Customers</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
            <Icon name="Award" size={20} />
            <span className="font-medium">Industry Leader</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
