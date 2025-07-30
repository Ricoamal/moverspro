import React from 'react';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import { DeviceTypes } from '../../../types/websiteBuilder';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DevicePreview = () => {
  const { deviceMode, setDeviceMode, editorMode } = useWebsiteBuilder();

  const devices = [
    {
      type: DeviceTypes.DESKTOP,
      name: 'Desktop',
      icon: 'Monitor',
      width: '1200px+',
      description: 'Large screens and desktops'
    },
    {
      type: DeviceTypes.TABLET,
      name: 'Tablet',
      icon: 'Tablet',
      width: '768px',
      description: 'Tablets and small laptops'
    },
    {
      type: DeviceTypes.MOBILE,
      name: 'Mobile',
      icon: 'Smartphone',
      width: '375px',
      description: 'Mobile phones'
    }
  ];

  if (editorMode !== 'edit') {
    return null;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-center">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          {devices.map((device) => (
            <button
              key={device.type}
              onClick={() => setDeviceMode(device.type)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                deviceMode === device.type
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title={`${device.description} (${device.width})`}
            >
              <Icon name={device.icon} size={16} />
              <span>{device.name}</span>
              <span className="text-xs opacity-75">
                {device.width}
              </span>
            </button>
          ))}
        </div>

        {/* Additional Controls */}
        <div className="flex items-center space-x-2 ml-4">
          <div className="w-px h-6 bg-gray-300" />
          
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Zoom out functionality
              }}
              title="Zoom Out"
            >
              <Icon name="ZoomOut" size={16} />
            </Button>
            
            <span className="text-sm text-gray-600 px-2">
              100%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Zoom in functionality
              }}
              title="Zoom In"
            >
              <Icon name="ZoomIn" size={16} />
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Orientation Toggle (for mobile/tablet) */}
          {(deviceMode === DeviceTypes.TABLET || deviceMode === DeviceTypes.MOBILE) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Toggle orientation
              }}
              title="Toggle Orientation"
            >
              <Icon name="RotateCcw" size={16} />
            </Button>
          )}

          {/* Ruler Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Toggle rulers
            }}
            title="Toggle Rulers"
          >
            <Icon name="Ruler" size={16} />
          </Button>
        </div>
      </div>

      {/* Device Info */}
      <div className="flex items-center justify-center mt-2">
        <div className="text-xs text-gray-500">
          {deviceMode === DeviceTypes.DESKTOP && 'Viewing desktop layout (1200px and above)'}
          {deviceMode === DeviceTypes.TABLET && 'Viewing tablet layout (768px - 1199px)'}
          {deviceMode === DeviceTypes.MOBILE && 'Viewing mobile layout (up to 767px)'}
        </div>
      </div>
    </div>
  );
};

export default DevicePreview;
