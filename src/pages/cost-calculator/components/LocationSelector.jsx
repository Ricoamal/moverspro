import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LocationSelector = ({ onLocationSelect, currentStep, isActive }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const kenyanCities = [
    'Nairobi, Kenya',
    'Mombasa, Kenya', 
    'Kisumu, Kenya',
    'Nakuru, Kenya',
    'Eldoret, Kenya',
    'Thika, Kenya',
    'Malindi, Kenya',
    'Kitale, Kenya',
    'Garissa, Kenya',
    'Kakamega, Kenya',
    'Machakos, Kenya',
    'Meru, Kenya',
    'Nyeri, Kenya',
    'Kericho, Kenya',
    'Embu, Kenya'
  ];

  const detectCurrentLocation = () => {
    setIsDetectingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Mock reverse geocoding for demo
        setTimeout(() => {
          const mockLocation = 'Nairobi, Kenya';
          setCurrentLocation(mockLocation);
          setIsDetectingLocation(false);
          onLocationSelect('current', mockLocation);
        }, 2000);
      },
      (error) => {
        setLocationError('Unable to detect location. Please enter manually.');
        setIsDetectingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  const handleDestinationChange = (value) => {
    setDestinationLocation(value);
    
    if (value.length > 2) {
      const filtered = kenyanCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion) => {
    setDestinationLocation(suggestion);
    setSuggestions([]);
    onLocationSelect('destination', suggestion);
  };

  useEffect(() => {
    if (isActive && !currentLocation) {
      detectCurrentLocation();
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
          {currentStep}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Select Locations</h2>
      </div>

      {/* Current Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Icon name="MapPin" size={16} className="inline mr-2" />
          Current Location
        </label>
        
        {isDetectingLocation ? (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <Icon name="Loader2" size={20} className="animate-spin text-primary mr-2" />
            <span className="text-primary">Detecting your location...</span>
          </div>
        ) : currentLocation ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <Icon name="CheckCircle" size={20} className="text-green-600 mr-2" />
              <span className="text-green-800 font-medium">{currentLocation}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={detectCurrentLocation}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {locationError && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-700 text-sm">{locationError}</p>
              </div>
            )}
            <Button
              variant="outline"
              onClick={detectCurrentLocation}
              iconName="MapPin"
              iconPosition="left"
              fullWidth
            >
              Detect Current Location
            </Button>
          </div>
        )}
      </div>

      {/* Destination Location */}
      <div className="mb-6">
        <div className="relative">
          <Input
            label="Destination Location"
            type="text"
            placeholder="Enter destination city..."
            value={destinationLocation}
            onChange={(e) => handleDestinationChange(e.target.value)}
            className="mb-2"
          />
          
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-elevated max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-smooth border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <Icon name="MapPin" size={16} className="text-gray-400 mr-3" />
                    <span className="text-gray-900">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Distance Info */}
      {currentLocation && destinationLocation && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="Route" size={20} className="text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Estimated Distance</span>
            </div>
            <span className="text-blue-900 font-semibold">~45 km</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;