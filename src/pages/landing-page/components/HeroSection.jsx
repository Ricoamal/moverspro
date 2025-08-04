import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const slides = [
  {
    id: 1,
    title: 'Professional Moving Services',
    subtitle: 'Stress-free relocation with Kenya\'s most trusted movers.',
    image: '/assets/images/hero/longonot-slider-1.jpg',
    ctas: [
      { text: 'Get Free Quote', action: 'quote', style: 'primary' },
      { text: 'Learn More', action: 'learn', style: 'secondary' },
    ],
  },
  {
    id: 2,
    title: 'Real-Time Tracking',
    subtitle: 'Track your move from door to door. Full transparency, always.',
    image: '/assets/images/hero/longonot-slider-2.png',
    ctas: [
      { text: 'Track Your Move', action: 'track', style: 'primary' },
    ],
  },
  {
    id: 3,
    title: 'Packing & Storage Solutions',
    subtitle: 'We pack. We protect. We store. Safe and sound.',
    image: '/assets/images/hero/longonot-slider-3.png',
    ctas: [
      { text: 'Explore Services', action: 'services', style: 'primary' },
    ],
  },
];

const SLIDE_DURATION = 6000;

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const progressRef = useRef();

  // Auto-play and progress bar
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressRef.current);
          setCurrent((c) => (c + 1) % slides.length);
          return 0;
        }
        return p + 100 / (SLIDE_DURATION / 100);
      });
    }, 100);
    return () => clearInterval(progressRef.current);
  }, [current, paused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % slides.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + slides.length) % slides.length);
      if (e.key === ' ' || e.key === 'Spacebar') setPaused((p) => !p);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Touch/swipe support
  const touchStart = useRef(null);
  const handleTouchStart = (e) => (touchStart.current = e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (diff > 50) setCurrent((c) => (c - 1 + slides.length) % slides.length);
    if (diff < -50) setCurrent((c) => (c + 1) % slides.length);
    touchStart.current = null;
  };

  // CTA actions
  const handleCTA = (action) => {
    if (action === 'quote') navigate('/cost-calculator');
    if (action === 'learn') document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    if (action === 'track') navigate('/track');
    if (action === 'services') navigate('/services');
  };

  // WhatsApp floating icon
  const whatsappUrl = 'https://wa.me/254710437908?text=Hello%20Longonot%20Movers%2C%20I%20need%20help%20with%20my%20move!';

  return (
    <section
      className="relative w-full min-h-[60vh] max-h-[90vh] flex items-center justify-center bg-[#f6f6f6] overflow-hidden"
      style={{ fontFamily: 'Poppins, Montserrat, sans-serif', height: '90vh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{
            background: `linear-gradient(120deg, rgba(0,44,119,0.7) 0%, rgba(238,116,31,0.3) 100%), url(${slide.image}) center/cover no-repeat`,
            filter: idx === current ? 'none' : 'blur(2px) scale(1.05)',
            transition: 'filter 1s, opacity 1s',
          }}
        >
          {/* Parallax/3D effect layer */}
          <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(2px)' }} />
        </div>
      ))}

      {/* Glassmorphic Content Card */}
      <div className="relative z-20 max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl bg-white/30 backdrop-blur-md border border-white/40 flex flex-col items-center text-center mt-8"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Icon name="Shield" className="text-[#002C77]" size={28} />
          <span className="uppercase tracking-widest text-xs font-bold text-[#EE741F]" style={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>
            {slides[current].subtitle}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#002C77] drop-shadow-lg" style={{ fontFamily: 'Poppins, Montserrat, sans-serif' }}>
          {slides[current].title}
        </h1>
        <p className="text-lg md:text-xl text-gray-900 mb-8 font-medium" style={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>
          {slides[current].subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {slides[current].ctas.map((cta, i) => (
            <button
              key={i}
              onClick={() => handleCTA(cta.action)}
              className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all text-lg ${
                cta.style === 'primary'
                  ? 'bg-[#002C77] text-white hover:bg-[#EE741F] hover:text-white'
                  : 'bg-white/70 text-[#002C77] border border-[#002C77] hover:bg-[#EE741F] hover:text-white'
              }`}
              style={{ fontFamily: 'Poppins, Montserrat, sans-serif', minWidth: 160 }}
            >
              {cta.text}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 z-30">
        <div className="h-full bg-[#EE741F] transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-8 z-30 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md text-[#002C77] font-bold text-lg shadow-lg border border-white/40">
        {current + 1} / {slides.length}
      </div>

      {/* Navigation Controls */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/60 hover:bg-[#EE741F] text-[#002C77] hover:text-white p-3 rounded-xl shadow-lg border border-white/40 transition-all"
        aria-label="Previous Slide"
      >
        <Icon name="ChevronLeft" size={28} />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/60 hover:bg-[#EE741F] text-[#002C77] hover:text-white p-3 rounded-xl shadow-lg border border-white/40 transition-all"
        aria-label="Next Slide"
      >
        <Icon name="ChevronRight" size={28} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-4 h-4 rounded-full border-2 border-white/60 shadow-lg transition-all ${
              idx === current ? 'bg-[#002C77] scale-125' : 'bg-white/60 hover:bg-[#EE741F]'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
