import React from 'react';
import { Helmet } from 'react-helmet';
import CustomerHeader from '../../components/ui/CustomerHeader';
import Footer from '../landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const MovingTipsPage = () => {
  const tips = [
    {
      category: "Planning & Preparation",
      icon: "Calendar",
      tips: [
        "Start planning your move at least 8 weeks in advance",
        "Create a moving checklist and timeline",
        "Research and book your moving company early",
        "Notify utility companies of your move date",
        "Update your address with banks, employers, and subscriptions"
      ]
    },
    {
      category: "Packing Tips",
      icon: "Package",
      tips: [
        "Use sturdy boxes and quality packing materials",
        "Pack heavy items in small boxes",
        "Wrap fragile items individually with bubble wrap",
        "Label boxes clearly with contents and destination room",
        "Pack a 'first day' box with essentials"
      ]
    },
    {
      category: "Moving Day",
      icon: "Truck",
      tips: [
        "Be present during pickup and delivery",
        "Do a final walkthrough before movers arrive",
        "Keep important documents with you",
        "Take photos of valuable items before packing",
        "Have cash ready for tips and unexpected expenses"
      ]
    },
    {
      category: "After the Move",
      icon: "Home",
      tips: [
        "Unpack essentials first (kitchen, bathroom, bedroom)",
        "Check inventory list against delivered items",
        "Report any damages immediately",
        "Update your voter registration and driver's license",
        "Leave reviews for your moving company"
      ]
    }
  ];

  const packingGuide = [
    {
      room: "Kitchen",
      tips: [
        "Pack dishes vertically like records",
        "Use towels and linens as padding",
        "Pack appliances in original boxes if available",
        "Seal liquid containers with plastic wrap"
      ]
    },
    {
      room: "Bedroom",
      tips: [
        "Use wardrobe boxes for hanging clothes",
        "Pack jewelry in small boxes with padding",
        "Disassemble bed frames and keep hardware together",
        "Pack shoes in their original boxes"
      ]
    },
    {
      room: "Living Room",
      tips: [
        "Remove batteries from electronics",
        "Pack books in small boxes to avoid overweight",
        "Wrap artwork in bubble wrap and mark 'FRAGILE'",
        "Take photos of electronic setups before disconnecting"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Moving Tips & Guide - Longonot Movers</title>
        <meta name="description" content="Expert moving tips and advice from Longonot Movers. Learn how to plan, pack, and execute a successful move." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <CustomerHeader />
        
        {/* Hero Section */}
        <section 
          className="relative min-h-[40vh] flex items-center justify-center text-white overflow-hidden"
          style={{
            backgroundImage: 'url(/assets/images/our-work/ourwork (7).jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Moving Tips & Guide
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Expert advice to make your move smooth and stress-free
            </p>
          </div>
        </section>

        {/* Content Section */}
        <main className="main-content-with-topbar py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* General Tips */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Essential Moving Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tips.map((category, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Icon name={category.icon} size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{category.category}</h3>
                    </div>
                    <ul className="space-y-3">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <Icon name="Check" size={16} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Room-by-Room Packing Guide */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Room-by-Room Packing Guide</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {packingGuide.map((room, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{room.room}</h3>
                    <ul className="space-y-2">
                      {room.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <Icon name="ArrowRight" size={16} className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Moving Checklist */}
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">8-Week Moving Checklist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">8 Weeks Before</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Research moving companies</li>
                    <li>• Get moving quotes</li>
                    <li>• Set moving budget</li>
                    <li>• Start decluttering</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">6 Weeks Before</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Book your moving company</li>
                    <li>• Order packing supplies</li>
                    <li>• Start using up perishables</li>
                    <li>• Research new area</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">4 Weeks Before</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Notify utility companies</li>
                    <li>• Update address with banks</li>
                    <li>• Transfer school records</li>
                    <li>• Start packing non-essentials</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Moving Week</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Pack essentials box</li>
                    <li>• Confirm details with movers</li>
                    <li>• Prepare cash for tips</li>
                    <li>• Get good night's sleep</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Professional Help?
              </h2>
              <p className="text-gray-600 mb-6">
                Let our experienced team handle your move from start to finish.
              </p>
              <a
                href="/cost-calculator"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Icon name="Calculator" size={20} className="mr-2" />
                Get Free Quote
              </a>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MovingTipsPage;
