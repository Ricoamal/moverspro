import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const LocationMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Nairobi coordinates (you can adjust these to your specific office location)
  const officeLocation = {
    lat: -1.2921,
    lng: 36.8219,
    address: "Nairobi, Kenya",
    name: "Longonot Movers Office"
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const handleDirectionsClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${officeLocation.lat},${officeLocation.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visit our office in Nairobi for in-person consultations, quotes, and to discuss your moving needs with our expert team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-96 lg:h-[500px]">
                {!mapLoaded && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Icon name="MapPin" size={32} className="text-blue-600" />
                      </div>
                      <p className="text-gray-600">Loading interactive map...</p>
                    </div>
                  </div>
                )}

                {/* Google Maps Embed */}
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.000000000002!2d36.8219!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d22ac83b7d%3A0x285651a0c9c0c6b0!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1699000000000!5m2!1sen!2ske`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={handleMapLoad}
                  className="w-full h-full"
                  title="Longonot Movers Office Location"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Icon name="MapPin" size={24} className="text-blue-600 mr-3" />
                Our Location
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600">{officeLocation.address}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Contact</h4>
                  <div className="text-gray-600 space-y-1">
                    <p>Phone: +254 710 437908</p>
                    <p>Email: info@longonotmovers.co.ke</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDirectionsClick}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Icon name="Navigation" size={20} className="mr-2" />
                Get Directions
              </button>
            </div>

            {/* Service Areas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Icon name="Truck" size={24} className="text-blue-600 mr-3" />
                Service Areas
              </h3>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>• Nairobi County</div>
                <div>• Kiambu County</div>
                <div>• Machakos County</div>
                <div>• Kajiado County</div>
                <div>• Mombasa</div>
                <div>• Kisumu</div>
                <div>• Nakuru</div>
                <div>• Eldoret</div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                We provide moving services across Kenya. Contact us for locations not listed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
