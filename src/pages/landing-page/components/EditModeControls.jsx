import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EditModeControls = ({ isEditMode, onEditToggle, onNewPage, onPublish }) => {
  return (
    <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-elevated border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        {/* Edit Mode Toggle */}
        <Button
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          iconName={isEditMode ? "Eye" : "Edit"}
          onClick={onEditToggle}
          className={isEditMode ? "bg-primary text-white" : ""}
        >
          {isEditMode ? "Exit Edit" : "Edit Page"}
        </Button>

        {/* New Page Button */}
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          onClick={onNewPage}
          disabled={isEditMode}
          title="Create New Page"
        >
          New Page
        </Button>

        {/* Publish Button */}
        {isEditMode && (
          <Button
            variant="default"
            size="sm"
            iconName="Upload"
            onClick={onPublish}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Publish
          </Button>
        )}
      </div>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Edit Mode Active</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Click on sections to edit content
          </p>
        </div>
      )}
    </div>
  );
};

export default EditModeControls;
