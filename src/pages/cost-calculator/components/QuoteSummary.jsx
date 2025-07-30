import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuoteSummary = ({ 
  locations, 
  rooms, 
  services, 
  currentStep, 
  isActive,
  onQuoteGenerated 
}) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [quoteGenerated, setQuoteGenerated] = useState(false);

  const roomTypes = [
    { id: 'bedroom', name: 'Bedrooms', basePrice: 2500 },
    { id: 'living_room', name: 'Living Room', basePrice: 3000 },
    { id: 'kitchen', name: 'Kitchen', basePrice: 2000 },
    { id: 'bathroom', name: 'Bathrooms', basePrice: 1000 },
    { id: 'dining_room', name: 'Dining Room', basePrice: 1500 },
    { id: 'office', name: 'Home Office', basePrice: 2000 }
  ];

  const additionalServices = [
    { id: 'packing', name: 'Professional Packing', price: 5000 },
    { id: 'storage', name: 'Temporary Storage', price: 3000 },
    { id: 'insurance', name: 'Moving Insurance', price: 2000 },
    { id: 'assembly', name: 'Furniture Assembly', price: 2500 },
    { id: 'cleaning', name: 'Post-Move Cleaning', price: 4000 },
    { id: 'express', name: 'Express Delivery', price: 3500 }
  ];

  const calculateRoomTotal = () => {
    return Object.entries(rooms || {}).reduce((total, [roomId, count]) => {
      const room = roomTypes.find(r => r.id === roomId);
      return total + (room ? room.basePrice * count : 0);
    }, 0);
  };

  const calculateServicesTotal = () => {
    return Object.keys(services || {}).reduce((total, serviceId) => {
      const service = additionalServices.find(s => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const getBaseMovingFee = () => 5000; // Base fee
  const getDistanceFee = () => 2000; // Distance-based fee
  const getTaxAmount = () => Math.round((calculateRoomTotal() + calculateServicesTotal()) * 0.16); // 16% VAT

  const getGrandTotal = () => {
    return getBaseMovingFee() + getDistanceFee() + calculateRoomTotal() + calculateServicesTotal() + getTaxAmount();
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateQuote = async () => {
    setIsGeneratingQuote(true);
    
    // Simulate quote generation
    setTimeout(() => {
      setIsGeneratingQuote(false);
      setQuoteGenerated(true);
      onQuoteGenerated({
        customerInfo,
        locations,
        rooms,
        services,
        total: getGrandTotal(),
        quoteId: `MV-${Date.now()}`
      });
    }, 2000);
  };

  const shareViaWhatsApp = () => {
    const message = `Hi! I got a moving quote from MoveEase Pro:\n\nFrom: ${locations?.current || 'Not specified'}\nTo: ${locations?.destination || 'Not specified'}\nTotal: KES ${getGrandTotal().toLocaleString()}\n\nQuote ID: MV-${Date.now()}\n\nPlease contact me to proceed.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isActive) return null;

  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
          {currentStep}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Quote Summary</h2>
      </div>

      {/* Location Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
          <Icon name="MapPin" size={16} className="mr-2" />
          Moving Route
        </h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-gray-600 w-16">From:</span>
            <span className="font-medium">{locations?.current || 'Not specified'}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600 w-16">To:</span>
            <span className="font-medium">{locations?.destination || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Cost Breakdown</h3>
        
        <div className="space-y-3">
          {/* Base Fees */}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Base Moving Fee</span>
            <span className="font-medium">KES {getBaseMovingFee().toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Distance Fee (~45 km)</span>
            <span className="font-medium">KES {getDistanceFee().toLocaleString()}</span>
          </div>

          {/* Room Costs */}
          {Object.entries(rooms || {}).map(([roomId, count]) => {
            const room = roomTypes.find(r => r.id === roomId);
            if (!room || count === 0) return null;
            
            return (
              <div key={roomId} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">
                  {room.name} ({count}x)
                </span>
                <span className="font-medium">
                  KES {(room.basePrice * count).toLocaleString()}
                </span>
              </div>
            );
          })}

          {/* Additional Services */}
          {Object.keys(services || {}).map(serviceId => {
            const service = additionalServices.find(s => s.id === serviceId);
            if (!service) return null;
            
            return (
              <div key={serviceId} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">{service.name}</span>
                <span className="font-medium">KES {service.price.toLocaleString()}</span>
              </div>
            );
          })}

          {/* Tax */}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">VAT (16%)</span>
            <span className="font-medium">KES {getTaxAmount().toLocaleString()}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between py-3 border-t-2 border-primary">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-xl font-bold text-primary">
              KES {getGrandTotal().toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      {!quoteGenerated && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              value={customerInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+254 700 000 000"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Email Address"
                type="email"
                placeholder="your.email@example.com"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {!quoteGenerated ? (
          <Button
            variant="default"
            fullWidth
            onClick={generateQuote}
            loading={isGeneratingQuote}
            disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
            iconName="FileText"
            iconPosition="left"
          >
            {isGeneratingQuote ? 'Generating Quote...' : 'Generate Quote'}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <Icon name="CheckCircle" size={24} className="text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">Quote Generated Successfully!</p>
              <p className="text-green-700 text-sm">Quote ID: MV-{Date.now()}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={shareViaWhatsApp}
                iconName="MessageCircle"
                iconPosition="left"
              >
                Share via WhatsApp
              </Button>
              <Button
                variant="default"
                onClick={() => window.location.href = '/login'}
                iconName="Calendar"
                iconPosition="left"
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteSummary;