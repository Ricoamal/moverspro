import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdditionalServices = ({ onServicesSelect, currentStep, isActive }) => {
  const [selectedServices, setSelectedServices] = useState({});

  const services = [
    {
      id: 'packing',
      name: 'Professional Packing',
      icon: 'Package',
      price: 5000,
      description: 'Complete packing service with quality materials',
      features: ['Bubble wrap protection', 'Labeled boxes', 'Fragile item care']
    },
    {
      id: 'storage',
      name: 'Temporary Storage',
      icon: 'Warehouse',
      price: 3000,
      description: 'Secure storage facility for up to 30 days',
      features: ['Climate controlled', '24/7 security', 'Easy access']
    },
    {
      id: 'insurance',
      name: 'Moving Insurance',
      icon: 'Shield',
      price: 2000,
      description: 'Comprehensive coverage for your belongings',
      features: ['Full replacement value', 'Damage protection', 'Peace of mind']
    },
    {
      id: 'assembly',
      name: 'Furniture Assembly',
      icon: 'Wrench',
      price: 2500,
      description: 'Professional assembly and disassembly service',
      features: ['Expert technicians', 'All furniture types', 'Tool included']
    },
    {
      id: 'cleaning',
      name: 'Post-Move Cleaning',
      icon: 'Sparkles',
      price: 4000,
      description: 'Deep cleaning of your old residence',
      features: ['Professional cleaners', 'All rooms covered', 'Eco-friendly products']
    },
    {
      id: 'express',
      name: 'Express Delivery',
      icon: 'Zap',
      price: 3500,
      description: 'Priority moving with faster timeline',
      features: ['Same day service', 'Dedicated team', 'Priority scheduling']
    }
  ];

  const handleServiceToggle = (serviceId, checked) => {
    const updatedServices = {
      ...selectedServices,
      [serviceId]: checked
    };
    
    if (!checked) {
      delete updatedServices[serviceId];
    }
    
    setSelectedServices(updatedServices);
    onServicesSelect(updatedServices);
  };

  const getTotalPrice = () => {
    return Object.keys(selectedServices).reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const getSelectedCount = () => {
    return Object.keys(selectedServices).length;
  };

  if (!isActive) return null;

  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {currentStep}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Additional Services</h2>
        </div>
        {getSelectedCount() > 0 && (
          <div className="text-sm text-gray-600">
            {getSelectedCount()} service{getSelectedCount() !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-6">
        Enhance your moving experience with our professional add-on services
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {services.map((service) => {
          const isSelected = selectedServices[service.id];

          return (
            <div
              key={service.id}
              className={`border-2 rounded-xl p-5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-blue-50' :'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleServiceToggle(service.id, !isSelected)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon name={service.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm font-semibold text-primary">
                      KES {service.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <Checkbox
                  checked={isSelected || false}
                  onChange={(e) => handleServiceToggle(service.id, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <p className="text-sm text-gray-600 mb-3">{service.description}</p>

              <div className="space-y-1">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-500">
                    <Icon name="Check" size={12} className="text-green-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {getSelectedCount() > 0 && (
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="Plus" size={20} className="text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Additional Services ({getSelectedCount()})
              </span>
            </div>
            <span className="text-green-900 font-semibold text-lg">
              KES {getTotalPrice().toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalServices;