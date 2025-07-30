import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoomSelector = ({ onRoomSelect, currentStep, isActive }) => {
  const [selectedRooms, setSelectedRooms] = useState({});

  const roomTypes = [
    {
      id: 'bedroom',
      name: 'Bedrooms',
      icon: 'Bed',
      basePrice: 2500,
      description: 'Including wardrobes and furniture'
    },
    {
      id: 'living_room',
      name: 'Living Room',
      icon: 'Sofa',
      basePrice: 3000,
      description: 'Sofas, TV, and entertainment unit'
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: 'ChefHat',
      basePrice: 2000,
      description: 'Appliances and kitchenware'
    },
    {
      id: 'bathroom',
      name: 'Bathrooms',
      icon: 'Bath',
      basePrice: 1000,
      description: 'Fixtures and accessories'
    },
    {
      id: 'dining_room',
      name: 'Dining Room',
      icon: 'UtensilsCrossed',
      basePrice: 1500,
      description: 'Table, chairs, and dining items'
    },
    {
      id: 'office',
      name: 'Home Office',
      icon: 'Briefcase',
      basePrice: 2000,
      description: 'Desk, chair, and office equipment'
    }
  ];

  const updateRoomCount = (roomId, change) => {
    const currentCount = selectedRooms[roomId] || 0;
    const newCount = Math.max(0, Math.min(10, currentCount + change));
    
    const updatedRooms = {
      ...selectedRooms,
      [roomId]: newCount
    };
    
    if (newCount === 0) {
      delete updatedRooms[roomId];
    }
    
    setSelectedRooms(updatedRooms);
    onRoomSelect(updatedRooms);
  };

  const getTotalRooms = () => {
    return Object.values(selectedRooms).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(selectedRooms).reduce((total, [roomId, count]) => {
      const room = roomTypes.find(r => r.id === roomId);
      return total + (room ? room.basePrice * count : 0);
    }, 0);
  };

  if (!isActive) return null;

  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {currentStep}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Select Rooms</h2>
        </div>
        {getTotalRooms() > 0 && (
          <div className="text-sm text-gray-600">
            {getTotalRooms()} room{getTotalRooms() !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {roomTypes.map((room) => {
          const count = selectedRooms[room.id] || 0;
          const isSelected = count > 0;

          return (
            <div
              key={room.id}
              className={`border-2 rounded-xl p-4 transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-blue-50' :'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon name={room.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{room.name}</h3>
                    <p className="text-sm text-gray-500">KES {room.basePrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-4">{room.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRoomCount(room.id, -1)}
                    disabled={count === 0}
                    className="w-8 h-8"
                  >
                    <Icon name="Minus" size={14} />
                  </Button>
                  
                  <span className="w-8 text-center font-medium text-gray-900">
                    {count}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRoomCount(room.id, 1)}
                    disabled={count >= 10}
                    className="w-8 h-8"
                  >
                    <Icon name="Plus" size={14} />
                  </Button>
                </div>

                {isSelected && (
                  <div className="text-sm font-medium text-primary">
                    KES {(room.basePrice * count).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {getTotalRooms() > 0 && (
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="Home" size={20} className="text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Total Rooms: {getTotalRooms()}
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

export default RoomSelector;