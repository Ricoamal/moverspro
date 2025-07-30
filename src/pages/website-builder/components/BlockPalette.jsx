import React, { useState, useMemo } from 'react';
import { blocksByCategory, getPopularBlocks, searchBlocks } from '../../../data/blockLibrary';
import { BlockCategories } from '../../../types/websiteBuilder';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const BlockPalette = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const { getPaletteItemProps } = useDragAndDrop();

  // Category options
  const categoryOptions = [
    { key: 'popular', label: 'Popular', icon: 'Star' },
    { key: BlockCategories.HEADERS, label: 'Headers', icon: 'Layout' },
    { key: BlockCategories.HEROES, label: 'Heroes', icon: 'Image' },
    { key: BlockCategories.FEATURES, label: 'Features', icon: 'Grid' },
    { key: BlockCategories.ABOUT, label: 'About', icon: 'FileText' },
    { key: BlockCategories.SERVICES, label: 'Services', icon: 'Briefcase' },
    { key: BlockCategories.TESTIMONIALS, label: 'Testimonials', icon: 'MessageSquare' },
    { key: BlockCategories.GALLERIES, label: 'Galleries', icon: 'Image' },
    { key: BlockCategories.FORMS, label: 'Forms', icon: 'Mail' },
    { key: BlockCategories.CONTENT, label: 'Content', icon: 'Type' },
    { key: BlockCategories.CTA, label: 'Call to Action', icon: 'Megaphone' },
    { key: BlockCategories.FOOTERS, label: 'Footers', icon: 'Layout' }
  ];

  // Get blocks to display
  const blocksToDisplay = useMemo(() => {
    if (searchQuery) {
      return searchBlocks(searchQuery);
    }
    
    if (selectedCategory === 'popular') {
      return getPopularBlocks();
    }
    
    return blocksByCategory[selectedCategory] || [];
  }, [searchQuery, selectedCategory]);

  const handleBlockClick = (block) => {
    // For mobile/touch devices, add block directly on click
    if ('ontouchstart' in window) {
      // This would trigger adding the block to the canvas
      console.log('Add block:', block.type);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <Input
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={setSearchQuery}
          icon="Search"
        />
      </div>

      {/* Categories */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {categoryOptions.map((category) => (
            <button
              key={category.key}
              onClick={() => {
                setSelectedCategory(category.key);
                setSearchQuery('');
              }}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.key
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon name={category.icon} size={16} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {blocksToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try a different search term' : 'No blocks in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {blocksToDisplay.map((block) => (
              <div
                key={block.id}
                {...getPaletteItemProps(block.type, block.category)}
                onClick={() => handleBlockClick(block)}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none"
                style={{ touchAction: 'none' }}
              >
                {/* Block Preview */}
                <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                  {block.preview ? (
                    <img
                      src={block.preview}
                      alt={block.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <Icon name={block.icon} size={32} className="text-gray-400" />
                  </div>
                </div>

                {/* Block Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {block.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {block.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {block.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {block.tags.length > 3 && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        +{block.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Drag Indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full p-1 shadow-sm border border-gray-200">
                    <Icon name="Move" size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">How to use blocks:</p>
            <ul className="space-y-1 text-xs">
              <li>• Drag blocks to the canvas to add them</li>
              <li>• Click on blocks in the canvas to edit</li>
              <li>• Use the property panel to customize</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockPalette;
