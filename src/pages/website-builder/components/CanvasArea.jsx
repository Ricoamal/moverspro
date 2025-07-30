import React from 'react';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import BlockRenderer from './blocks/BlockRenderer';
import Icon from '../../../components/AppIcon';

const CanvasArea = () => {
  const {
    currentPage,
    selectedBlock,
    setSelectedBlock,
    editorMode,
    deviceMode,
    showGrid,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    loading
  } = useWebsiteBuilder();

  const {
    getDropZoneProps,
    getDraggableBlockProps,
    isDragging,
    dragOverIndex
  } = useDragAndDrop();

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Page Selected</h3>
          <p className="text-gray-600">Select a page from the page manager to start editing.</p>
        </div>
      </div>
    );
  }

  const handleBlockSelect = (block) => {
    if (editorMode === 'edit') {
      setSelectedBlock(block);
    }
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedBlock(null);
    }
  };

  const handleBlockUpdate = (blockId, updates) => {
    updateBlock(blockId, updates);
  };

  const handleBlockDelete = (blockId) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      deleteBlock(blockId);
    }
  };

  const handleBlockDuplicate = (blockId) => {
    duplicateBlock(blockId);
  };

  const getDeviceFrameClass = () => {
    switch (deviceMode) {
      case 'tablet':
        return 'max-w-3xl mx-auto';
      case 'mobile':
        return 'max-w-sm mx-auto';
      default:
        return 'w-full';
    }
  };

  return (
    <div
      className={`canvas-container min-h-full p-8 ${showGrid ? 'canvas-grid' : ''}`}
      onClick={handleCanvasClick}
    >
      {loading && (
        <div className="editor-loading">
          <div className="flex items-center space-x-2">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )}

      <div className={`device-frame ${deviceMode} ${getDeviceFrameClass()}`}>
        {/* Page Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {currentPage.blocks.length === 0 ? (
            // Empty State
            <div className="min-h-screen flex items-center justify-center">
              <div {...getDropZoneProps(0)} className="text-center p-12">
                <Icon name="Plus" size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Start Building Your Page</h3>
                <p className="text-gray-600 mb-6">
                  Drag blocks from the left panel to start creating your page.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>• Choose from 50+ pre-built blocks</div>
                  <div>• Customize colors, text, and images</div>
                  <div>• Preview on different devices</div>
                </div>
              </div>
            </div>
          ) : (
            // Blocks
            <div className="relative">
              {/* Drop zone at the top */}
              <div {...getDropZoneProps(0)} />

              {currentPage.blocks.map((block, index) => (
                <div key={block.id} className="relative">
                  {/* Block Container */}
                  <div
                    {...getDraggableBlockProps(block, index)}
                    className={`relative ${
                      selectedBlock?.id === block.id ? 'block-selected' : ''
                    } ${editorMode === 'edit' ? 'hover:block-hover' : ''}`}
                  >
                    {/* Block Controls (Editing Mode) */}
                    {editorMode === 'edit' && (
                      <div className="block-controls">
                        <button
                          className="block-control-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockSelect(block);
                          }}
                          title="Select Block"
                        >
                          <Icon name="MousePointer" size={14} />
                        </button>
                        <button
                          className="block-control-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockDuplicate(block.id);
                          }}
                          title="Duplicate Block"
                        >
                          <Icon name="Copy" size={14} />
                        </button>
                        <button
                          className="block-control-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Move up
                            if (index > 0) {
                              // moveBlock would be implemented here
                            }
                          }}
                          title="Move Up"
                          disabled={index === 0}
                        >
                          <Icon name="ChevronUp" size={14} />
                        </button>
                        <button
                          className="block-control-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Move down
                            if (index < currentPage.blocks.length - 1) {
                              // moveBlock would be implemented here
                            }
                          }}
                          title="Move Down"
                          disabled={index === currentPage.blocks.length - 1}
                        >
                          <Icon name="ChevronDown" size={14} />
                        </button>
                        <button
                          className="block-control-btn danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockDelete(block.id);
                          }}
                          title="Delete Block"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    )}

                    {/* Block Renderer */}
                    <BlockRenderer
                      block={block}
                      isSelected={selectedBlock?.id === block.id}
                      isEditing={editorMode === 'edit'}
                      deviceMode={deviceMode}
                      onUpdate={handleBlockUpdate}
                      onSelect={handleBlockSelect}
                    />
                  </div>

                  {/* Drop zone after each block */}
                  <div {...getDropZoneProps(index + 1)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-10 pointer-events-none z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <Icon name="Move" size={20} />
              <span className="font-medium">Drop to add block</span>
            </div>
          </div>
        </div>
      )}

      {/* Device Frame Indicator */}
      {deviceMode !== 'desktop' && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
          {deviceMode === 'tablet' ? 'Tablet View (768px)' : 'Mobile View (375px)'}
        </div>
      )}
    </div>
  );
};

export default CanvasArea;
