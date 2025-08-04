import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading time and check if DOM is ready
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade out animation to complete before hiding
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 2000); // Show preloader for 2 seconds minimum

    // Also check if document is ready
    const checkReady = () => {
      if (document.readyState === 'complete') {
        clearTimeout(timer);
        setFadeOut(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    if (document.readyState === 'complete') {
      checkReady();
    } else {
      window.addEventListener('load', checkReady);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', checkReady);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        visibility: fadeOut ? 'hidden' : 'visible',
        transition: 'opacity 500ms ease-in-out, visibility 500ms ease-in-out'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white" />
      
      {/* Preloader content */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Rotating circle animation */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Inner rotating ring (opposite direction) */}
          <div className="absolute top-2 left-2 w-28 h-28 border-4 border-transparent border-b-blue-400 rounded-full animate-spin-reverse"></div>
          
          {/* Logo in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img 
              src="/assets/images/logos/preloader.png" 
              alt="Longonot Movers" 
              className="w-16 h-16 object-contain animate-pulse"
            />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Longonot Movers</h3>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
