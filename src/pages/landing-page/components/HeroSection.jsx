import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCalculateCost = () => {
    navigate('/cost-calculator');
  };

  const handleLearnMore = () => {
    document.getElementById('services-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white pt-20 pb-16 lg:pt-24 lg:pb-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-accent rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-secondary rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Professional Moving Services
              <span className="block text-primary">Made Simple</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Get instant quotes, track your move, and enjoy stress-free relocation with Kenya's most trusted moving company. From residential to commercial moves, we've got you covered.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="default"
                size="lg"
                onClick={handleCalculateCost}
                iconName="Calculator"
                iconPosition="left"
                className="text-lg px-8 py-4"
              >
                Calculate Cost Now
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleLearnMore}
                iconName="ArrowDown"
                iconPosition="right"
                className="text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-green-500" />
                <span className="text-sm text-gray-600">Fully Insured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={20} className="text-blue-500" />
                <span className="text-sm text-gray-600">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Star" size={20} className="text-yellow-500" />
                <span className="text-sm text-gray-600">5-Star Rated</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Professional movers loading boxes into truck"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-elevated"
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-card z-20 hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">500+ Moves</p>
                  <p className="text-sm text-gray-600">Completed This Month</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-card z-20 hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Truck" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Same Day</p>
                  <p className="text-sm text-gray-600">Service Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;