import React from 'react';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSection = ({ isEditMode = false }) => {
  const { setSelectedBlock } = useWebsiteBuilder();
  const testimonials = [
    {
      id: 1,
      name: "Sarah Wanjiku",
      location: "Nairobi, Kenya",
      rating: 5,
      comment: "Exceptional service! The team was professional, punctual, and handled our fragile items with utmost care. Moving from Westlands to Karen was seamless.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      moveType: "Residential Move"
    },
    {
      id: 2,
      name: "David Kimani",
      location: "Mombasa, Kenya",
      rating: 5,
      comment: "Our office relocation was completed over the weekend with zero downtime. The IT equipment was handled professionally. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      moveType: "Commercial Move"
    },
    {
      id: 3,
      name: "Grace Muthoni",
      location: "Kisumu, Kenya",
      rating: 5,
      comment: "The packing service was incredible. They packed my entire 3-bedroom house in just 4 hours. Everything arrived safely at my new home.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      moveType: "Full Service Move"
    }
  ];

  const certifications = [
    {
      id: 1,
      name: "KRA Certified",
      description: "Kenya Revenue Authority Registered",
      icon: "Shield",
      color: "text-green-600 bg-green-100"
    },
    {
      id: 2,
      name: "M-Pesa Verified",
      description: "Secure Mobile Payments",
      icon: "Smartphone",
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: 3,
      name: "Insured & Bonded",
      description: "Full Coverage Protection",
      icon: "ShieldCheck",
      color: "text-purple-600 bg-purple-100"
    },
    {
      id: 4,
      name: "ISO Certified",
      description: "Quality Management Standards",
      icon: "Award",
      color: "text-orange-600 bg-orange-100"
    }
  ];

  const stats = [
    { label: "Happy Customers", value: "5,000+", icon: "Users" },
    { label: "Successful Moves", value: "8,500+", icon: "Truck" },
    { label: "Years Experience", value: "12+", icon: "Calendar" },
    { label: "Team Members", value: "50+", icon: "UserCheck" }
  ];

  const handleSectionClick = () => {
    if (isEditMode) {
      const trustBlock = {
        id: 'trust-section',
        type: 'testimonials',
        content: {
          title: 'Trusted by Thousands of Kenyans',
          description: 'Our commitment to excellence has earned us the trust of families and businesses across Kenya.',
          testimonials: testimonials,
          stats: stats
        }
      };
      setSelectedBlock(trustBlock);
    }
  };

  return (
    <section
      className={`py-16 lg:py-20 bg-gray-50 relative ${
        isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all' : ''
      }`}
      onClick={handleSectionClick}>
      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="absolute top-4 left-4 z-10 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          <Icon name="Edit" size={14} className="inline mr-1" />
          Trust Section
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Kenyans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our commitment to excellence has earned us the trust of families and businesses across Kenya.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center bg-white rounded-xl p-6 shadow-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name={stat.icon} size={24} className="text-primary" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            What Our Customers Say
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow"
              >
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.location}
                    </div>
                    <div className="text-xs text-primary font-medium">
                      {testimonial.moveType}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Licensed & Certified
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-center">
                <div className={`w-16 h-16 ${cert.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon name={cert.icon} size={28} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {cert.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={20} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Data Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={20} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Verified Business</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={20} className="text-orange-600" />
                <span className="text-sm font-medium text-gray-700">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;