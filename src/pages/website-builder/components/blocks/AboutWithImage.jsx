import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const AboutWithImage = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    title = 'About MoveEase Pro',
    subtitle = 'Your Trusted Moving Partner Since 2010',
    description = 'With over a decade of experience in the moving industry, MoveEase Pro has established itself as Kenya\'s most reliable moving company. Our team of professional movers is dedicated to making your relocation experience smooth, safe, and stress-free.',
    image = '',
    features = [
      { icon: 'Award', text: '10+ Years Experience' },
      { icon: 'Users', text: '500+ Happy Customers' },
      { icon: 'Truck', text: 'Modern Fleet of Vehicles' },
      { icon: 'Shield', text: 'Fully Licensed & Insured' }
    ],
    buttons = [
      { text: 'Learn More About Us', link: '/about', style: 'primary' },
      { text: 'View Our Services', link: '/services', style: 'outline' }
    ],
    layout = 'image-right', // image-left, image-right
    stats = [
      { number: '500+', label: 'Successful Moves' },
      { number: '10+', label: 'Years Experience' },
      { number: '99%', label: 'Customer Satisfaction' }
    ]
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
      <h2
        className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight ${
          isEditing ? 'cursor-text' : ''
        }`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => handleContentChange('title', e.target.textContent)}
      >
        {title}
      </h2>

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
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={feature.icon} size={20} />
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

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-2xl font-bold text-blue-600 ${
                    isEditing ? 'cursor-text' : ''
                  }`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const updatedStats = [...stats];
                    updatedStats[index] = { ...stat, number: e.target.textContent };
                    handleContentChange('stats', updatedStats);
                  }}
                >
                  {stat.number}
                </div>
                <div
                  className={`text-sm text-gray-600 ${
                    isEditing ? 'cursor-text' : ''
                  }`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const updatedStats = [...stats];
                    updatedStats[index] = { ...stat, label: e.target.textContent };
                    handleContentChange('stats', updatedStats);
                  }}
                >
                  {stat.label}
                </div>
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
        <div className="relative">
          <img
            src={image}
            alt="About MoveEase Pro"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          {/* Overlay Badge */}
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            <div className="text-lg font-bold">10+</div>
            <div className="text-xs">Years Experience</div>
          </div>
        </div>
      ) : (
        <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-lg flex items-center justify-center">
          <div className="text-center">
            <Icon name="Users" size={64} className="text-blue-500 mx-auto mb-4" />
            <p className="text-blue-600 font-medium">Professional Moving Team</p>
            <p className="text-blue-500 text-sm mt-2">Upload your team photo here</p>
          </div>
        </div>
      )}
      
      {/* Floating Achievement Badge */}
      <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <Icon name="Award" size={24} />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">Award Winner</div>
            <div className="text-sm text-gray-600">Best Moving Company 2023</div>
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
          <div className="text-sm font-medium text-gray-900 mb-2">About Section Settings</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div>• Click text to edit content</div>
            <div>• Upload team photo in properties</div>
            <div>• Edit stats and features</div>
            <div>• Switch layout in properties</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutWithImage;
