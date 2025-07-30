import React, { useState, useEffect } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const HeroCarousel = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    slides = [
      {
        title: 'Residential Moving Experts',
        subtitle: 'Home Relocation Services',
        description: 'Professional home moving services across Kenya. We handle everything from packing to unpacking.',
        backgroundImage: '',
        buttons: [
          { text: 'Get Home Moving Quote', link: '/quote?type=residential', style: 'primary' }
        ]
      },
      {
        title: 'Office Relocation Specialists',
        subtitle: 'Business Moving Services',
        description: 'Minimize downtime with our efficient office moving services. We understand business needs.',
        backgroundImage: '',
        buttons: [
          { text: 'Get Office Moving Quote', link: '/quote?type=office', style: 'primary' }
        ]
      },
      {
        title: 'Secure Storage Solutions',
        subtitle: 'Storage & Warehousing',
        description: 'Safe and secure storage facilities for your belongings during transition periods.',
        backgroundImage: '',
        buttons: [
          { text: 'View Storage Options', link: '/storage', style: 'primary' }
        ]
      }
    ],
    autoPlay = true,
    autoPlayInterval = 5000,
    showDots = true,
    showArrows = true,
    overlay = {
      enabled: true,
      color: '#000000',
      opacity: 0.4
    }
  } = content;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (autoPlay && !isEditing) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, slides.length, isEditing]);

  const handleContentChange = (field, value) => {
    if (onUpdate) {
      onUpdate(block.id, {
        content: {
          ...content,
          [field]: value
        }
      });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide] || slides[0];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: currentSlideData.backgroundImage 
            ? `url(${currentSlideData.backgroundImage})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      />

      {/* Overlay */}
      {overlay.enabled && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundColor: overlay.color,
            opacity: overlay.opacity
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Subtitle */}
          {currentSlideData.subtitle && (
            <p
              className={`text-lg sm:text-xl text-blue-200 mb-4 transition-all duration-500 ${
                isEditing ? 'cursor-text' : ''
              }`}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const updatedSlides = [...slides];
                updatedSlides[currentSlide] = { 
                  ...updatedSlides[currentSlide], 
                  subtitle: e.target.textContent 
                };
                handleContentChange('slides', updatedSlides);
              }}
            >
              {currentSlideData.subtitle}
            </p>
          )}

          {/* Title */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight transition-all duration-500 ${
              isEditing ? 'cursor-text' : ''
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              const updatedSlides = [...slides];
              updatedSlides[currentSlide] = { 
                ...updatedSlides[currentSlide], 
                title: e.target.textContent 
              };
              handleContentChange('slides', updatedSlides);
            }}
          >
            {currentSlideData.title}
          </h1>

          {/* Description */}
          {currentSlideData.description && (
            <p
              className={`text-xl text-gray-200 mb-8 max-w-2xl mx-auto transition-all duration-500 ${
                isEditing ? 'cursor-text' : ''
              }`}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const updatedSlides = [...slides];
                updatedSlides[currentSlide] = { 
                  ...updatedSlides[currentSlide], 
                  description: e.target.textContent 
                };
                handleContentChange('slides', updatedSlides);
              }}
            >
              {currentSlideData.description}
            </p>
          )}

          {/* Buttons */}
          {currentSlideData.buttons && currentSlideData.buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentSlideData.buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.style === 'primary' ? 'default' : 'outline'}
                  size="lg"
                  className={`${
                    button.style === 'primary'
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'border-white text-white hover:bg-white hover:text-blue-600'
                  } transition-all duration-500 ${isEditing ? 'cursor-text' : ''}`}
                >
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const updatedSlides = [...slides];
                      const updatedButtons = [...updatedSlides[currentSlide].buttons];
                      updatedButtons[index] = { ...button, text: e.target.textContent };
                      updatedSlides[currentSlide] = { 
                        ...updatedSlides[currentSlide], 
                        buttons: updatedButtons 
                      };
                      handleContentChange('slides', updatedSlides);
                    }}
                  >
                    {button.text}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all z-20"
          >
            <Icon name="ChevronLeft" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all z-20"
          >
            <Icon name="ChevronRight" size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-20">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Editing Overlay */}
      {isSelected && isEditing && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-20">
          <div className="text-sm font-medium text-gray-900 mb-2">Hero Carousel Settings</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div>• Click text to edit current slide</div>
            <div>• Use arrows to navigate slides</div>
            <div>• Configure slides in properties</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
