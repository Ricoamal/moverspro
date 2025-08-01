import React from 'react';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ServicesSection = ({ isEditMode = false }) => {
  const { setSelectedBlock } = useWebsiteBuilder();
  const services = [
    {
      id: 1,
      icon: "Home",
      title: "Residential Moving",
      description: "Complete home relocation services with professional packing, loading, and unpacking. Perfect for apartments, houses, and condos.",
      features: ["Professional Packing", "Furniture Assembly", "Fragile Item Care"],
      image: "/assets/images/services/Residential-Moving.png"
    },
    {
      id: 2,
      icon: "Building2",
      title: "Commercial Moving",
      description: "Minimize business downtime with our efficient office and commercial moving solutions. We handle everything from desks to servers.",
      features: ["Minimal Downtime", "IT Equipment Care", "Weekend Service"],
      image: "/assets/images/services/Commercial-Moving.png"
    },
    {
      id: 3,
      icon: "Package",
      title: "Packing Services",
      description: "Professional packing with high-quality materials. We pack everything from delicate items to bulky furniture with care.",
      features: ["Quality Materials", "Expert Techniques", "Item Protection"],
      image: "/assets/images/services/Packing-Services.png"
    },
    {
      id: 4,
      icon: "Warehouse",
      title: "Storage Solutions",
      description: "Secure, climate-controlled storage facilities for short-term and long-term needs. Access your items anytime.",
      features: ["Climate Controlled", "24/7 Security", "Flexible Terms"],
      image: "/assets/images/services/storage.png"
    },
    {
      id: 5,
      icon: "Shield",
      title: "Insurance Coverage",
      description: "Comprehensive protection for your belongings during the move. Multiple coverage options available.",
      features: ["Full Coverage", "Quick Claims", "Peace of Mind"],
      image: "/assets/images/services/insurance.png"
    },
    {
      id: 6,
      icon: "MapPin",
      title: "Long Distance",
      description: "Reliable long-distance moving services across Kenya. Real-time tracking and regular updates throughout your move.",
      features: ["GPS Tracking", "Regular Updates", "Nationwide Coverage"],
      image: "/assets/images/services/long-distance.png"
    }
  ];

  const handleSectionClick = () => {
    if (isEditMode) {
      const servicesBlock = {
        id: 'services-section',
        type: 'services_grid',
        content: {
          title: 'Our Moving Services',
          description: 'From residential moves to commercial relocations, we provide comprehensive moving solutions tailored to your specific needs.',
          services: services
        }
      };
      setSelectedBlock(servicesBlock);
    }
  };

  return (
    <section
      id="services-section"
      className={`py-16 lg:py-20 bg-white relative ${
        isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all' : ''
      }`}
      onClick={handleSectionClick}>
      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="absolute top-4 left-4 z-10 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          <Icon name="Edit" size={14} className="inline mr-1" />
          Services Section
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Moving Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From residential moves to commercial relocations, we provide comprehensive moving solutions tailored to your specific needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/20"
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Icon Overlay */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Icon name={service.icon} size={24} className="text-primary" />
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Icon name="Check" size={16} className="text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button className="flex items-center text-primary font-medium hover:text-primary/80 transition-colors group">
                    Learn More
                    <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need a Custom Moving Solution?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Every move is unique. Contact us for a personalized quote and moving plan that fits your specific requirements and budget.
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center">
              Get Custom Quote
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;