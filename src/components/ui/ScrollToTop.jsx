import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Show button when page is scrolled down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    setIsScrolling(true);
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  return (
    <div
      className={`fixed right-4 bottom-32 md:right-6 md:bottom-36 z-30 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className={`group relative w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isScrolling ? 'animate-bounce' : 'hover:scale-110'
        }`}
        aria-label="Scroll to top"
      >
        {/* Background pulse effect */}
        <div className="absolute inset-0 rounded-full bg-blue-600 group-hover:animate-ping opacity-20"></div>
        
        {/* Arrow Icon */}
        <svg 
          className={`w-6 h-6 text-white relative z-10 transition-transform duration-300 ${
            isScrolling ? 'animate-pulse' : 'group-hover:-translate-y-1'
          }`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
      </button>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Back to top
        {/* Arrow */}
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
      </div>

      {/* Mobile optimization */}
      <style jsx>{`
        @media (max-width: 768px) {
          .fixed {
            right: 1rem;
            bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollToTop;
