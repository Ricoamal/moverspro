import React, { useState } from 'react';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import ImageGalleryManager from './ImageGalleryManager';
import SEOSettings from './SEOSettings';

const EditorToolbar = ({
  leftPanelTab,
  setLeftPanelTab,
  rightPanelTab,
  setRightPanelTab,
  showLeftPanel,
  setShowLeftPanel,
  showRightPanel,
  setShowRightPanel
}) => {
  const {
    currentPage,
    editorMode,
    setEditorMode,
    canUndo,
    canRedo,
    undo,
    redo,
    saveWebsite,
    publishPage,
    unpublishPage,
    hasUnsavedChanges,
    lastSaved,
    loading
  } = useWebsiteBuilder();

  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showSEOSettings, setShowSEOSettings] = useState(false);

  const handleSave = async () => {
    await saveWebsite();
  };

  const handlePublish = async () => {
    if (!currentPage) return;
    
    if (currentPage.status === 'published') {
      await unpublishPage(currentPage.id);
    } else {
      await publishPage(currentPage.id);
    }
  };

  const handlePreview = () => {
    if (currentPage) {
      // Open preview in new tab
      const previewUrl = `/preview/${currentPage.slug}`;
      window.open(previewUrl, '_blank');
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never saved';
    
    const now = new Date();
    const diff = now - lastSaved;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Saved just now';
    if (minutes === 1) return 'Saved 1 minute ago';
    return `Saved ${minutes} minutes ago`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Panel Toggles */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className={showLeftPanel ? 'bg-gray-100' : ''}
            >
              <Icon name="PanelLeft" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={showRightPanel ? 'bg-gray-100' : ''}
            >
              <Icon name="PanelRight" size={16} />
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo"
            >
              <Icon name="Undo" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo"
            >
              <Icon name="Redo" size={16} />
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setEditorMode('edit')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                editorMode === 'edit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon name="Edit" size={14} className="mr-1" />
              Edit
            </button>
            <button
              onClick={() => setEditorMode('preview')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                editorMode === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon name="Eye" size={14} className="mr-1" />
              Preview
            </button>
          </div>
        </div>

        {/* Center Section - Page Info */}
        <div className="flex items-center space-x-4">
          {currentPage && (
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {currentPage.name}
              </div>
              <div className="text-xs text-gray-500">
                {hasUnsavedChanges ? (
                  <span className="text-orange-600">Unsaved changes</span>
                ) : (
                  formatLastSaved()
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Save Status */}
          {hasUnsavedChanges && (
            <div className="flex items-center text-orange-600 text-sm">
              <Icon name="AlertCircle" size={16} className="mr-1" />
              Unsaved
            </div>
          )}

          {/* Action Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageGallery(true)}
          >
            <Icon name="Image" size={16} className="mr-1" />
            Images
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSEOSettings(true)}
            disabled={!currentPage}
          >
            <Icon name="Search" size={16} className="mr-1" />
            SEO
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            disabled={!currentPage}
          >
            <Icon name="ExternalLink" size={16} className="mr-1" />
            Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            loading={loading}
            disabled={!hasUnsavedChanges}
          >
            <Icon name="Save" size={16} className="mr-1" />
            Save
          </Button>

          <Button
            variant={currentPage?.status === 'published' ? 'outline' : 'default'}
            size="sm"
            onClick={handlePublish}
            loading={loading}
            disabled={!currentPage}
          >
            {currentPage?.status === 'published' ? (
              <>
                <Icon name="EyeOff" size={16} className="mr-1" />
                Unpublish
              </>
            ) : (
              <>
                <Icon name="Globe" size={16} className="mr-1" />
                Publish
              </>
            )}
          </Button>

          {/* Settings Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Toggle settings dropdown
              }}
            >
              <Icon name="MoreVertical" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Secondary Toolbar (if needed) */}
      {editorMode === 'edit' && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Icon name="Layers" size={14} className="mr-1" />
              {currentPage?.blocks?.length || 0} blocks
            </div>
            <div className="flex items-center">
              <Icon name="FileText" size={14} className="mr-1" />
              {currentPage?.status || 'draft'}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Keyboard shortcuts:</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Z</kbd>
            <span>Undo</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+S</kbd>
            <span>Save</span>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <ImageGalleryManager onClose={() => setShowImageGallery(false)} />
      )}

      {/* SEO Settings Modal */}
      {showSEOSettings && (
        <SEOSettings onClose={() => setShowSEOSettings(false)} />
      )}
    </div>
  );
};

export default EditorToolbar;
