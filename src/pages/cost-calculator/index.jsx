import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CustomerHeader from '../../components/ui/CustomerHeader';
import ProgressIndicator from './components/ProgressIndicator';
import LocationSelector from './components/LocationSelector';
import RoomSelector from './components/RoomSelector';
import AdditionalServices from './components/AdditionalServices';
import QuoteSummary from './components/QuoteSummary';
import PriceEstimateCard from './components/PriceEstimateCard';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CostCalculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [locations, setLocations] = useState({});
  const [selectedRooms, setSelectedRooms] = useState({});
  const [selectedServices, setSelectedServices] = useState({});
  const [quoteData, setQuoteData] = useState(null);
  const [showPriceCard, setShowPriceCard] = useState(false);

  const totalSteps = 4;

  const stepTitles = [
    'Select Locations',
    'Choose Rooms',
    'Additional Services',
    'Quote Summary'
  ];

  useEffect(() => {
    // Show price card when user has selected rooms or services
    const hasSelections = Object.keys(selectedRooms).length > 0 || Object.keys(selectedServices).length > 0;
    setShowPriceCard(hasSelections);
  }, [selectedRooms, selectedServices]);

  const handleLocationSelect = (type, location) => {
    setLocations(prev => ({
      ...prev,
      [type]: location
    }));
  };

  const handleRoomSelect = (rooms) => {
    setSelectedRooms(rooms);
  };

  const handleServicesSelect = (services) => {
    setSelectedServices(services);
  };

  const handleQuoteGenerated = (quote) => {
    setQuoteData(quote);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return locations.current && locations.destination;
      case 2:
        return Object.keys(selectedRooms).length > 0;
      case 3:
        return true; // Services are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && canProceedToNext()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jumpToQuote = () => {
    setCurrentStep(4);
  };

  return (
    <>
      <Helmet>
        <title>Cost Calculator - MoveEase Pro</title>
        <meta name="description" content="Get instant, transparent pricing estimates for your moving needs with our interactive cost calculator." />
      </Helmet>

      <CustomerHeader />
      
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Indicator */}
          <ProgressIndicator 
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitles={stepTitles}
          />

          {/* Step Content */}
          <div className="relative">
            <LocationSelector
              onLocationSelect={handleLocationSelect}
              currentStep={1}
              isActive={currentStep === 1}
            />

            <RoomSelector
              onRoomSelect={handleRoomSelect}
              currentStep={2}
              isActive={currentStep === 2}
            />

            <AdditionalServices
              onServicesSelect={handleServicesSelect}
              currentStep={3}
              isActive={currentStep === 3}
            />

            <QuoteSummary
              locations={locations}
              rooms={selectedRooms}
              services={selectedServices}
              currentStep={4}
              isActive={currentStep === 4}
              onQuoteGenerated={handleQuoteGenerated}
            />
          </div>

          {/* Navigation Controls */}
          {currentStep < 4 && (
            <div className="bg-white rounded-xl shadow-card p-6 mb-20 lg:mb-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  iconName="ChevronLeft"
                  iconPosition="left"
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-3">
                  {currentStep < 4 && canProceedToNext() && (
                    <Button
                      variant="ghost"
                      onClick={jumpToQuote}
                      iconName="FastForward"
                      iconPosition="left"
                      className="text-primary"
                    >
                      Skip to Quote
                    </Button>
                  )}

                  <Button
                    variant="default"
                    onClick={nextStep}
                    disabled={!canProceedToNext()}
                    iconName="ChevronRight"
                    iconPosition="right"
                  >
                    {currentStep === totalSteps ? 'Complete' : 'Next'}
                  </Button>
                </div>
              </div>

              {!canProceedToNext() && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center">
                    <Icon name="AlertCircle" size={16} className="text-amber-600 mr-2" />
                    <span className="text-amber-800 text-sm">
                      {currentStep === 1 && 'Please select both current and destination locations to continue.'}
                      {currentStep === 2 && 'Please select at least one room to continue.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Back to Top Button */}
          {currentStep === 4 && (
            <div className="text-center mb-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Start New Quote
              </Button>
            </div>
          )}
        </div>

        {/* Price Estimate Card */}
        <PriceEstimateCard
          rooms={selectedRooms}
          services={selectedServices}
          isVisible={showPriceCard && currentStep < 4}
          onGetQuote={jumpToQuote}
        />
      </div>
    </>
  );
};

export default CostCalculator;