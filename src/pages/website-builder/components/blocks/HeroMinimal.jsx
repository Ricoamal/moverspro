import React from 'react';
import Button from '../../../../components/ui/Button';

const HeroMinimal = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    title = 'Seamless Moving Experience',
    subtitle = 'Professional • Reliable • Affordable',
    description = 'Transform your moving experience with Kenya\'s premier moving company. We make relocations simple, safe, and stress-free.',
    buttons = [
      { text: 'Start Your Move', link: '/quote', style: 'primary' }
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

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {subtitle && (
          <p
            className={`text-sm uppercase tracking-wider text-blue-600 font-semibold mb-6 ${
              isEditing ? 'cursor-text' : ''
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleContentChange('subtitle', e.target.textContent)}
          >
            {subtitle}
          </p>
        )}

        <h1
          className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight ${
            isEditing ? 'cursor-text' : ''
          }`}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleContentChange('title', e.target.textContent)}
        >
          {title}
        </h1>

        {description && (
          <p
            className={`text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed ${
              isEditing ? 'cursor-text' : ''
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleContentChange('description', e.target.textContent)}
          >
            {description}
          </p>
        )}

        {buttons && buttons.length > 0 && (
          <div className="flex justify-center">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.style === 'primary' ? 'default' : 'outline'}
                size="lg"
                className={`px-8 py-4 text-lg ${isEditing ? 'cursor-text' : ''}`}
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
    </section>
  );
};

export default HeroMinimal;
