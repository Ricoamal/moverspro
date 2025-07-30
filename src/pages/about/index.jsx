import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { WebsiteBuilderProvider } from '../../contexts/WebsiteBuilderContext';
import CustomerHeader from '../../components/ui/CustomerHeader';
import EditModeControls from '../landing-page/components/EditModeControls';
import EditorOverlay from '../landing-page/components/EditorOverlay';
import Footer from '../landing-page/components/Footer';
import AboutHero from './components/AboutHero';
import CompanyStory from './components/CompanyStory';
import TeamSection from './components/TeamSection';
import MissionVision from './components/MissionVision';

const AboutPage = () => {
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
        <title>About Us - Longonot Movers</title>
        <meta name="description" content="Learn about Longonot Movers - Kenya's trusted moving company with over 10 years of experience in residential and commercial relocations." />
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
          <AboutHero isEditMode={isEditMode} />
          <CompanyStory isEditMode={isEditMode} />
          <MissionVision isEditMode={isEditMode} />
          <TeamSection isEditMode={isEditMode} />
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

export default AboutPage;
