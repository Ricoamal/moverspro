import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';
import Toggle from './Toggle';

const SERVICES = [
  { name: 'Local & Residential Moving', href: '/services#local' },
  { name: 'Office & Corporate Relocation', href: '/services#office' },
  { name: 'International Moving', href: '/services#international' },
  { name: 'Storage & Warehousing', href: '/services#storage' },
  { name: 'Packing & Unpacking Services', href: '/services#packing' },
];

const NAV = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services', dropdown: true },
  { name: 'Our Work', href: '/our-work' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const location = useLocation();
  const servicesRef = useRef();

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isServicesOpen) return;
    const handler = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isServicesOpen]);

  return (
    <header className={`w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-xl' : ''} md:fixed md:top-0 md:left-0 md:bg-white/70 md:backdrop-blur-xl`}
    style={{
      background: !window.matchMedia('(min-width: 768px)').matches ? 'transparent' : 'rgba(255,255,255,0.7)',
      backdropFilter: window.matchMedia('(min-width: 768px)').matches ? 'blur(16px)' : undefined,
      WebkitBackdropFilter: window.matchMedia('(min-width: 768px)').matches ? 'blur(16px)' : undefined,
    }}
  >
      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center px-6 py-1 text-xs bg-[#392732] text-white font-medium tracking-wide">
        <a href="tel:+254710437908" className="flex items-center gap-1 hover:text-[#EE741F] transition-colors">
          <Icon name="Phone" size={16} /> +254 710 437908
        </a>
        <div className="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#1877F3] transition-colors"><Icon name="Facebook" size={16} /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#E4405F] transition-colors"><Icon name="Instagram" size={16} /></a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-black transition-colors"><Icon name="TikTok" size={16} /></a>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`relative flex items-center justify-between px-8 md:px-20 py-2 transition-all duration-300 ${scrolled ? 'bg-white/80' : 'bg-white/60'} backdrop-blur-xl`}
        style={{ boxShadow: scrolled ? '0 4px 24px 0 rgba(31,38,135,0.13)' : undefined }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/images/logos/longonot-logo.png" alt="Longonot Movers Logo" className="h-10 w-auto drop-shadow-lg" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-6 xl:gap-8 font-semibold text-base" style={{ fontFamily: 'Poppins, Montserrat, sans-serif' }}>
          {NAV.map((item) =>
            item.dropdown ? (
              <div key={item.name} className="relative" ref={servicesRef}>
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-[#222] hover:bg-[#EE741F]/10 hover:text-[#EE741F] focus:outline-none ${location.pathname.startsWith('/services') ? 'text-[#EE741F] font-bold' : ''}`}
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                  onClick={() => setIsServicesOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={isServicesOpen}
                  tabIndex={0}
                >
                  {item.name}
                  <Icon name="ChevronDown" size={18} className={`transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 mt-2 w-64 rounded-xl shadow-2xl bg-white/90 dark:bg-[#23232b]/95 ring-1 ring-black/10 backdrop-blur-xl overflow-hidden z-30"
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                    >
                      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                        {SERVICES.map((srv) => (
                          <li key={srv.name}>
                            <Link
                              to={srv.href}
                              className="block px-6 py-4 hover:bg-[#EE741F]/10 hover:text-white text-[#EE741F] font-bold transition-colors"
                            >
                              {srv.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-lg transition-all duration-200 text-[#222] hover:bg-[#EE741F]/10 hover:text-[#EE741F] ${location.pathname === item.href ? 'text-[#EE741F] font-bold' : ''}`}
              >
                {item.name}
              </Link>
            )
          )}
          <Link
            to="/cost-calculator"
            className="ml-4 px-5 py-2 rounded-full font-bold bg-[#EE741F] text-white hover:bg-[#002C77] transition-all text-base shadow-lg"
          >
            Cost Calculator
          </Link>
          {!isAuthenticated && (
            <Link
              to="/login"
              aria-label="Login"
              className="ml-2 bg-[#EE741F] text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#d96a1a] transition-colors"
            >
              <Icon name="User" size={22} />
            </Link>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="ml-2 bg-[#EE741F] text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#d96a1a] transition-colors"
            >
              <Icon name="LogOut" size={22} />
            </button>
          )}
        </nav>

        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg bg-[#002C77] text-white hover:bg-[#EE741F] transition-all focus:outline-none"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Open menu"
        >
          <Icon name={isMenuOpen ? 'X' : 'Menu'} size={28} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Overlay */}
            
            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white dark:bg-[#18181b] shadow-2xl flex flex-col py-8 px-6 gap-6">
              {/* Logo & Close */}
              <div className="flex items-center justify-between mb-4">
                <img src="/assets/images/logos/longonot-logo.png" alt="Longonot Movers Logo" className="h-8 w-auto" />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <Icon name="X" size={24} />
                </button>
              </div>
              {/* Nav Items */}
              <nav className="flex flex-col gap-2 font-semibold text-lg">
                {NAV.filter(item => !item.dropdown).map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-2 py-2 rounded-lg hover:bg-[#EE741F]/10 text-[#EE741F] font-bold ${location.pathname === item.href ? 'font-extrabold underline' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Services dropdown */}
                <div className="flex flex-col">
                  <button
                    className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-[#EE741F]/10 text-[#EE741F] font-bold focus:outline-none"
                    onClick={() => setIsMobileServicesOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={isMobileServicesOpen}
                  >
                    <span>Services</span>
                    <Icon name="ChevronDown" size={20} className={`transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''} text-[#222]`} />
                  </button>
                  <AnimatePresence>
                    {isMobileServicesOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden flex flex-col gap-1 pl-4 mt-1"
                      >
                        {SERVICES.map((srv) => (
                          <li key={srv.name}>
                            <Link
                              to={srv.href}
                              className="block px-3 py-2 rounded-lg hover:bg-[#EE741F]/10 text-[#EE741F] font-bold transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {srv.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
              <Link
                to="/cost-calculator"
                className="mt-6 w-full text-center px-5 py-3 rounded-full font-bold bg-[#EE741F] text-white hover:bg-[#002C77] transition-all text-base shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Cost Calculator
              </Link>

              <div className="flex items-center gap-4 mt-8 justify-center">
                {!isAuthenticated && (
                  <>
                    <a href="/login" aria-label="Login" className="bg-[#EE741F] text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#d96a1a] transition-colors">
                      <Icon name="User" size={22} />
                    </a>
                    <a href="/login#register" aria-label="Register" className="bg-[#002C77] text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#0056b3] transition-colors">
                      <Icon name="UserPlus" size={22} />
                    </a>
                  </>
                )}
                {isAuthenticated && (
                  <button onClick={handleLogout} aria-label="Logout" className="bg-[#EE741F] text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#d96a1a] transition-colors">
                    <Icon name="LogOut" size={22} />
                  </button>
                )}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="bg-[#EE741F] text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#1877F3] transition-colors"><Icon name="Facebook" size={18} /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-[#EE741F] text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E4405F] transition-colors"><Icon name="Instagram" size={18} /></a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="bg-[#EE741F] text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-black transition-colors"><Icon name="TikTok" size={18} /></a>
              </div>
              <div className="w-full flex justify-center mt-8 mb-2">
                <a href="tel:+254710437908" aria-label="Call" className="bg-[#EE741F] text-white flex items-center justify-center w-12 h-12 rounded-full hover:bg-[#d96a1a] transition-colors">
  <Icon name="Phone" size={26} />
</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
