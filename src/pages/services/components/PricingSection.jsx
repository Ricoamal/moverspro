import React from 'react';
import Button from '../../../components/ui/Button';

const PricingSection = ({ isEditMode }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Your Free Quote</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Every move is unique. Contact us for a personalized quote based on your specific needs.
        </p>
        <Button 
          variant="default" 
          size="lg"
          onClick={() => window.location.href = '/cost-calculator'}
          iconName="Calculator"
          iconPosition="left"
        >
          Calculate Moving Cost
        </Button>
      </div>
    </section>
  );
};

export default PricingSection;
