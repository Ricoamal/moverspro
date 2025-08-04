import React from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../landing-page/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Longonot Movers</title>
        <meta name="description" content="Privacy Policy for Longonot Movers - Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="min-h-screen bg-white">
        
        
        {/* Hero Section */}
        <section 
          className="relative min-h-[40vh] flex items-center justify-center text-white overflow-hidden"
          style={{
            backgroundImage: 'url(/assets/images/page-tittles/tittle4.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Your privacy is important to us
            </p>
          </div>
        </section>

        {/* Content Section */}
        <main className="main-content-with-topbar py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <p className="text-gray-700 mb-0">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-GB', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-6">
                We collect information you provide directly to us, such as when you request a quote, 
                book our services, or contact us. This may include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Name, email address, and phone number</li>
                <li>Moving addresses (origin and destination)</li>
                <li>Moving date and service requirements</li>
                <li>Payment information for completed services</li>
                <li>Communication preferences</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-6">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Provide and improve our moving services</li>
                <li>Process quotes and bookings</li>
                <li>Communicate with you about your move</li>
                <li>Send service updates and confirmations</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share information with:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Service providers who assist in our operations</li>
                <li>Insurance companies for coverage purposes</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your explicit consent</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-6">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-600 mb-6">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>File a complaint with relevant authorities</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> info@longonotmovers.co.ke</p>
                <p className="text-gray-700 mb-2"><strong>Phone:</strong> +254 710 437908</p>
                <p className="text-gray-700 mb-0"><strong>Address:</strong> Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
