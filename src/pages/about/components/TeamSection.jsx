import React from 'react';
import Icon from '../../../components/AppIcon';

const TeamSection = () => {
  const teamMembers = [
    {
      name: 'John Kamau',
      role: 'Founder & CEO',
      image: '/assets/images/about4h4.jpg',
      description: 'With over 15 years in logistics, John founded Longonot Movers to revolutionize the moving industry in Kenya.'
    },
    {
      name: 'Sarah Wanjiku',
      role: 'Operations Manager',
      image: '/assets/images/about3h3.jpg',
      description: 'Sarah ensures every move runs smoothly with her exceptional organizational skills and attention to detail.'
    },
    {
      name: 'David Ochieng',
      role: 'Customer Relations',
      image: '/assets/images/about4h4.jpg',
      description: 'David leads our customer service team, ensuring every client receives personalized care and support.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The dedicated professionals behind Kenya's most trusted moving company
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-4">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
