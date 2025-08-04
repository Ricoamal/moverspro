import React from 'react';
import Icon from '../../../components/AppIcon';

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: 'Phone',
      title: 'Phone',
      details: ['+254 710 437908'],
      description: 'Call us for immediate assistance'
    },
    {
      icon: 'Mail',
      title: 'Email',
      details: ['info@longonotmovers.co.ke'],
      description: 'Send us an email anytime'
    },
    {
      icon: 'MapPin',
      title: 'Office',
      details: ['Nairobi, Kenya'],
      description: 'Visit our main office'
    },
    {
      icon: 'Clock',
      title: 'Hours',
      details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'],
      description: 'Our business hours'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
        <p className="text-gray-600 mb-8">
          Ready to make your move? Contact us today for a free consultation and quote. 
          Our friendly team is here to help make your relocation smooth and stress-free.
        </p>
      </div>
      
      <div className="space-y-6">
        {contactDetails.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={item.icon} size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              {item.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600">{detail}</p>
              ))}
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Emergency Moving?</h3>
        <p className="text-gray-600 text-sm mb-3">
          Need to move urgently? We offer 24/7 emergency moving services.
        </p>
        <p className="font-semibold text-blue-600">Call: +254 710 437908</p>
      </div>
    </div>
  );
};

export default ContactInfo;
