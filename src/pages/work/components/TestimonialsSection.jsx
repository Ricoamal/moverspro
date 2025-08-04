import React from 'react';
import Icon from '../../../components/AppIcon';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Mary Njeri',
      location: 'Nairobi',
      rating: 5,
      text: 'Exceptional service! The team was professional, careful with our belongings, and completed the move ahead of schedule.'
    },
    {
      name: 'James Mwangi',
      location: 'Mombasa',
      rating: 5,
      text: 'Best moving company in Kenya. They handled our office relocation seamlessly with zero downtime.'
    },
    {
      name: 'Grace Akinyi',
      location: 'Kisumu',
      rating: 5,
      text: 'Highly recommend Longonot Movers. Fair pricing, excellent service, and very reliable team.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
