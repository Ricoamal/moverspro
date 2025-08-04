import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Footer from '../landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const HelpCenterPage = () => {
  const helpCategories = [
    {
      icon: 'HelpCircle',
      title: 'Getting Started',
      description: 'Learn how to book your move and prepare for moving day',
      links: [
        { name: 'How to Get a Quote', href: '/cost-calculator' },
        { name: 'Booking Your Move', href: '/contact' },
        { name: 'Preparing for Moving Day', href: '/moving-tips' },
        { name: 'What to Expect', href: '/faq' }
      ]
    },
    {
      icon: 'Package',
      title: 'Packing & Preparation',
      description: 'Tips and guidelines for packing your belongings safely',
      links: [
        { name: 'Packing Guidelines', href: '/moving-tips' },
        { name: 'Prohibited Items', href: '/terms-of-service' },
        { name: 'Fragile Items Care', href: '/moving-tips' },
        { name: 'Inventory Checklist', href: '/moving-tips' }
      ]
    },
    {
      icon: 'Truck',
      title: 'Moving Services',
      description: 'Information about our different moving services',
      links: [
        { name: 'Residential Moving', href: '/services' },
        { name: 'Commercial Moving', href: '/services' },
        { name: 'Storage Solutions', href: '/services' },
        { name: 'Long Distance Moves', href: '/services' }
      ]
    },
    {
      icon: 'Shield',
      title: 'Insurance & Claims',
      description: 'Understanding coverage options and filing claims',
      links: [
        { name: 'Insurance Options', href: '/insurance-info' },
        { name: 'Filing a Claim', href: '/file-claim' },
        { name: 'Coverage Details', href: '/insurance-info' },
        { name: 'Claims Process', href: '/file-claim' }
      ]
    },
    {
      icon: 'CreditCard',
      title: 'Billing & Payments',
      description: 'Payment methods, billing, and refund information',
      links: [
        { name: 'Payment Methods', href: '/faq' },
        { name: 'Understanding Your Bill', href: '/faq' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Additional Charges', href: '/terms-of-service' }
      ]
    },
    {
      icon: 'MapPin',
      title: 'Track Your Move',
      description: 'Monitor your move progress and get updates',
      links: [
        { name: 'Track Your Move', href: '/track-move' },
        { name: 'Delivery Updates', href: '/track-move' },
        { name: 'Contact Your Team', href: '/contact' },
        { name: 'Change Requests', href: '/contact' }
      ]
    }
  ];

  const quickActions = [
    {
      icon: 'Phone',
      title: 'Call Us',
      description: 'Speak with our customer service team',
      action: 'tel:+254710437908',
      buttonText: '+254 710 437908'
    },
    {
      icon: 'Mail',
      title: 'Email Support',
      description: 'Send us your questions via email',
      action: 'mailto:info@longonotmovers.co.ke',
      buttonText: 'Email Us'
    },
    {
      icon: 'MessageCircle',
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp',
      action: 'https://wa.me/254710437908',
      buttonText: 'Chat Now'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Help Center - Longonot Movers</title>
        <meta name="description" content="Get help with your move. Find guides, FAQs, and contact information for Longonot Movers customer support." />
      </Helmet>

      <div className="min-h-screen bg-white">
        
        
        {/* Hero Section */}
        <section 
          className="relative min-h-[40vh] flex items-center justify-center text-white overflow-hidden"
          style={{
            backgroundImage: 'url(/assets/images/page-tittles/tittle1.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Help Center
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Find answers and get support for your move
            </p>
          </div>
        </section>

        {/* Content Section */}
        <main className="main-content-with-topbar py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Quick Actions */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Need Immediate Help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon name={action.icon} size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 mb-4">{action.description}</p>
                    <a
                      href={action.action}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                    >
                      {action.buttonText}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Categories */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse Help Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {helpCategories.map((category, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon name={category.icon} size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <ul className="space-y-2">
                      {category.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            to={link.href}
                            className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-gray-600 mb-6">
                Our customer service team is available to help with any questions about your move.
              </p>
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Icon name="MessageCircle" size={20} className="mr-2" />
                Contact Support
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default HelpCenterPage;
