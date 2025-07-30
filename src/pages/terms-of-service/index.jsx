import React from 'react';
import { Helmet } from 'react-helmet';
import CustomerHeader from '../../components/ui/CustomerHeader';
import Footer from '../landing-page/components/Footer';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Longonot Movers</title>
        <meta name="description" content="Terms of Service for Longonot Movers - Read our terms and conditions for using our moving services." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <CustomerHeader />
        
        {/* Hero Section */}
        <section 
          className="relative min-h-[40vh] flex items-center justify-center text-white overflow-hidden"
          style={{
            backgroundImage: 'url(/assets/images/page-tittles/tittle3.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Terms and conditions for our services
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

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By using Longonot Movers' services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-600 mb-6">
                Longonot Movers provides professional moving and relocation services including:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Residential and commercial moving</li>
                <li>Packing and unpacking services</li>
                <li>Storage solutions</li>
                <li>Long-distance relocations</li>
                <li>Specialty item moving</li>
                <li>Insurance coverage options</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Booking and Payment</h2>
              <p className="text-gray-600 mb-6">
                All bookings require a written agreement and may require a deposit. Payment terms:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Quotes are valid for 30 days unless otherwise specified</li>
                <li>Payment is due upon completion of services</li>
                <li>Additional charges may apply for extra services</li>
                <li>Cancellation fees may apply as per our cancellation policy</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Customer Responsibilities</h2>
              <p className="text-gray-600 mb-6">
                Customers are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Providing accurate information about items to be moved</li>
                <li>Ensuring access to both origin and destination locations</li>
                <li>Declaring valuable or fragile items</li>
                <li>Obtaining necessary permits or permissions</li>
                <li>Being present during pickup and delivery</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Liability and Insurance</h2>
              <p className="text-gray-600 mb-6">
                Our liability is limited as follows:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Basic coverage is included in all moves</li>
                <li>Full value protection is available for additional cost</li>
                <li>Claims must be reported within 9 months</li>
                <li>We are not liable for items packed by the customer</li>
                <li>Acts of God and force majeure events are excluded</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Items</h2>
              <p className="text-gray-600 mb-6">
                We cannot transport hazardous materials, perishables, plants, pets, or items of 
                extraordinary value without special arrangements.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Dispute Resolution</h2>
              <p className="text-gray-600 mb-6">
                Any disputes will be resolved through mediation or arbitration in accordance with 
                Kenyan law. The courts of Kenya shall have exclusive jurisdiction.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
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

export default TermsOfServicePage;
