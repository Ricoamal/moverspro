import React from 'react';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Residential Moving', href: '/services' },
      { name: 'Commercial Moving', href: '/services' },
      { name: 'Packing Services', href: '/services' },
      { name: 'Storage Solutions', href: '/services' },
      { name: 'Long Distance', href: '/services' },
      { name: 'Insurance Coverage', href: '/services' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/about' },
      { name: 'Careers', href: '/contact' },
      { name: 'Blog', href: '/help-center' },
      { name: 'Press', href: '/contact' },
      { name: 'Partners', href: '/contact' }
    ],
    support: [
      { name: 'Help Center', href: '/help-center' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Track Your Move', href: '/contact' },
      { name: 'File a Claim', href: '/contact' },
      { name: 'Moving Tips', href: '/moving-tips' },
      { name: 'FAQ', href: '/faq' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Cookie Policy', href: '/privacy-policy' },
      { name: 'Refund Policy', href: '/terms-of-service' },
      { name: 'Licensing', href: '/about' },
      { name: 'Insurance Info', href: '/services' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: 'https://facebook.com/longonotmovers' },
    { name: 'Twitter', icon: 'Twitter', href: 'https://twitter.com/longonotmovers' },
    { name: 'Instagram', icon: 'Instagram', href: 'https://instagram.com/longonotmovers' },
    { name: 'LinkedIn', icon: 'Linkedin', href: 'https://linkedin.com/company/longonotmovers' },
    { name: 'YouTube', icon: 'Youtube', href: 'https://youtube.com/@longonotmovers' }
  ];

  const paymentMethods = [
    { name: 'M-Pesa', icon: 'Smartphone' },
    { name: 'Visa', icon: 'CreditCard' },
    { name: 'Mastercard', icon: 'CreditCard' },
    { name: 'Bank Transfer', icon: 'Building2' }
  ];

  return (
    <footer
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/images/our-work/ourwork (15).jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Enhanced Brown Overlay with Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 opacity-90"></div>
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Main Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/assets/images/logos/longonot-logo-light.png"
                alt="Longonot Movers"
                className="h-12 w-auto"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-amber-600 rounded-lg items-center justify-center shadow-lg hidden">
                <Icon name="Truck" size={24} color="white" />
              </div>
              <span className="text-2xl font-bold text-amber-100">Longonot Movers</span>
            </div>
            
            <p className="text-amber-100 mb-6 leading-relaxed">
              Kenya's most trusted moving company, providing professional relocation services across the country. We make moving simple, safe, and stress-free.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Icon name="Phone" size={18} className="text-amber-400" />
                <span className="text-amber-100">+254 710 437908</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={18} className="text-amber-400" />
                <span className="text-amber-100">info@longonotmovers.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={18} className="text-amber-400" />
                <span className="text-amber-100">Nairobi, Kenya</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-amber-800 bg-opacity-50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors shadow-lg"
                  aria-label={social.name}
                >
                  <Icon name={social.icon} size={20} className="text-amber-100" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-200">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-amber-100 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-200">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-amber-100 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-200">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-amber-100 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-amber-700 border-opacity-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-amber-200">Stay Updated</h3>
              <p className="text-amber-100">
                Get moving tips, special offers, and company updates delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-amber-800 bg-opacity-30 backdrop-blur-sm border border-amber-600 border-opacity-50 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-200"
              />
              <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium transition-colors whitespace-nowrap shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 border-t border-amber-700 border-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-amber-200 text-sm">
              © {currentYear} Longonot Movers. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-amber-200 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">We Accept:</span>
              <div className="flex space-x-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center"
                    title={method.name}
                  >
                    <Icon name={method.icon} size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;