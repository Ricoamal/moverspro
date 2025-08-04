import React from 'react';

const ServicesHero = () => {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/images/page-tittles/tittle2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Our Services
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
          Professional moving services tailored to your needs - residential, commercial, and specialized relocations.
        </p>
      </div>
    </section>
  );
};

export default ServicesHero;
