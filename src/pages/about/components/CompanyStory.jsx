import React from 'react';

const CompanyStory = ({ isEditMode }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Our Journey</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Our Story</h2>
            </div>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Founded in 2014, Longonot Movers began as a small family business with a simple mission:
                to make moving stress-free for families and businesses across Kenya. Named after the iconic
                Mount Longonot, we embody the strength and reliability of this natural landmark.
              </p>
              <p>
                What started with a single truck and a commitment to excellence has grown into Kenya's
                most trusted moving company, serving thousands of satisfied customers nationwide. Our
                growth reflects our unwavering dedication to customer satisfaction and service excellence.
              </p>
              <p>
                Today, we combine traditional values of reliability and care with modern technology
                and professional expertise to deliver exceptional moving experiences. Every move is
                handled with the same attention to detail that built our reputation.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">5000+</div>
                <div className="text-sm text-gray-600">Successful Moves</div>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative">
              <img
                src="/assets/images/about4h4.jpg"
                alt="Our Story"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">LM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Longonot Movers</p>
                    <p className="text-sm text-gray-600">Trusted Since 2014</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStory;
