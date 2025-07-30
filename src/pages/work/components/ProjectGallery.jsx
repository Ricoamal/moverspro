import React from 'react';

const ProjectGallery = ({ isEditMode }) => {
  const projects = [
    {
      image: '/assets/images/our-work/ourwork (1).jpg',
      title: 'Luxury Villa Relocation - Karen',
      description: '5-bedroom villa move with premium packing services',
      category: 'Residential',
      duration: '2 days'
    },
    {
      image: '/assets/images/our-work/ourwork (2).jpg',
      title: 'Corporate Headquarters - Westlands',
      description: '200-employee office relocation over weekend',
      category: 'Commercial',
      duration: '3 days'
    },
    {
      image: '/assets/images/our-work/ourwork (3).jpg',
      title: 'Manufacturing Plant - Mombasa',
      description: 'Heavy machinery and equipment relocation',
      category: 'Industrial',
      duration: '5 days'
    },
    {
      image: '/assets/images/our-work/ourwork (4).jpg',
      title: 'Apartment Complex - Kilimani',
      description: 'Multiple unit moves in high-rise building',
      category: 'Residential',
      duration: '1 day'
    },
    {
      image: '/assets/images/our-work/ourwork (5).jpg',
      title: 'Embassy Relocation - Gigiri',
      description: 'Secure diplomatic facility move',
      category: 'Government',
      duration: '4 days'
    },
    {
      image: '/assets/images/our-work/ourwork (6).jpg',
      title: 'International Shipping - Nairobi',
      description: 'Cross-border relocation to Tanzania',
      category: 'International',
      duration: '7 days'
    },
    {
      image: '/assets/images/our-work/ourwork (7).jpg',
      title: 'Family Home Move - Runda',
      description: 'Complete household relocation with storage',
      category: 'Residential',
      duration: '1 day'
    },
    {
      image: '/assets/images/our-work/ourwork (8).jpg',
      title: 'Bank Branch Relocation - CBD',
      description: 'Secure financial institution move',
      category: 'Commercial',
      duration: '2 days'
    },
    {
      image: '/assets/images/our-work/ourwork (9).jpg',
      title: 'Hospital Equipment Move - Kenyatta',
      description: 'Medical equipment and supplies relocation',
      category: 'Healthcare',
      duration: '3 days'
    },
    {
      image: '/assets/images/our-work/ourwork (10).jpg',
      title: 'School Relocation - Muthaiga',
      description: 'Educational facility move during holidays',
      category: 'Educational',
      duration: '4 days'
    },
    {
      image: '/assets/images/our-work/ourwork (11).jpg',
      title: 'Warehouse Distribution - Industrial Area',
      description: 'Large-scale inventory and equipment move',
      category: 'Industrial',
      duration: '6 days'
    },
    {
      image: '/assets/images/our-work/ourwork (12).jpg',
      title: 'Hotel Renovation Move - Nairobi',
      description: 'Temporary furniture and fixture storage',
      category: 'Hospitality',
      duration: '3 days'
    },
    {
      image: '/assets/images/our-work/ourwork (13).jpg',
      title: 'Retail Store Expansion - Sarit Centre',
      description: 'Shop fitting and merchandise relocation',
      category: 'Retail',
      duration: '2 days'
    },
    {
      image: '/assets/images/our-work/ourwork (14).jpg',
      title: 'Art Gallery Move - Museum Hill',
      description: 'Delicate artwork and sculpture transport',
      category: 'Specialty',
      duration: '1 day'
    },
    {
      image: '/assets/images/our-work/ourwork (15).jpg',
      title: 'Tech Startup Office - Kilimani',
      description: 'Modern office setup and IT equipment move',
      category: 'Technology',
      duration: '1 day'
    },
    {
      image: '/assets/images/our-work/ourwork (16).jpg',
      title: 'Restaurant Chain - Multiple Locations',
      description: 'Kitchen equipment and furniture relocation',
      category: 'Food Service',
      duration: '5 days'
    },
    {
      image: '/assets/images/our-work/ourwork (17).jpg',
      title: 'Law Firm Offices - Upper Hill',
      description: 'Confidential document and office move',
      category: 'Legal',
      duration: '2 days'
    },
    {
      image: '/assets/images/our-work/ourwork (18).jpg',
      title: 'Pharmaceutical Warehouse - Athi River',
      description: 'Temperature-controlled medical supplies move',
      category: 'Pharmaceutical',
      duration: '4 days'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Our Portfolio</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Project Gallery</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our recent moving projects across Kenya - from residential homes to corporate offices,
            we handle every move with precision and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {project.duration}
                  </span>
                </div>

                {/* Project Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white rounded-full p-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
