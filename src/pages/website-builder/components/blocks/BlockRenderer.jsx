import React from 'react';
import { BlockTypes } from '../../../../types/websiteBuilder';

// Import block components
import HeroBanner from './HeroBanner';
import HeroVideo from './HeroVideo';
import HeroSplit from './HeroSplit';
import HeroMinimal from './HeroMinimal';
import HeroCarousel from './HeroCarousel';
import FeaturesGrid from './FeaturesGrid';
import AboutWithImage from './AboutWithImage';
import ServicesGrid from './ServicesGrid';
import TestimonialsCarousel from './TestimonialsCarousel';
import ContactForm from './ContactForm';

// Block component mapping
const blockComponents = {
  // Heroes
  [BlockTypes.HERO_BANNER]: HeroBanner,
  [BlockTypes.HERO_VIDEO]: HeroVideo,
  [BlockTypes.HERO_SPLIT]: HeroSplit,
  [BlockTypes.HERO_MINIMAL]: HeroMinimal,
  [BlockTypes.HERO_CAROUSEL]: HeroCarousel,

  // Features
  [BlockTypes.FEATURES_GRID]: FeaturesGrid,

  // About
  [BlockTypes.ABOUT_WITH_IMAGE]: AboutWithImage,

  // Services
  [BlockTypes.SERVICES_GRID]: ServicesGrid,

  // Testimonials
  [BlockTypes.TESTIMONIALS_CAROUSEL]: TestimonialsCarousel,

  // Forms
  [BlockTypes.CONTACT_FORM]: ContactForm
};

const BlockRenderer = ({ block, isSelected, isEditing, deviceMode, onUpdate, onSelect }) => {
  const BlockComponent = blockComponents[block.type];

  if (!BlockComponent) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-center">
        <div className="text-red-600 mb-2">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-900 mb-1">Unknown Block Type</h3>
        <p className="text-red-700">Block type "{block.type}" is not supported</p>
      </div>
    );
  }

  // Get device-specific styles
  const deviceStyles = block.styles?.[deviceMode] || {};
  
  // Combine base styles with device-specific styles
  const combinedStyles = {
    ...block.styles?.desktop,
    ...deviceStyles
  };

  return (
    <div
      className={`block-wrapper ${isSelected ? 'block-selected' : ''} ${isEditing ? 'block-editing' : ''}`}
      style={combinedStyles}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(block);
      }}
    >
      <BlockComponent
        block={block}
        content={block.content}
        isSelected={isSelected}
        isEditing={isEditing}
        deviceMode={deviceMode}
        onUpdate={onUpdate}
      />
      
      {/* Block overlay for editing mode */}
      {isEditing && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none" />
      )}
    </div>
  );
};

export default BlockRenderer;
