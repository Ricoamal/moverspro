import React from 'react';
import Icon from '../../../components/AppIcon';

const MissionVision = ({ isEditMode }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our commitment to excellence drives everything we do
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Icon name="Target" size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-600">
              To provide exceptional moving services that exceed customer expectations through 
              professionalism, reliability, and care. We strive to make every move a positive 
              experience for our clients.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Icon name="Eye" size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Our Vision</h3>
            </div>
            <p className="text-gray-600">
              To be Kenya's leading moving company, recognized for innovation, sustainability, 
              and exceptional customer service. We envision a future where moving is seamless 
              and stress-free for everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
