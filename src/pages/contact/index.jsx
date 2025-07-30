import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { WebsiteBuilderProvider } from '../../contexts/WebsiteBuilderContext';
import CustomerHeader from '../../components/ui/CustomerHeader';
import EditModeControls from '../landing-page/components/EditModeControls';
import EditorOverlay from '../landing-page/components/EditorOverlay';
import Footer from '../landing-page/components/Footer';
import ContactHero from './components/ContactHero';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import LocationMap from './components/LocationMap';

const ContactPage = () => {
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
        <title>Contact Us - Longonot Movers</title>
        <meta name="description" content="Get in touch with Longonot Movers for your moving needs. Call us, email us, or visit our offices in Nairobi. Free quotes available." />
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
          <ContactHero isEditMode={isEditMode} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <ContactForm isEditMode={isEditMode} />
            <ContactInfo isEditMode={isEditMode} />
          </div>
          <LocationMap isEditMode={isEditMode} />
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

export default ContactPage;
