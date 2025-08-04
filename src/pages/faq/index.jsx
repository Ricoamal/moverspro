import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I get a moving quote?",
      answer: "You can get a free quote by calling us at +254 710 437908, emailing info@longonotmovers.co.ke, or using our online cost calculator. We'll need details about your move including locations, date, and inventory."
    },
    {
      question: "How far in advance should I book my move?",
      answer: "We recommend booking at least 2-4 weeks in advance, especially during peak moving seasons (holidays and month-ends). However, we can often accommodate last-minute moves based on availability."
    },
    {
      question: "What items cannot be moved?",
      answer: "We cannot transport hazardous materials, perishable food, plants, pets, ammunition, or flammable items. We also have restrictions on high-value items like jewelry and important documents."
    },
    {
      question: "Do you provide packing materials?",
      answer: "Yes, we provide all necessary packing materials including boxes, bubble wrap, packing paper, and tape. We also offer professional packing services if you prefer our team to handle the packing."
    },
    {
      question: "Are my belongings insured during the move?",
      answer: "Yes, all moves include basic coverage. We also offer full value protection insurance for additional peace of mind. Our team will explain the coverage options during your quote."
    },
    {
      question: "What happens if my items are damaged?",
      answer: "If any items are damaged during the move, please report it immediately. We have a claims process and will work to resolve any issues quickly and fairly according to your coverage level."
    },
    {
      question: "Do you move on weekends and holidays?",
      answer: "Yes, we offer moving services seven days a week, including weekends and most holidays. Weekend and holiday moves may have different pricing."
    },
    {
      question: "How long does a typical move take?",
      answer: "Move duration depends on the size of your home, distance, and services required. A typical 2-3 bedroom home takes 4-8 hours for local moves. Long-distance moves may take 1-3 days."
    },
    {
      question: "Do you provide storage services?",
      answer: "Yes, we offer both short-term and long-term storage solutions in our secure, climate-controlled facilities. Storage can be arranged as part of your move or separately."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, bank transfers, mobile money (M-Pesa), and major credit cards. Payment is typically due upon completion of services, though deposits may be required for large moves."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions - Longonot Movers</title>
        <meta name="description" content="Get answers to common questions about Longonot Movers' services, pricing, and moving process." />
      </Helmet>

      <div className="min-h-screen bg-white">
        
        
        {/* Hero Section */}
        <section 
          className="relative min-h-[40vh] flex items-center justify-center text-white overflow-hidden"
          style={{
            backgroundImage: 'url(/assets/images/page-tittles/tittle2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Find answers to common questions about our moving services
            </p>
          </div>
        </section>

        {/* Content Section */}
        <main className="main-content-with-topbar py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <Icon 
                      name={openFAQ === index ? "ChevronUp" : "ChevronDown"} 
                      size={20} 
                      className="text-gray-500 flex-shrink-0" 
                    />
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 mb-6">
                Our friendly team is here to help with any questions about your move.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+254710437908"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                >
                  <Icon name="Phone" size={20} className="mr-2" />
                  Call Us Now
                </a>
                <a
                  href="mailto:info@longonotmovers.co.ke"
                  className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                >
                  <Icon name="Mail" size={20} className="mr-2" />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default FAQPage;
