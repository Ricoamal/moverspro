import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerInformation = ({ quote }) => {
  const formatPhoneNumber = (phone) => {
    // Format Kenyan phone number
    if (phone.startsWith('+254')) {
      return phone.replace('+254', '0');
    }
    return phone;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Icon name="User" size={20} className="mr-2" />
        Customer Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-sm text-gray-900 mt-1">{quote.customerName}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Email Address</label>
            <p className="text-sm text-gray-900 mt-1">{quote.customerEmail}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Phone Number</label>
            <p className="text-sm text-gray-900 mt-1">{formatPhoneNumber(quote.customerPhone)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Alternative Contact</label>
            <p className="text-sm text-gray-900 mt-1">
              {quote.alternativeContact || 'Not provided'}
            </p>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">From Location</label>
            <div className="mt-1">
              <p className="text-sm text-gray-900">{quote.fromLocation}</p>
              <p className="text-xs text-gray-500 mt-1">{quote.fromAddress}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">To Location</label>
            <div className="mt-1">
              <p className="text-sm text-gray-900">{quote.toLocation}</p>
              <p className="text-xs text-gray-500 mt-1">{quote.toAddress}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Distance</label>
            <p className="text-sm text-gray-900 mt-1">{quote.distance} km</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Access Difficulty</label>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                quote.accessDifficulty === 'easy' ?'bg-green-100 text-green-800'
                  : quote.accessDifficulty === 'medium' ?'bg-yellow-100 text-yellow-800' :'bg-red-100 text-red-800'
              }`}>
                {quote.accessDifficulty.charAt(0).toUpperCase() + quote.accessDifficulty.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      {quote.specialInstructions && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="text-sm font-medium text-gray-500">Special Instructions</label>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {quote.specialInstructions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerInformation;