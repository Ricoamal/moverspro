import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const HeroSplit = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    title = 'Kenya\'s Most Trusted Moving Company',
    subtitle = 'Professional Moving Services',
    description = 'From residential relocations to office moves, we provide comprehensive moving solutions across Kenya. Our experienced team ensures your belongings are handled with utmost care.',
    image = '',
    buttons = [
      { text: 'Get Free Estimate', link: '/quote', style: 'primary' },
      { text: 'Call Now: +254 700 123 456', link: 'tel:+254700123456', style: 'secondary' }
    ],
    features = [
      { icon: 'Shield', text: 'Fully Insured Moves' },
      { icon: 'Clock', text: '24/7 Customer Support' },
      { icon: 'Award', text: '10+ Years Experience' }
    ],
    layout = 'image-right' // image-left, image-right
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

  const textContent = (
    <div className="flex flex-col justify-center">
      {/* Subtitle */}
      {subtitle && (
        <p
          className={`text-lg text-blue-600 mb-4 font-medium ${
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
        className={`text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight ${
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
          className={`text-lg text-gray-600 mb-8 leading-relaxed ${
            isEditing ? 'cursor-text' : ''
          }`}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleContentChange('description', e.target.textContent)}
        >
          {description}
        </p>
      )}

      {/* Features */}
      {features && features.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={feature.icon} size={16} />
                </div>
                <span
                  className={`text-sm font-medium text-gray-700 ${
                    isEditing ? 'cursor-text' : ''
                  }`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const updatedFeatures = [...features];
                    updatedFeatures[index] = { ...feature, text: e.target.textContent };
                    handleContentChange('features', updatedFeatures);
                  }}
                >
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      {buttons && buttons.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant={button.style === 'primary' ? 'default' : 'outline'}
              size="lg"
              className={isEditing ? 'cursor-text' : ''}
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
  );

  const imageContent = (
    <div className="relative">
      {image ? (
        <img
          src={image}
          alt="Moving Services"
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      ) : (
        <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-lg flex items-center justify-center">
          <div className="text-center">
            <Icon name="Truck" size={64} className="text-blue-500 mx-auto mb-4" />
            <p className="text-blue-600 font-medium">Professional Moving Services</p>
            <p className="text-blue-500 text-sm mt-2">Upload your image here</p>
          </div>
        </div>
      )}
      
      {/* Floating Stats */}
      <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">500+</div>
            <div className="text-xs text-gray-600">Happy Clients</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">99%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {layout === 'image-right' ? (
            <>
              <div>{textContent}</div>
              <div>{imageContent}</div>
            </>
          ) : (
            <>
              <div>{imageContent}</div>
              <div>{textContent}</div>
            </>
          )}
        </div>
      </div>

      {/* Editing Overlay */}
      {isSelected && isEditing && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
          <div className="text-sm font-medium text-gray-900 mb-2">Split Hero Settings</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div>• Click text to edit content</div>
            <div>• Upload image in properties</div>
            <div>• Switch layout in properties</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSplit;
