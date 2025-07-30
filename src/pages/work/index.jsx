import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { WebsiteBuilderProvider } from '../../contexts/WebsiteBuilderContext';
import CustomerHeader from '../../components/ui/CustomerHeader';
import EditModeControls from '../landing-page/components/EditModeControls';
import EditorOverlay from '../landing-page/components/EditorOverlay';
import Footer from '../landing-page/components/Footer';
import WorkHero from './components/WorkHero';
import ProjectGallery from './components/ProjectGallery';
import TestimonialsSection from './components/TestimonialsSection';
import CaseStudies from './components/CaseStudies';

const WorkPage = () => {
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
        <title>Our Work - Longonot Movers</title>
        <meta name="description" content="See our completed moving projects, client testimonials, and case studies. Trusted by thousands of families and businesses across Kenya." />
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
          <WorkHero isEditMode={isEditMode} />
          <ProjectGallery isEditMode={isEditMode} />
          <TestimonialsSection isEditMode={isEditMode} />
          <CaseStudies isEditMode={isEditMode} />
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

export default WorkPage;
