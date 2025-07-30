import React from 'react';
import Button from '../../../../components/ui/Button';

const HeroVideo = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    title = 'Professional Moving Services in Kenya',
    subtitle = 'Your Trusted Moving Partner',
    description = 'Experience stress-free relocations with our professional moving team. We handle residential, office, and commercial moves across Kenya with care and precision.',
    videoUrl = '',
    posterImage = '',
    buttons = [
      { text: 'Get Free Quote', link: '/quote', style: 'primary' },
      { text: 'View Our Services', link: '/services', style: 'secondary' }
    ],
    overlay = {
      enabled: true,
      color: '#000000',
      opacity: 0.5
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      {videoUrl ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={posterImage}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: posterImage ? `url(${posterImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
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
                >
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const updatedButtons = [...buttons];
                      updatedButtons[index] = { ...button, text: e.target.textContent };
                      handleContentChange('buttons', updatedButtons);
                    }}
                  >
                    {button.text}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Play/Pause Button */}
      {videoUrl && (
        <button
          className="absolute bottom-8 right-8 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
          onClick={() => {
            const video = document.querySelector('video');
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      )}

      {/* Editing Overlay */}
      {isSelected && isEditing && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
          <div className="text-sm font-medium text-gray-900 mb-2">Video Hero Settings</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div>• Click text to edit content</div>
            <div>• Add video URL in properties</div>
            <div>• Set poster image for loading</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroVideo;
