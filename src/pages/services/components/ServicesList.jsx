import React from 'react';
import Icon from '../../../components/AppIcon';

const ServicesList = () => {
  const services = [
    {
      icon: 'Home',
      title: 'Residential Moving',
      description: 'Complete home relocation services with professional packing and careful handling of your precious belongings.',
      features: ['Professional packing & unpacking', 'Furniture disassembly/assembly', 'Fragile item protection', 'Storage solutions'],
      image: '/assets/images/services/Residential-Moving.png',
      price: 'From KSh 15,000'
    },
    {
      icon: 'Building',
      title: 'Commercial Moving',
      description: 'Office and business relocations with minimal downtime and maximum efficiency for your business operations.',
      features: ['IT equipment handling', 'Document management', 'Weekend/after-hours service', 'Minimal business disruption'],
      image: '/assets/images/services/Commercial-Moving.png',
      price: 'From KSh 25,000'
    },
    {
      icon: 'Package',
      title: 'Packing Services',
      description: 'Professional packing and unpacking services using high-quality materials to ensure item safety.',
      features: ['Quality packing materials', 'Labeling system', 'Unpacking services', 'Inventory management'],
      image: '/assets/images/services/Packing-Services.png',
      price: 'From KSh 5,000'
    },
    {
      icon: 'Truck',
      title: 'Long Distance Moving',
      description: 'Reliable long-distance moving services across Kenya with tracking and insurance coverage.',
      features: ['GPS tracking', 'Insurance coverage', 'Scheduled delivery', 'Cross-country expertise'],
      image: '/assets/images/services/long-distance.png',
      price: 'From KSh 30,000'
    },
    {
      icon: 'Shield',
      title: 'Storage Solutions',
      description: 'Secure storage facilities for short-term and long-term storage needs with 24/7 security.',
      features: ['Climate controlled', '24/7 security', 'Flexible terms', 'Easy access'],
      image: '/assets/images/services/storage.png',
      price: 'From KSh 2,000/month'
    },
    {
      icon: 'Clock',
      title: 'Insurance Coverage',
      description: 'Comprehensive insurance coverage for your belongings during the moving process for complete peace of mind.',
      features: ['Full coverage protection', 'Claims processing', 'Damage compensation', 'Peace of mind'],
      image: '/assets/images/services/insurance.png',
      price: 'From KSh 3,000'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Our Services</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Complete Moving Solutions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From residential moves to commercial relocations, we provide comprehensive moving services
            tailored to your specific needs across Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 w-12 h-12 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
                  <Icon name={service.icon} size={24} className="text-blue-600" />
                </div>
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {service.price}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <Icon name="Check" size={16} className="text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
