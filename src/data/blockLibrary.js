import { BlockTypes, BlockCategories } from '../types/websiteBuilder';

// Block Library Configuration - Mover-Oriented with Modern Lucide Icons
export const blockLibrary = [
  // HEADERS
  {
    id: 'header_simple',
    type: BlockTypes.HEADER_SIMPLE,
    category: BlockCategories.HEADERS,
    name: 'Moving Company Header',
    description: 'Professional header with company logo and moving services navigation',
    icon: 'Navigation',
    preview: '/images/blocks/header-simple.jpg',
    tags: ['navigation', 'moving company', 'professional']
  },
  {
    id: 'header_with_cta',
    type: BlockTypes.HEADER_WITH_CTA,
    category: BlockCategories.HEADERS,
    name: 'Header with Quote Button',
    description: 'Header with prominent "Get Free Quote" call-to-action',
    icon: 'Phone',
    preview: '/images/blocks/header-cta.jpg',
    tags: ['quote', 'cta', 'moving services']
  },
  {
    id: 'header_transparent',
    type: BlockTypes.HEADER_TRANSPARENT,
    category: BlockCategories.HEADERS,
    name: 'Overlay Moving Header',
    description: 'Transparent header perfect for moving hero sections',
    icon: 'Eye',
    preview: '/images/blocks/header-transparent.jpg',
    tags: ['overlay', 'hero', 'moving']
  },
  {
    id: 'header_centered',
    type: BlockTypes.HEADER_CENTERED,
    category: BlockCategories.HEADERS,
    name: 'Centered Company Header',
    description: 'Centered moving company logo with service navigation',
    icon: 'AlignCenter',
    preview: '/images/blocks/header-centered.jpg',
    tags: ['centered', 'company logo', 'services']
  },

  // HEROES
  {
    id: 'hero_banner',
    type: BlockTypes.HERO_BANNER,
    category: BlockCategories.HEROES,
    name: 'Moving Services Hero',
    description: 'Powerful hero showcasing your moving services with stunning visuals',
    icon: 'Truck',
    preview: '/images/blocks/hero-banner.jpg',
    tags: ['moving services', 'professional', 'hero', 'cta']
  },
  {
    id: 'hero_video',
    type: BlockTypes.HERO_VIDEO,
    category: BlockCategories.HEROES,
    name: 'Moving Team Video Hero',
    description: 'Showcase your moving team in action with background video',
    icon: 'Play',
    preview: '/images/blocks/hero-video.jpg',
    tags: ['team video', 'moving process', 'professional']
  },
  {
    id: 'hero_split',
    type: BlockTypes.HERO_SPLIT,
    category: BlockCategories.HEROES,
    name: 'Moving Company Split Hero',
    description: 'Split layout featuring your moving services and team photo',
    icon: 'Columns2',
    preview: '/images/blocks/hero-split.jpg',
    tags: ['company profile', 'services', 'team photo']
  },
  {
    id: 'hero_minimal',
    type: BlockTypes.HERO_MINIMAL,
    category: BlockCategories.HEROES,
    name: 'Clean Moving Hero',
    description: 'Minimalist hero focusing on your moving company message',
    icon: 'Minimize2',
    preview: '/images/blocks/hero-minimal.jpg',
    tags: ['minimal', 'professional', 'clean design']
  },
  {
    id: 'hero_carousel',
    type: BlockTypes.HERO_CAROUSEL,
    category: BlockCategories.HEROES,
    name: 'Moving Projects Carousel',
    description: 'Rotating showcase of your successful moving projects',
    icon: 'ChevronRight',
    preview: '/images/blocks/hero-carousel.jpg',
    tags: ['projects', 'portfolio', 'carousel', 'success stories']
  },

  // FEATURES
  {
    id: 'features_grid',
    type: BlockTypes.FEATURES_GRID,
    category: BlockCategories.FEATURES,
    name: 'Moving Services Features',
    description: 'Highlight your key moving services with professional icons',
    icon: 'Grid3x3',
    preview: '/images/blocks/features-grid.jpg',
    tags: ['moving services', 'professional', 'benefits', 'why choose us']
  },
  {
    id: 'features_list',
    type: BlockTypes.FEATURES_LIST,
    category: BlockCategories.FEATURES,
    name: 'Service Benefits List',
    description: 'Detailed list of your moving service advantages',
    icon: 'CheckCircle',
    preview: '/images/blocks/features-list.jpg',
    tags: ['benefits', 'advantages', 'service quality', 'guarantees']
  },
  {
    id: 'features_tabs',
    type: BlockTypes.FEATURES_TABS,
    category: BlockCategories.FEATURES,
    name: 'Moving Service Types',
    description: 'Tabbed showcase of different moving services offered',
    icon: 'Folder',
    preview: '/images/blocks/features-tabs.jpg',
    tags: ['service types', 'residential', 'commercial', 'storage']
  },
  {
    id: 'features_accordion',
    type: BlockTypes.FEATURES_ACCORDION,
    category: BlockCategories.FEATURES,
    name: 'Moving Process Steps',
    description: 'Step-by-step breakdown of your moving process',
    icon: 'ChevronDown',
    preview: '/images/blocks/features-accordion.jpg',
    tags: ['process', 'steps', 'how it works', 'methodology']
  },

  // ABOUT
  {
    id: 'about_simple',
    type: BlockTypes.ABOUT_SIMPLE,
    category: BlockCategories.ABOUT,
    name: 'Our Moving Company Story',
    description: 'Tell your moving company\'s story and mission',
    icon: 'Building2',
    preview: '/images/blocks/about-simple.jpg',
    tags: ['company story', 'mission', 'values', 'history']
  },
  {
    id: 'about_with_image',
    type: BlockTypes.ABOUT_WITH_IMAGE,
    category: BlockCategories.ABOUT,
    name: 'About Us with Team Photo',
    description: 'Company story alongside professional team photo',
    icon: 'Users',
    preview: '/images/blocks/about-image.jpg',
    tags: ['team photo', 'company profile', 'professional', 'trust']
  },
  {
    id: 'about_timeline',
    type: BlockTypes.ABOUT_TIMELINE,
    category: BlockCategories.ABOUT,
    name: 'Company Milestones',
    description: 'Showcase your moving company\'s growth and achievements',
    icon: 'TrendingUp',
    preview: '/images/blocks/about-timeline.jpg',
    tags: ['milestones', 'growth', 'achievements', 'company history']
  },
  {
    id: 'about_stats',
    type: BlockTypes.ABOUT_STATS,
    category: BlockCategories.ABOUT,
    name: 'Moving Success Statistics',
    description: 'Display impressive moving statistics and achievements',
    icon: 'BarChart3',
    preview: '/images/blocks/about-stats.jpg',
    tags: ['statistics', 'success rate', 'happy customers', 'moves completed']
  },

  // SERVICES
  {
    id: 'services_grid',
    type: BlockTypes.SERVICES_GRID,
    category: BlockCategories.SERVICES,
    name: 'Moving Services Grid',
    description: 'Showcase all your moving services in an organized grid',
    icon: 'LayoutGrid',
    preview: '/images/blocks/services-grid.jpg',
    tags: ['residential moving', 'office relocation', 'storage', 'packing']
  },
  {
    id: 'services_carousel',
    type: BlockTypes.SERVICES_CAROUSEL,
    category: BlockCategories.SERVICES,
    name: 'Service Showcase Slider',
    description: 'Interactive carousel highlighting your key moving services',
    icon: 'ArrowRight',
    preview: '/images/blocks/services-carousel.jpg',
    tags: ['service showcase', 'interactive', 'moving types', 'specialties']
  },
  {
    id: 'services_list',
    type: BlockTypes.SERVICES_LIST,
    category: BlockCategories.SERVICES,
    name: 'Detailed Service List',
    description: 'Comprehensive list of all moving services with descriptions',
    icon: 'ClipboardList',
    preview: '/images/blocks/services-list.jpg',
    tags: ['comprehensive', 'detailed', 'service descriptions', 'what we do']
  },
  {
    id: 'services_pricing',
    type: BlockTypes.SERVICES_PRICING,
    category: BlockCategories.SERVICES,
    name: 'Moving Service Packages',
    description: 'Display moving packages with transparent pricing',
    icon: 'CreditCard',
    preview: '/images/blocks/services-pricing.jpg',
    tags: ['pricing packages', 'transparent costs', 'service tiers', 'estimates']
  },

  // TESTIMONIALS
  {
    id: 'testimonials_grid',
    type: BlockTypes.TESTIMONIALS_GRID,
    category: BlockCategories.TESTIMONIALS,
    name: 'Customer Success Stories',
    description: 'Grid of happy customer testimonials and reviews',
    icon: 'MessageCircle',
    preview: '/images/blocks/testimonials-grid.jpg',
    tags: ['customer reviews', 'success stories', 'happy clients', 'trust']
  },
  {
    id: 'testimonials_carousel',
    type: BlockTypes.TESTIMONIALS_CAROUSEL,
    category: BlockCategories.TESTIMONIALS,
    name: 'Moving Reviews Slider',
    description: 'Rotating showcase of customer moving experiences',
    icon: 'ChevronRight',
    preview: '/images/blocks/testimonials-carousel.jpg',
    tags: ['customer experiences', 'moving reviews', 'satisfaction', 'feedback']
  },
  {
    id: 'testimonials_single',
    type: BlockTypes.TESTIMONIALS_SINGLE,
    category: BlockCategories.TESTIMONIALS,
    name: 'Featured Customer Review',
    description: 'Highlight your best customer testimonial',
    icon: 'Quote',
    preview: '/images/blocks/testimonials-single.jpg',
    tags: ['featured review', 'best testimonial', 'customer highlight', 'trust builder']
  },

  // GALLERIES
  {
    id: 'gallery_grid',
    type: BlockTypes.GALLERY_GRID,
    category: BlockCategories.GALLERIES,
    name: 'Photo Grid',
    description: 'Grid layout photo gallery',
    icon: 'Grid',
    preview: '/images/blocks/gallery-grid.jpg',
    tags: ['gallery', 'photos', 'grid', 'images']
  },
  {
    id: 'gallery_masonry',
    type: BlockTypes.GALLERY_MASONRY,
    category: BlockCategories.GALLERIES,
    name: 'Masonry Gallery',
    description: 'Pinterest-style masonry layout',
    icon: 'Layout',
    preview: '/images/blocks/gallery-masonry.jpg',
    tags: ['gallery', 'masonry', 'pinterest', 'varied']
  },
  {
    id: 'gallery_carousel',
    type: BlockTypes.GALLERY_CAROUSEL,
    category: BlockCategories.GALLERIES,
    name: 'Gallery Carousel',
    description: 'Sliding image carousel',
    icon: 'RotateCcw',
    preview: '/images/blocks/gallery-carousel.jpg',
    tags: ['gallery', 'carousel', 'slider', 'images']
  },
  {
    id: 'gallery_lightbox',
    type: BlockTypes.GALLERY_LIGHTBOX,
    category: BlockCategories.GALLERIES,
    name: 'Lightbox Gallery',
    description: 'Gallery with popup lightbox',
    icon: 'Maximize',
    preview: '/images/blocks/gallery-lightbox.jpg',
    tags: ['gallery', 'lightbox', 'popup', 'fullscreen']
  },

  // FORMS
  {
    id: 'contact_form',
    type: BlockTypes.CONTACT_FORM,
    category: BlockCategories.FORMS,
    name: 'Moving Quote Form',
    description: 'Comprehensive form for moving quote requests',
    icon: 'FileText',
    preview: '/images/blocks/contact-form.jpg',
    tags: ['quote request', 'moving estimate', 'contact', 'inquiry']
  },
  {
    id: 'quote_form',
    type: BlockTypes.QUOTE_FORM,
    category: BlockCategories.FORMS,
    name: 'Instant Moving Quote',
    description: 'Quick quote calculator for moving services',
    icon: 'Calculator',
    preview: '/images/blocks/quote-form.jpg',
    tags: ['instant quote', 'price calculator', 'moving cost', 'estimate']
  },
  {
    id: 'newsletter_form',
    type: BlockTypes.NEWSLETTER_FORM,
    category: BlockCategories.FORMS,
    name: 'Moving Tips Newsletter',
    description: 'Subscribe for moving tips and company updates',
    icon: 'Mail',
    preview: '/images/blocks/newsletter-form.jpg',
    tags: ['moving tips', 'newsletter', 'updates', 'subscription']
  },
  {
    id: 'booking_form',
    type: BlockTypes.BOOKING_FORM,
    category: BlockCategories.FORMS,
    name: 'Schedule Your Move',
    description: 'Book your moving date and time slot',
    icon: 'Calendar',
    preview: '/images/blocks/booking-form.jpg',
    tags: ['schedule move', 'book appointment', 'moving date', 'time slot']
  },

  // CONTENT
  {
    id: 'text_block',
    type: BlockTypes.TEXT_BLOCK,
    category: BlockCategories.CONTENT,
    name: 'Text Block',
    description: 'Rich text content block',
    icon: 'Type',
    preview: '/images/blocks/text-block.jpg',
    tags: ['text', 'content', 'paragraph', 'rich']
  },
  {
    id: 'image_block',
    type: BlockTypes.IMAGE_BLOCK,
    category: BlockCategories.CONTENT,
    name: 'Image Block',
    description: 'Single image with caption',
    icon: 'Image',
    preview: '/images/blocks/image-block.jpg',
    tags: ['image', 'photo', 'caption', 'visual']
  },
  {
    id: 'video_block',
    type: BlockTypes.VIDEO_BLOCK,
    category: BlockCategories.CONTENT,
    name: 'Video Block',
    description: 'Embedded video player',
    icon: 'Video',
    preview: '/images/blocks/video-block.jpg',
    tags: ['video', 'embed', 'youtube', 'player']
  },
  {
    id: 'divider',
    type: BlockTypes.DIVIDER,
    category: BlockCategories.CONTENT,
    name: 'Divider',
    description: 'Section divider line',
    icon: 'Minus',
    preview: '/images/blocks/divider.jpg',
    tags: ['divider', 'separator', 'line', 'break']
  },
  {
    id: 'spacer',
    type: BlockTypes.SPACER,
    category: BlockCategories.CONTENT,
    name: 'Spacer',
    description: 'Adjustable spacing block',
    icon: 'Move',
    preview: '/images/blocks/spacer.jpg',
    tags: ['spacer', 'spacing', 'gap', 'margin']
  },

  // CTA
  {
    id: 'cta_banner',
    type: BlockTypes.CTA_BANNER,
    category: BlockCategories.CTA,
    name: 'CTA Banner',
    description: 'Full-width call-to-action banner',
    icon: 'Megaphone',
    preview: '/images/blocks/cta-banner.jpg',
    tags: ['cta', 'banner', 'action', 'conversion']
  },
  {
    id: 'cta_button',
    type: BlockTypes.CTA_BUTTON,
    category: BlockCategories.CTA,
    name: 'CTA Button',
    description: 'Standalone call-to-action button',
    icon: 'MousePointer',
    preview: '/images/blocks/cta-button.jpg',
    tags: ['cta', 'button', 'action', 'click']
  },
  {
    id: 'cta_popup',
    type: BlockTypes.CTA_POPUP,
    category: BlockCategories.CTA,
    name: 'CTA Popup',
    description: 'Popup call-to-action modal',
    icon: 'Square',
    preview: '/images/blocks/cta-popup.jpg',
    tags: ['cta', 'popup', 'modal', 'overlay']
  },

  // FOOTERS
  {
    id: 'footer_simple',
    type: BlockTypes.FOOTER_SIMPLE,
    category: BlockCategories.FOOTERS,
    name: 'Simple Footer',
    description: 'Basic footer with links',
    icon: 'Layout',
    preview: '/images/blocks/footer-simple.jpg',
    tags: ['footer', 'links', 'copyright', 'simple']
  },
  {
    id: 'footer_detailed',
    type: BlockTypes.FOOTER_DETAILED,
    category: BlockCategories.FOOTERS,
    name: 'Detailed Footer',
    description: 'Multi-column footer with contact info',
    icon: 'Layout',
    preview: '/images/blocks/footer-detailed.jpg',
    tags: ['footer', 'detailed', 'columns', 'contact']
  },
  {
    id: 'footer_minimal',
    type: BlockTypes.FOOTER_MINIMAL,
    category: BlockCategories.FOOTERS,
    name: 'Minimal Footer',
    description: 'Clean, minimal footer design',
    icon: 'Layout',
    preview: '/images/blocks/footer-minimal.jpg',
    tags: ['footer', 'minimal', 'clean', 'simple']
  }
];

// Group blocks by category
export const blocksByCategory = blockLibrary.reduce((acc, block) => {
  if (!acc[block.category]) {
    acc[block.category] = [];
  }
  acc[block.category].push(block);
  return acc;
}, {});

// Get block by type
export const getBlockByType = (type) => {
  return blockLibrary.find(block => block.type === type);
};

// Search blocks
export const searchBlocks = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return blockLibrary.filter(block => 
    block.name.toLowerCase().includes(lowercaseQuery) ||
    block.description.toLowerCase().includes(lowercaseQuery) ||
    block.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Get popular blocks (most commonly used)
export const getPopularBlocks = () => {
  return [
    'hero_banner',
    'features_grid',
    'about_with_image',
    'services_grid',
    'testimonials_carousel',
    'contact_form',
    'cta_banner',
    'footer_detailed'
  ].map(id => blockLibrary.find(block => block.id === id)).filter(Boolean);
};

export default blockLibrary;
