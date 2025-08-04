import React from 'react';

const ContactHero = () => {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/images/page-tittles/tittle4.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Contact Us
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
          Ready to move? Get in touch with Kenya's most trusted moving company for your free quote.
        </p>

        {/* Quick Contact Options */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <a
            href="tel:+254710437908"
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-medium">Call Now</span>
          </a>

          <a
            href="mailto:info@longonotmovers.co.ke"
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Email Us</span>
          </a>

          <a
            href="/cost-calculator"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Get Quote</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
