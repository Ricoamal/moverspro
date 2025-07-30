// Website Builder Types and Models

// Block Categories
export const BlockCategories = {
  HEADERS: 'headers',
  HEROES: 'heroes',
  FEATURES: 'features',
  ABOUT: 'about',
  SERVICES: 'services',
  TESTIMONIALS: 'testimonials',
  GALLERIES: 'galleries',
  FORMS: 'forms',
  FOOTERS: 'footers',
  CONTENT: 'content',
  PRICING: 'pricing',
  TEAM: 'team',
  STATS: 'stats',
  CTA: 'cta',
  BLOG: 'blog',
  CONTACT: 'contact',
  SOCIAL: 'social',
  NAVIGATION: 'navigation',
  MEDIA: 'media',
  ECOMMERCE: 'ecommerce'
};

// Block Types
export const BlockTypes = {
  // Headers
  HEADER_SIMPLE: 'header_simple',
  HEADER_WITH_CTA: 'header_with_cta',
  HEADER_TRANSPARENT: 'header_transparent',
  HEADER_CENTERED: 'header_centered',
  
  // Heroes
  HERO_BANNER: 'hero_banner',
  HERO_VIDEO: 'hero_video',
  HERO_SPLIT: 'hero_split',
  HERO_MINIMAL: 'hero_minimal',
  HERO_CAROUSEL: 'hero_carousel',
  
  // Features
  FEATURES_GRID: 'features_grid',
  FEATURES_LIST: 'features_list',
  FEATURES_TABS: 'features_tabs',
  FEATURES_ACCORDION: 'features_accordion',
  
  // About
  ABOUT_SIMPLE: 'about_simple',
  ABOUT_WITH_IMAGE: 'about_with_image',
  ABOUT_TIMELINE: 'about_timeline',
  ABOUT_STATS: 'about_stats',
  
  // Services
  SERVICES_GRID: 'services_grid',
  SERVICES_CAROUSEL: 'services_carousel',
  SERVICES_LIST: 'services_list',
  SERVICES_PRICING: 'services_pricing',
  
  // Testimonials
  TESTIMONIALS_GRID: 'testimonials_grid',
  TESTIMONIALS_CAROUSEL: 'testimonials_carousel',
  TESTIMONIALS_SINGLE: 'testimonials_single',
  
  // Galleries
  GALLERY_GRID: 'gallery_grid',
  GALLERY_MASONRY: 'gallery_masonry',
  GALLERY_CAROUSEL: 'gallery_carousel',
  GALLERY_LIGHTBOX: 'gallery_lightbox',
  
  // Forms
  CONTACT_FORM: 'contact_form',
  QUOTE_FORM: 'quote_form',
  NEWSLETTER_FORM: 'newsletter_form',
  BOOKING_FORM: 'booking_form',
  
  // Content
  TEXT_BLOCK: 'text_block',
  IMAGE_BLOCK: 'image_block',
  VIDEO_BLOCK: 'video_block',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  
  // CTA
  CTA_BANNER: 'cta_banner',
  CTA_BUTTON: 'cta_button',
  CTA_POPUP: 'cta_popup',
  
  // Footers
  FOOTER_SIMPLE: 'footer_simple',
  FOOTER_DETAILED: 'footer_detailed',
  FOOTER_MINIMAL: 'footer_minimal'
};

// Device Types for Responsive Design
export const DeviceTypes = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile'
};

// Page Status
export const PageStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// Animation Types
export const AnimationTypes = {
  NONE: 'none',
  FADE_IN: 'fadeIn',
  SLIDE_UP: 'slideUp',
  SLIDE_DOWN: 'slideDown',
  SLIDE_LEFT: 'slideLeft',
  SLIDE_RIGHT: 'slideRight',
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut',
  BOUNCE: 'bounce',
  PULSE: 'pulse'
};

// Block Schema
export const createBlockSchema = (type, category) => ({
  id: null, // Will be generated
  type,
  category,
  name: '',
  content: {},
  styles: {
    desktop: {},
    tablet: {},
    mobile: {}
  },
  settings: {
    animation: AnimationTypes.NONE,
    animationDelay: 0,
    animationDuration: 1000,
    visible: true,
    customCSS: '',
    customJS: ''
  },
  position: 0,
  createdAt: null,
  updatedAt: null
});

// Page Schema
export const createPageSchema = () => ({
  id: null,
  name: '',
  slug: '',
  title: '',
  description: '',
  keywords: '',
  status: PageStatus.DRAFT,
  blocks: [],
  settings: {
    layout: 'default',
    theme: 'default',
    customCSS: '',
    customJS: '',
    seo: {
      title: '',
      description: '',
      keywords: '',
      ogImage: '',
      canonical: ''
    }
  },
  createdAt: null,
  updatedAt: null,
  publishedAt: null
});

