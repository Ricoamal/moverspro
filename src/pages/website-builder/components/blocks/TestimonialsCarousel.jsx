import React, { useState, useEffect } from 'react';
import Icon from '../../../../components/AppIcon';

const TestimonialsCarousel = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    title = 'What Our Customers Say',
    subtitle = 'Real experiences from satisfied customers',
    testimonials = [
      {
        name: 'Sarah Wanjiku',
        role: 'Homeowner',
        location: 'Nairobi',
        image: '',
        rating: 5,
        text: 'MoveEase Pro made our family relocation so smooth! Their team was professional, careful with our belongings, and completed the move ahead of schedule. Highly recommended!',
        moveType: 'Residential Move'
      },
      {
        name: 'David Kimani',
        role: 'Business Owner',
        location: 'Mombasa',
        image: '',
        rating: 5,
        text: 'We needed to relocate our office quickly, and MoveEase Pro delivered perfectly. They handled our IT equipment with care and had us operational in our new location within 2 days.',
        moveType: 'Office Relocation'
      },
      {
        name: 'Grace Achieng',
        role: 'Apartment Renter',
        location: 'Kisumu',
        image: '',
        rating: 5,
        text: 'Affordable, reliable, and professional. The team arrived on time, packed everything carefully, and delivered without any damage. Best moving experience I\'ve ever had!',
        moveType: 'Residential Move'
      },
      {
        name: 'Michael Ochieng',
        role: 'Store Manager',
        location: 'Nakuru',
        image: '',
        rating: 5,
        text: 'MoveEase Pro helped us relocate our retail store with minimal downtime. Their storage solution was perfect for our transition period. Excellent service!',
        moveType: 'Commercial Move'
      }
    ],
    autoPlay = true,
    autoPlayInterval = 5000,
    showDots = true,
    showArrows = true
  } = content;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (autoPlay && !isEditing && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, testimonials.length, isEditing]);

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

  const handleTestimonialChange = (index, field, value) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    handleContentChange('testimonials', updatedTestimonials);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const currentTestimonial = testimonials[currentSlide] || testimonials[0];

  return (
    <section className="py-16 lg:py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {subtitle && (
            <p
              className={`text-lg text-blue-600 mb-4 font-medium ${
                isEditing ? 'cursor-text' : ''
              }`}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleContentChange('subtitle', e.target.textContent)}
            >
              {subtitle}
            </p>
          )}
          
          <h2
            className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-6 ${
              isEditing ? 'cursor-text' : ''
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleContentChange('title', e.target.textContent)}
          >
            {title}
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 text-center">
            {/* Quote Icon */}
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Icon name="Quote" size={32} />
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              {renderStars(currentTestimonial.rating)}
            </div>

            {/* Testimonial Text */}
            <blockquote
              className={`text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8 ${
                isEditing ? 'cursor-text' : ''
              }`}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTestimonialChange(currentSlide, 'text', e.target.textContent)}
            >
              "{currentTestimonial.text}"
            </blockquote>

            {/* Customer Info */}
            <div className="flex items-center justify-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {currentTestimonial.image ? (
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={24} className="text-gray-400" />
                )}
              </div>

              {/* Customer Details */}
              <div className="text-left">
                <h4
                  className={`font-semibold text-gray-900 ${
                    isEditing ? 'cursor-text' : ''
                  }`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTestimonialChange(currentSlide, 'name', e.target.textContent)}
                >
                  {currentTestimonial.name}
                </h4>
                <p className="text-gray-600 text-sm">
                  <span
                    className={isEditing ? 'cursor-text' : ''}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTestimonialChange(currentSlide, 'role', e.target.textContent)}
                  >
                    {currentTestimonial.role}
                  </span>
                  {' • '}
                  <span
                    className={isEditing ? 'cursor-text' : ''}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTestimonialChange(currentSlide, 'location', e.target.textContent)}
                  >
                    {currentTestimonial.location}
                  </span>
                </p>
                <p className="text-blue-600 text-xs font-medium mt-1">
                  <span
                    className={isEditing ? 'cursor-text' : ''}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTestimonialChange(currentSlide, 'moveType', e.target.textContent)}
                  >
                    {currentTestimonial.moveType}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {showArrows && testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {showDots && testimonials.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Customer Logos/Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">Trusted by hundreds of customers across Kenya</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">500+</div>
            <div className="text-sm text-gray-500">Happy<br/>Customers</div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-2xl font-bold text-gray-400">99%</div>
            <div className="text-sm text-gray-500">Satisfaction<br/>Rate</div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-2xl font-bold text-gray-400">10+</div>
            <div className="text-sm text-gray-500">Years<br/>Experience</div>
          </div>
        </div>
      </div>

      {/* Editing Overlay */}
      {isSelected && isEditing && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
          <div className="text-sm font-medium text-gray-900 mb-2">Testimonials Carousel</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div>• Click text to edit testimonials</div>
            <div>• Use arrows to navigate slides</div>
            <div>• Edit customer details</div>
            <div>• Configure auto-play in properties</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsCarousel;
