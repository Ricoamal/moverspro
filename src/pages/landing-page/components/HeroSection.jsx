import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { setSelectedBlock } = useWebsiteBuilder();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides data
  const slides = [
    {
      id: 1,
      title: 'Professional Moving Services',
      subtitle: 'Made Simple',
      description: 'Get instant quotes, track your move, and enjoy stress-free relocation with Kenya\'s most trusted moving company.',
      backgroundImage: '/assets/images/hero/longonot-slider-1.jpg',
      buttons: [
        { text: 'Get Free Quote', action: () => navigate('/cost-calculator'), style: 'primary' },
        { text: 'Learn More', action: () => handleLearnMore(), style: 'secondary' }
      ]
    },
    {
      id: 2,
      title: 'Residential Moving Experts',
      subtitle: 'Home Relocation Services',
      description: 'Professional home moving services across Kenya. We handle everything from packing to unpacking with care.',
      backgroundImage: '/assets/images/hero/longonot-slider-2.png',
      buttons: [
        { text: 'Get Home Quote', action: () => navigate('/cost-calculator?type=residential'), style: 'primary' },
        { text: 'View Services', action: () => navigate('/services'), style: 'secondary' }
      ]
    },
    {
      id: 3,
      title: 'Office Relocation Specialists',
      subtitle: 'Business Moving Services',
      description: 'Minimize downtime with our efficient office moving services. We understand your business needs.',
      backgroundImage: '/assets/images/hero/longonot-slider-3.png',
      buttons: [
        { text: 'Get Office Quote', action: () => navigate('/cost-calculator?type=office'), style: 'primary' },
        { text: 'Our Work', action: () => navigate('/work'), style: 'secondary' }
      ]
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isEditMode) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isEditMode, slides.length]);

  const handleCalculateCost = () => {
    navigate('/cost-calculator');
  };

  const handleLearnMore = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleSectionClick = () => {
    if (isEditMode) {
      const heroBlock = {
        id: 'hero-section',
        type: 'hero_carousel',
        content: {
          slides: slides,
          currentSlide: currentSlide
        }
      };
      setSelectedBlock(heroBlock);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all' : ''
      }`}
      onClick={handleSectionClick}>
      
      {/* Background Image with Smooth Transitions - Full Width */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: currentSlideData.backgroundImage
            ? `url(${currentSlideData.backgroundImage})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      />

      {/* Blue Background - Right Half Only (where text is) - Full width on mobile */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 opacity-95" />

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 bg-black bg-opacity-20" />

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="absolute top-4 left-4 z-30 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          <Icon name="Edit" size={14} className="inline mr-1" />
          Hero Carousel
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Column - Empty for background image visibility */}
          <div className="hidden lg:block"></div>
          
          {/* Right Column - Content */}
          <div className="text-center lg:text-left relative z-10 px-6 lg:px-8">
            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-blue-100 font-medium mb-4 opacity-90 transition-all duration-500">
              {currentSlideData.subtitle}
            </p>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight transition-all duration-500 drop-shadow-lg">
              {currentSlideData.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-100 mb-8 leading-relaxed transition-all duration-500 drop-shadow-sm">
              {currentSlideData.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              {currentSlideData.buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.style === 'primary' ? 'default' : 'outline'}
                  size="lg"
                  onClick={button.action}
                  className={`transition-all duration-300 ${
                    button.style === 'primary'
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                  }`}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all z-20 backdrop-blur-sm"
          >
            <Icon name="ChevronLeft" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all z-20 backdrop-blur-sm"
          >
            <Icon name="ChevronRight" size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-20 backdrop-blur-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  );
};

export default HeroSection;