// Website Schema
export const createWebsiteSchema = () => ({
  id: null,
  name: 'MoveEase Pro Website',
  domain: '',
  pages: [],
  globalSettings: {
    branding: {
      logo: '',
      favicon: '',
      colors: {
        primary: '#1E40AF',
        secondary: '#64748B',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1F2937'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      }
    },
    navigation: {
      style: 'horizontal',
      position: 'top',
      sticky: true,
      items: []
    },
    footer: {
      copyright: '',
      links: [],
      social: []
    },
    analytics: {
      googleAnalytics: '',
      facebookPixel: '',
      customCode: ''
    }
  },
  createdAt: null,
  updatedAt: null
});

// Block Content Schemas - Mover-Oriented Content
export const BlockContentSchemas = {
  [BlockTypes.HERO_BANNER]: {
    title: 'Kenya\'s Most Trusted Moving Company',
    subtitle: 'Professional • Reliable • Affordable',
    description: 'Experience seamless relocations with our expert moving team. We handle residential, office, and commercial moves across Kenya with unmatched care and precision.',
    backgroundImage: '',
    backgroundVideo: '',
    buttons: [
      { text: 'Get Free Moving Quote', link: '/quote', style: 'primary' },
      { text: 'View Moving Services', link: '/services', style: 'secondary' }
    ],
    overlay: {
      enabled: true,
      color: '#000000',
      opacity: 0.4
    }
  },

  [BlockTypes.FEATURES_GRID]: {
    title: 'Why Choose Our Moving Services',
    subtitle: 'Kenya\'s premier moving company with unmatched expertise',
    features: [
      {
        icon: 'Truck',
        title: 'Professional Moving Team',
        description: 'Certified and experienced movers trained in safe handling techniques'
      },
      {
        icon: 'Shield',
        title: 'Fully Insured Moves',
        description: 'Comprehensive insurance coverage for complete peace of mind'
      },
      {
        icon: 'Clock',
        title: 'Punctual Service',
        description: 'On-time arrivals and efficient moving process every time'
      },
      {
        icon: 'MapPin',
        title: 'Kenya-Wide Coverage',
        description: 'Serving all major cities and towns across Kenya'
      },
      {
        icon: 'Package',
        title: 'Safe Packing',
        description: 'Professional packing materials and techniques for fragile items'
      },
      {
        icon: 'Phone',
        title: '24/7 Support',
        description: 'Round-the-clock customer support for your moving needs'
      }
    ]
  },
  
  [BlockTypes.CONTACT_FORM]: {
    title: 'Get Your Free Moving Quote Today',
    subtitle: 'Complete the form below and receive a detailed moving estimate within 2 hours',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'moveType', label: 'Type of Move', type: 'select', required: true, options: ['Residential Move', 'Office Relocation', 'Commercial Move', 'Storage Services', 'Packing Services', 'Long Distance Move'] },
      { name: 'moveDate', label: 'Preferred Moving Date', type: 'date', required: true },
      { name: 'fromLocation', label: 'Moving From (City/Area)', type: 'text', required: true },
      { name: 'toLocation', label: 'Moving To (City/Area)', type: 'text', required: true },
      { name: 'homeSize', label: 'Home/Office Size', type: 'select', required: false, options: ['Studio/1BR', '2-3 Bedrooms', '4+ Bedrooms', 'Small Office', 'Large Office', 'Warehouse'] },
      { name: 'specialItems', label: 'Special Items (Piano, Art, etc.)', type: 'textarea', required: false }
    ],
    submitButton: {
      text: 'Get My Moving Quote',
      style: 'primary'
    },
    successMessage: 'Thank you! Our moving consultant will contact you within 2 hours with your personalized quote.',
    errorMessage: 'Sorry, there was an error submitting your request. Please call us directly at +254 700 123 456.'
  }
};

// Responsive Breakpoints
export const Breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

// Editor Settings
export const EditorSettings = {
  gridSize: 12,
  snapToGrid: true,
  showGrid: false,
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  undoLimit: 50,
  previewModes: [DeviceTypes.DESKTOP, DeviceTypes.TABLET, DeviceTypes.MOBILE]
};

export default {
  BlockCategories,
  BlockTypes,
  DeviceTypes,
  PageStatus,
  AnimationTypes,
  createBlockSchema,
  createPageSchema,
  createWebsiteSchema,
  BlockContentSchemas,
  Breakpoints,
  EditorSettings
};
