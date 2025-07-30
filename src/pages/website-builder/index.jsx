import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/ui/AdminSidebar';
import { WebsiteBuilderProvider } from '../../contexts/WebsiteBuilderContext';
import EditorToolbar from './components/EditorToolbar';
import BlockPalette from './components/BlockPalette';
import CanvasArea from './components/CanvasArea';
import PropertyPanel from './components/PropertyPanel';
import PageManager from './components/PageManager';
import DevicePreview from './components/DevicePreview';

const WebsiteBuilder = () => {
  const [leftPanelTab, setLeftPanelTab] = useState('blocks'); // blocks, pages
  const [rightPanelTab, setRightPanelTab] = useState('properties'); // properties, settings
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  return (
    <WebsiteBuilderProvider>
      <Helmet>
        <title>Website Builder - MoveEase Pro</title>
        <meta name="description" content="Drag and drop website builder for creating custom landing pages and marketing sites" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor Toolbar */}
            <EditorToolbar
              leftPanelTab={leftPanelTab}
              setLeftPanelTab={setLeftPanelTab}
              rightPanelTab={rightPanelTab}
              setRightPanelTab={setRightPanelTab}
              showLeftPanel={showLeftPanel}
              setShowLeftPanel={setShowLeftPanel}
              showRightPanel={showRightPanel}
              setShowRightPanel={setShowRightPanel}
            />

            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel */}
              {showLeftPanel && (
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                  {/* Panel Tabs */}
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setLeftPanelTab('blocks')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        leftPanelTab === 'blocks'
                          ? 'text-primary border-b-2 border-primary bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Blocks
                    </button>
                    <button
                      onClick={() => setLeftPanelTab('pages')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        leftPanelTab === 'pages'
                          ? 'text-primary border-b-2 border-primary bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Pages
                    </button>
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-hidden">
                    {leftPanelTab === 'blocks' && <BlockPalette />}
                    {leftPanelTab === 'pages' && <PageManager />}
                  </div>
                </div>
              )}

              {/* Main Canvas Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Device Preview Controls */}
                <DevicePreview />
                
                {/* Canvas */}
                <div className="flex-1 overflow-auto bg-gray-100">
                  <CanvasArea />
                </div>
              </div>

              {/* Right Panel */}
              {showRightPanel && (
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                  {/* Panel Tabs */}
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setRightPanelTab('properties')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        rightPanelTab === 'properties'
                          ? 'text-primary border-b-2 border-primary bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Properties
                    </button>
                    <button
                      onClick={() => setRightPanelTab('settings')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        rightPanelTab === 'settings'
                          ? 'text-primary border-b-2 border-primary bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Settings
                    </button>
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-hidden">
                    {rightPanelTab === 'properties' && <PropertyPanel />}
                    {rightPanelTab === 'settings' && (
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Page Settings</h3>
                        <p className="text-gray-600">Page settings panel will be implemented here.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drag and Drop Styles */}
      <style jsx>{`
        .drop-zone {
          min-height: 4px;
          transition: all 0.2s ease;
        }
        
        .drop-zone.active {
          background-color: #dbeafe;
          border: 2px dashed #3b82f6;
          min-height: 40px;
          margin: 8px 0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .drop-zone.drag-over {
          background-color: #bfdbfe;
          border-color: #1d4ed8;
        }
        
        .drop-zone.active::after {
          content: 'Drop block here';
          color: #3b82f6;
          font-size: 14px;
          font-weight: 500;
        }
        
        .draggable-block {
          transition: all 0.2s ease;
          cursor: move;
        }
        
        .draggable-block:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .draggable-block.dragging {
          opacity: 0.5;
          transform: rotate(5deg);
        }
        
        .palette-item {
          transition: all 0.2s ease;
          cursor: grab;
        }
        
        .palette-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .palette-item.dragging {
          opacity: 0.7;
          transform: scale(0.95);
        }
        
        .palette-item:active {
          cursor: grabbing;
        }
        
        .block-selected {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        .block-hover {
          outline: 1px solid #93c5fd;
          outline-offset: 1px;
        }
        
        .canvas-grid {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .device-frame {
          transition: all 0.3s ease;
        }
        
        .device-frame.desktop {
          max-width: none;
        }
        
        .device-frame.tablet {
          max-width: 768px;
          margin: 0 auto;
        }
        
        .device-frame.mobile {
          max-width: 375px;
          margin: 0 auto;
        }
        
        .editor-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
        }
        
        .block-controls {
          position: absolute;
          top: -40px;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 4px;
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 10;
        }
        
        .draggable-block:hover .block-controls {
          opacity: 1;
        }
        
        .block-control-btn {
          padding: 4px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }
        
        .block-control-btn:hover {
          background-color: #f3f4f6;
        }
        
        .block-control-btn.danger:hover {
          background-color: #fef2f2;
          color: #dc2626;
        }
      `}</style>
    </WebsiteBuilderProvider>
  );
};

export default WebsiteBuilder;
