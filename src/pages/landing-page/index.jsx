import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { WebsiteBuilderProvider } from '../../contexts/WebsiteBuilderContext';
import CustomerHeader from '../../components/ui/CustomerHeader';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import TrustSection from './components/TrustSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import EditModeControls from './components/EditModeControls';
import EditorOverlay from './components/EditorOverlay';

const LandingPage = () => {
  const { isAdmin, loading } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditorOverlay, setShowEditorOverlay] = useState(false);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setShowEditorOverlay(true);
    } else {
      setShowEditorOverlay(false);
    }
  };

  // Handle new page creation
  const handleNewPage = () => {
    // TODO: Implement new page creation
    console.log('Creating new page...');
  };

  // Handle publish
  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing changes...');
    setIsEditMode(false);
    setShowEditorOverlay(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <WebsiteBuilderProvider>
      <div className="min-h-screen bg-white relative">
        <CustomerHeader />

        {/* Admin Edit Controls */}
        {isAdmin && (
          <EditModeControls
            isEditMode={isEditMode}
            onEditToggle={handleEditToggle}
            onNewPage={handleNewPage}
            onPublish={handlePublish}
          />
        )}

        {/* Main Content */}
        <main className={`main-content-with-topbar ${isEditMode ? 'edit-mode' : ''}`}>
          <HeroSection isEditMode={isEditMode} />
          <ServicesSection isEditMode={isEditMode} />
          <TrustSection isEditMode={isEditMode} />
          <ContactSection isEditMode={isEditMode} />
        </main>

        <Footer isEditMode={isEditMode} />

        {/* Editor Overlay */}
        {showEditorOverlay && isAdmin && (
          <EditorOverlay
            onClose={() => {
              setShowEditorOverlay(false);
              setIsEditMode(false);
            }}
          />
        )}
      </div>
    </WebsiteBuilderProvider>
  );
};

export default LandingPage;