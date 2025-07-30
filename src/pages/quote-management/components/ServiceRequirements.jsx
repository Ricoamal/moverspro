import React from 'react';
import Icon from '../../../components/AppIcon';

const ServiceRequirements = ({ quote }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getRoomIcon = (roomType) => {
    const icons = {
      'bedroom': 'Bed',
      'living_room': 'Sofa',
      'kitchen': 'ChefHat',
      'bathroom': 'Bath',
      'office': 'Briefcase',
      'storage': 'Archive',
      'garage': 'Car',
      'other': 'Home'
    };
    return icons[roomType] || 'Home';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Icon name="Calendar" size={20} className="mr-2" />
        Service Requirements
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Details */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Service Date</label>
            <p className="text-sm text-gray-900 mt-1">{formatDate(quote.serviceDate)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Preferred Time</label>
            <p className="text-sm text-gray-900 mt-1">
              {quote.preferredTime ? formatTime(quote.preferredTime) : 'Flexible'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Service Type</label>
            <p className="text-sm text-gray-900 mt-1 capitalize">{quote.serviceType}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Property Type</label>
            <p className="text-sm text-gray-900 mt-1 capitalize">{quote.propertyType}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Floor Level</label>
            <p className="text-sm text-gray-900 mt-1">
              From: {quote.fromFloor} | To: {quote.toFloor}
            </p>
          </div>
        </div>

        {/* Room Inventory */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-3 block">Room Inventory</label>
          <div className="space-y-3">
            {quote.rooms.map((room, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Icon name={getRoomIcon(room.type)} size={16} className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {room.type.replace('_', ' ')}
                    </p>
                    {room.size && (
                      <p className="text-xs text-gray-500">Size: {room.size}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {room.quantity} {room.quantity === 1 ? 'room' : 'rooms'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Services */}
      {quote.additionalServices && quote.additionalServices.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="text-sm font-medium text-gray-500 mb-3 block">Additional Services</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quote.additionalServices.map((service, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Icon name="Plus" size={16} className="text-blue-600 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  {service.description && (
                    <p className="text-xs text-gray-600">{service.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Requirements */}
      {quote.specialRequirements && quote.specialRequirements.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="text-sm font-medium text-gray-500 mb-3 block">Special Requirements</label>
          <div className="space-y-2">
            {quote.specialRequirements.map((requirement, index) => (
              <div key={index} className="flex items-center p-2 bg-amber-50 rounded-lg">
                <Icon name="AlertCircle" size={16} className="text-amber-600 mr-2" />
                <p className="text-sm text-gray-900">{requirement}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequirements;