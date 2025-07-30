import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PriceEstimateCard = ({ 
  rooms, 
  services, 
  isVisible, 
  onGetQuote 
}) => {
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

  const getBaseTotal = () => 7000; // Base + Distance fee
  const getSubtotal = () => getBaseTotal() + calculateRoomTotal() + calculateServicesTotal();
  const getTaxAmount = () => Math.round(getSubtotal() * 0.16);
  const getGrandTotal = () => getSubtotal() + getTaxAmount();

  const getTotalRooms = () => {
    return Object.values(rooms || {}).reduce((sum, count) => sum + count, 0);
  };

  const getSelectedServicesCount = () => {
    return Object.keys(services || {}).length;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block fixed right-6 top-24 w-80 z-30">
        <div className="bg-white rounded-xl shadow-elevated p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Icon name="Calculator" size={20} className="text-primary mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Price Estimate</h3>
          </div>

          <div className="space-y-4 mb-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{getTotalRooms()}</div>
                <div className="text-xs text-gray-600">Rooms</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{getSelectedServicesCount()}</div>
                <div className="text-xs text-gray-600">Services</div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base & Distance</span>
                <span>KES {getBaseTotal().toLocaleString()}</span>
              </div>
              
              {calculateRoomTotal() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Rooms</span>
                  <span>KES {calculateRoomTotal().toLocaleString()}</span>
                </div>
              )}
              
              {calculateServicesTotal() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Services</span>
                  <span>KES {calculateServicesTotal().toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (16%)</span>
                <span>KES {getTaxAmount().toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">KES {getGrandTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button
            variant="default"
            fullWidth
            onClick={onGetQuote}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Get Detailed Quote
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              * Prices are estimates. Final quote may vary based on specific requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Card */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-modal p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{getTotalRooms()}</div>
              <div className="text-xs text-gray-600">Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{getSelectedServicesCount()}</div>
              <div className="text-xs text-gray-600">Services</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              KES {getGrandTotal().toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Estimate</div>
          </div>
        </div>

        <Button
          variant="default"
          fullWidth
          onClick={onGetQuote}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Get Detailed Quote
        </Button>
      </div>
    </>
  );
};

export default PriceEstimateCard;