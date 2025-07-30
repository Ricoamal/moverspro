import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const ServicesGrid = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    title = 'Our Moving Services',
    subtitle = 'Comprehensive moving solutions for every need',
    services = [
      {
        icon: 'Home',
        title: 'Residential Moving',
        description: 'Professional home relocation services with careful handling of your personal belongings.',
        features: ['Packing & Unpacking', 'Furniture Assembly', 'Fragile Item Care'],
        price: 'From KSh 15,000',
        popular: false
      },
      {
        icon: 'Building',
        title: 'Office Relocation',
        description: 'Efficient business moving services to minimize downtime and keep your operations running.',
        features: ['IT Equipment Moving', 'Document Handling', 'Weekend Service'],
        price: 'From KSh 25,000',
        popular: true
      },
      {
        icon: 'Warehouse',
        title: 'Storage Solutions',
        description: 'Secure storage facilities for short-term and long-term storage needs.',
        features: ['Climate Controlled', '24/7 Security', 'Easy Access'],
        price: 'From KSh 5,000/month',
        popular: false
      },
      {
        icon: 'Package',
        title: 'Packing Services',
        description: 'Professional packing services using high-quality materials and techniques.',
        features: ['Quality Materials', 'Expert Packing', 'Inventory List'],
        price: 'From KSh 8,000',
        popular: false
      },
      {
        icon: 'Truck',
        title: 'Long Distance Moving',
        description: 'Reliable long-distance moving services across Kenya and neighboring countries.',
        features: ['GPS Tracking', 'Insurance Coverage', 'Scheduled Delivery'],
        price: 'Custom Quote',
        popular: false
      },
      {
        icon: 'Shield',
        title: 'Specialty Moving',
        description: 'Specialized moving for pianos, artwork, antiques, and other valuable items.',
        features: ['Custom Crating', 'Expert Handling', 'Full Insurance'],
        price: 'Custom Quote',
        popular: false
      }
    ]
  } = content;

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

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    handleContentChange('services', updatedServices);
  };

  const addService = () => {
    const newService = {
      icon: 'Package',
      title: 'New Service',
      description: 'Service description',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      price: 'From KSh 10,000',
      popular: false
    };
    handleContentChange('services', [...services, newService]);
  };

  const removeService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    handleContentChange('services', updatedServices);
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                service.popular ? 'ring-2 ring-blue-500' : ''
              } ${isEditing ? 'border-2 border-dashed border-gray-300' : ''}`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              )}

              {/* Delete Button (Editing Mode) */}
              {isEditing && services.length > 1 && (
                <button
                  onClick={() => removeService(index)}
                  className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Icon name="X" size={12} />
                </button>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mb-6">
                  <Icon name={service.icon} size={32} />
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-semibold text-gray-900 mb-4 ${
                    isEditing ? 'cursor-text' : ''
                  }`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleServiceChange(index, 'title', e.target.textContent)}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-gray-600 mb-6 leading-relaxed ${
                    isEditing ? 'cursor-text' : ''
                  }`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleServiceChange(index, 'description', e.target.textContent)}
                >
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <Icon name="Check" size={16} className="text-green-500 mr-2 flex-shrink-0" />
                      <span
                        className={isEditing ? 'cursor-text' : ''}
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                          const updatedFeatures = [...service.features];
                          updatedFeatures[featureIndex] = e.target.textContent;
                          handleServiceChange(index, 'features', updatedFeatures);
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`text-2xl font-bold text-blue-600 ${
                      isEditing ? 'cursor-text' : ''
                    }`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleServiceChange(index, 'price', e.target.textContent)}
                  >
                    {service.price}
                  </span>
                </div>

                {/* CTA Button */}
                <Button
                  variant={service.popular ? 'default' : 'outline'}
                  className="w-full"
                  disabled={isEditing}
                >
                  Get Quote
                </Button>
              </div>

              {/* Service Settings (Editing Mode) */}
              {isEditing && (
                <div className="absolute bottom-2 right-2 bg-white rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={service.popular}
                        onChange={(e) => handleServiceChange(index, 'popular', e.target.checked)}
                        className="mr-1"
                      />
                      Popular
                    </label>
                    <select
                      value={service.icon}
                      onChange={(e) => handleServiceChange(index, 'icon', e.target.value)}
                      className="text-xs border rounded px-1"
                    >
                      <option value="Home">Home</option>
                      <option value="Building">Building</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Package">Package</option>
                      <option value="Truck">Truck</option>
                      <option value="Shield">Shield</option>
                      <option value="Clock">Clock</option>
                      <option value="MapPin">MapPin</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Service Button (Editing Mode) */}
          {isEditing && (
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white">
              <button
                onClick={addService}
                className="flex flex-col items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon name="Plus" size={32} />
                </div>
                <span className="text-sm font-medium">Add Service</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Need a custom moving solution? We're here to help!
          </p>
          <Button size="lg">
            <Icon name="Phone" size={16} className="mr-2" />
            Contact Us for Custom Quote
          </Button>
        </div>
      </div>

      {/* Editing Overlay */}
      {isSelected && isEditing && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
          <div className="text-sm font-medium text-gray-900 mb-2">Services Grid Settings</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div>• Click text to edit content</div>
            <div>• Edit service features and pricing</div>
            <div>• Mark services as popular</div>
            <div>• Add/remove services</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesGrid;
