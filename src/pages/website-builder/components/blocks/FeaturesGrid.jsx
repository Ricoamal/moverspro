import React from 'react';
import Icon from '../../../../components/AppIcon';

const FeaturesGrid = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    title = 'Why Choose Our Moving Services',
    subtitle = 'Kenya\'s premier moving company with unmatched expertise',
    features = [
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

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    handleContentChange('features', updatedFeatures);
  };

  const addFeature = () => {
    const newFeature = {
      icon: 'Star',
      title: 'New Feature',
      description: 'Feature description'
    };
    handleContentChange('features', [...features, newFeature]);
  };

  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    handleContentChange('features', updatedFeatures);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {subtitle && (
            <p
              className={`text-lg text-blue-600 mb-4 ${isEditing ? 'cursor-text' : ''}`}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleContentChange('subtitle', e.target.textContent)}
            >
              {subtitle}
            </p>
          )}
          
          <h2
            className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-6 ${
              isEditing ? 'cursor-text' : ''
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleContentChange('title', e.target.textContent)}
          >
            {title}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative group text-center p-6 rounded-lg hover:shadow-lg transition-shadow ${
                isEditing ? 'border-2 border-dashed border-gray-300' : ''
              }`}
            >
              {/* Delete Button (Editing Mode) */}
              {isEditing && features.length > 1 && (
                <button
                  onClick={() => removeFeature(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="X" size={12} />
                </button>
              )}

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                <Icon name={feature.icon} size={32} />
              </div>

              {/* Title */}
              <h3
                className={`text-xl font-semibold text-gray-900 mb-4 ${
                  isEditing ? 'cursor-text' : ''
                }`}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleFeatureChange(index, 'title', e.target.textContent)}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className={`text-gray-600 leading-relaxed ${isEditing ? 'cursor-text' : ''}`}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleFeatureChange(index, 'description', e.target.textContent)}
              >
                {feature.description}
              </p>

              {/* Icon Selector (Editing Mode) */}
              {isEditing && (
                <div className="mt-4 p-2 bg-gray-50 rounded border">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Icon:
                  </label>
                  <select
                    value={feature.icon}
                    onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Truck">Moving Truck</option>
                    <option value="Shield">Insurance Shield</option>
                    <option value="Clock">On-Time Clock</option>
                    <option value="MapPin">Location Pin</option>
                    <option value="Package">Packing Box</option>
                    <option value="Phone">24/7 Phone</option>
                    <option value="Users">Team Members</option>
                    <option value="Award">Award/Quality</option>
                    <option value="CheckCircle">Verified Check</option>
                    <option value="Heart">Customer Care</option>
                    <option value="Zap">Fast Service</option>
                    <option value="Home">Home Moving</option>
                    <option value="Building">Office Moving</option>
                    <option value="Warehouse">Storage</option>
                    <option value="Star">5-Star Rating</option>
                  </select>
                </div>
              )}
            </div>
          ))}

          {/* Add Feature Button (Editing Mode) */}
          {isEditing && (
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <button
                onClick={addFeature}
                className="flex flex-col items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Plus" size={24} />
                </div>
                <span className="text-sm font-medium">Add Feature</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editing Overlay */}
      {isSelected && isEditing && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
          <div className="text-sm font-medium text-gray-900 mb-2">Features Grid Settings</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div>• Click text to edit content</div>
            <div>• Use dropdown to change icons</div>
            <div>• Click + to add features</div>
            <div>• Click X to remove features</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturesGrid;
