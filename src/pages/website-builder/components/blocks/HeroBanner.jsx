import React from 'react';
import Button from '../../../../components/ui/Button';

const HeroBanner = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    title = 'Kenya\'s Most Trusted Moving Company',
    subtitle = 'Professional • Reliable • Affordable',
    description = 'Experience seamless relocations with our expert moving team. We handle residential, office, and commercial moves across Kenya with unmatched care and precision.',
    backgroundImage = '',
    backgroundVideo = '',
    buttons = [
      { text: 'Get Free Moving Quote', link: '/quote', style: 'primary' },
      { text: 'View Moving Services', link: '/services', style: 'secondary' }
    ],
    overlay = {
      enabled: true,
      color: '#000000',
      opacity: 0.4
    }
  } = content;

  const handleContentChange = (field, value) => {
    if (onUpdate) {
      onUpdate(block.id, {
        content: {
          ...content,
          [field]: value
        }
      });
    }
  };

  const handleButtonChange = (index, field, value) => {
    const updatedButtons = [...buttons];
    updatedButtons[index] = { ...updatedButtons[index], [field]: value };
    handleContentChange('buttons', updatedButtons);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image/Video */}
      {backgroundVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : backgroundImage ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-800" />
      )}

      {/* Overlay */}
      {overlay.enabled && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlay.color,
            opacity: overlay.opacity
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Subtitle */}
          {subtitle && (
            <p
              className={`text-lg sm:text-xl text-blue-200 mb-4 ${
                isEditing ? 'cursor-text' : ''
              }`}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleContentChange('subtitle', e.target.textContent)}
            >
              {subtitle}
            </p>
          )}

          {/* Title */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight ${
              isEditing ? 'cursor-text' : ''
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleContentChange('title', e.target.textContent)}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p
              className={`text-xl text-gray-200 mb-8 max-w-2xl mx-auto ${
                isEditing ? 'cursor-text' : ''
              }`}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleContentChange('description', e.target.textContent)}
            >
              {description}
            </p>
          )}

          {/* Buttons */}
          {buttons && buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.style === 'primary' ? 'default' : 'outline'}
                  size="lg"
                  className={`${
                    button.style === 'primary'
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'border-white text-white hover:bg-white hover:text-blue-600'
                  } ${isEditing ? 'cursor-text' : ''}`}
                  onClick={!isEditing ? () => window.location.href = button.link : undefined}
                >
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleButtonChange(index, 'text', e.target.textContent)}
                  >
                    {button.text}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Quick Image Upload (Editing Mode) */}
      {isSelected && isEditing && !backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
          <div className="bg-white rounded-lg p-6 text-center">
            <Icon name="Image" size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add Background Image</h3>
            <p className="text-gray-600 mb-4">Upload a background image to make this hero section stand out</p>
            <Button
              onClick={() => {
                // This would trigger the property panel image upload
                document.querySelector('[data-property-panel]')?.scrollIntoView();
              }}
            >
              <Icon name="Upload" size={16} className="mr-2" />
              Upload Background
            </Button>
          </div>
        </div>
      )}

      {/* Editing Overlay */}
      {isSelected && isEditing && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
          <div className="text-sm font-medium text-gray-900 mb-2">Hero Banner Settings</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div>• Click text to edit content</div>
            <div>• Use property panel for styling</div>
            <div>• Upload background in properties</div>
            <div>• Adjust overlay opacity for readability</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
