import React, { useState } from 'react';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import BlockPalette from '../../website-builder/components/BlockPalette';
import PropertyPanel from '../../website-builder/components/PropertyPanel';
import DevicePreview from '../../website-builder/components/DevicePreview';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EditorOverlay = ({ onClose }) => {
  const [leftPanelTab, setLeftPanelTab] = useState('blocks');
  const [rightPanelTab, setRightPanelTab] = useState('properties');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  
  const {
    selectedBlock,
    deviceMode,
    setDeviceMode,
    canUndo,
    canRedo,
    undo,
    redo,
    saveWebsite
  } = useWebsiteBuilder();

  const handleSave = async () => {
    try {
      await saveWebsite();
      // Show success message
      console.log('Website saved successfully');
    } catch (error) {
      console.error('Error saving website:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="absolute inset-0 flex">
        {/* Left Panel */}
        {showLeftPanel && (
          <div className="w-80 bg-white border-r border-gray-200 shadow-lg">
            {/* Panel Header */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
              <div className="flex space-x-1">
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    leftPanelTab === 'blocks'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setLeftPanelTab('blocks')}
                >
                  Blocks
                </button>
              </div>
              
              <button
                onClick={() => setShowLeftPanel(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
            </div>

            {/* Panel Content */}
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              {leftPanelTab === 'blocks' && <BlockPalette />}
            </div>
          </div>
        )}

        {/* Center Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              {/* Panel Toggles */}
              {!showLeftPanel && (
                <button
                  onClick={() => setShowLeftPanel(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Show Blocks Panel"
                >
                  <Icon name="ChevronRight" size={16} />
                </button>
              )}

              {/* Undo/Redo */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Undo"
                >
                  <Icon name="Undo" size={16} />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Redo"
                >
                  <Icon name="Redo" size={16} />
                </button>
              </div>
            </div>

            {/* Center Controls */}
            <div className="flex items-center space-x-2">
              <DevicePreview />
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Save"
                onClick={handleSave}
              >
                Save
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="X"
                onClick={onClose}
              >
                Close Editor
              </Button>

              {!showRightPanel && (
                <button
                  onClick={() => setShowRightPanel(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Show Properties Panel"
                >
                  <Icon name="ChevronLeft" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-gray-100 p-4 overflow-auto">
            <div className="text-center text-gray-500">
              <Icon name="MousePointer" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Editor Active</p>
              <p className="text-sm">
                The page content is now editable. Use the blocks panel to add new content,
                or click on existing sections to modify them.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {showRightPanel && (
          <div className="w-80 bg-white border-l border-gray-200 shadow-lg">
            {/* Panel Header */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="ChevronRight" size={16} />
              </button>
              
              <div className="flex space-x-1">
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    rightPanelTab === 'properties'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setRightPanelTab('properties')}
                >
                  Properties
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              {rightPanelTab === 'properties' && (
                <PropertyPanel selectedBlock={selectedBlock} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorOverlay;
