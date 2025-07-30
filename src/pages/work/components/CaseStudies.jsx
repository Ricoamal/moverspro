import React from 'react';
import Icon from '../../../components/AppIcon';

const CaseStudies = ({ isEditMode }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Detailed case studies of our most challenging and successful projects
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Corporate Headquarters Relocation
              </h3>
              <p className="text-gray-600 mb-6">
                Successfully relocated a 500-employee corporate headquarters from Nairobi CBD to Westlands 
                over a single weekend, ensuring zero business disruption.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Icon name="Check" size={16} className="text-green-500 mr-3" />
                  <span className="text-sm text-gray-600">Completed in 48 hours</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" size={16} className="text-green-500 mr-3" />
                  <span className="text-sm text-gray-600">Zero downtime achieved</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" size={16} className="text-green-500 mr-3" />
                  <span className="text-sm text-gray-600">IT infrastructure seamlessly transferred</span>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/assets/images/our-work/ourwork (2).jpg"
                alt="Corporate Relocation"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
