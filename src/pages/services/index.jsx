import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { WebsiteBuilderProvider } from '../../contexts/WebsiteBuilderContext';
import CustomerHeader from '../../components/ui/CustomerHeader';
import EditModeControls from '../landing-page/components/EditModeControls';
import EditorOverlay from '../landing-page/components/EditorOverlay';
import Footer from '../landing-page/components/Footer';
import ServicesHero from './components/ServicesHero';
import ServicesList from './components/ServicesList';
import PricingSection from './components/PricingSection';

const ServicesPage = () => {
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [showEditorOverlay, setShowEditorOverlay] = React.useState(false);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setShowEditorOverlay(true);
    } else {
      setShowEditorOverlay(false);
    }
  };

  const handleNewPage = () => {
    console.log('Creating new page...');
  };

  const handlePublish = () => {
    console.log('Publishing changes...');
    setIsEditMode(false);
    setShowEditorOverlay(false);
  };

  return (
    <WebsiteBuilderProvider>
      <Helmet>
        <title>Our Services - Longonot Movers</title>
        <meta name="description" content="Professional moving services in Kenya - residential, commercial, office relocations, packing, storage and more. Get your free quote today." />
      </Helmet>

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
          <ServicesHero isEditMode={isEditMode} />
          <ServicesList isEditMode={isEditMode} />
          <PricingSection isEditMode={isEditMode} />
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

export default ServicesPage;
