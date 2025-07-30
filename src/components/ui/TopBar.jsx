import React from 'react';
import Icon from '../AppIcon';

const TopBar = () => {
  const marqueeItems = [
    { icon: 'Phone', text: 'Call us: +254 710 437908' },
    { icon: 'Mail', text: 'Email: info@longonotmovers.co.ke' },
    { icon: 'MapPin', text: 'Serving all of Kenya - Nairobi, Mombasa, Kisumu & more' },
    { icon: 'Truck', text: 'Professional Moving Services Since 2014' },
    { icon: 'Shield', text: 'Fully Insured & Licensed Moving Company' },
    { icon: 'Clock', text: 'Available 24/7 for Emergency Moves' }
  ];

  return (
    <div className="bg-primary text-white py-2 overflow-hidden relative">
      <div className="marquee-container">
        <div className="marquee-content">
          {/* First set of items */}
          <div className="flex items-center space-x-8 whitespace-nowrap">
            {marqueeItems.map((item, index) => (
              <div key={`first-${index}`} className="flex items-center space-x-2 mx-4">
                <Icon name={item.icon} size={16} className="text-white flex-shrink-0" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center space-x-8 whitespace-nowrap">
            {marqueeItems.map((item, index) => (
              <div key={`second-${index}`} className="flex items-center space-x-2 mx-4">
                <Icon name={item.icon} size={16} className="text-white flex-shrink-0" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
        }
        
        .marquee-content {
          display: flex;
          animation: marquee 60s linear infinite;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .marquee-content:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) {
          .marquee-content {
            animation-duration: 45s;
          }
        }
      `}</style>
    </div>
  );
};

export default TopBar;
