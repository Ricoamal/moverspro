import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import websiteBuilderService from '../services/websiteBuilderService';
import { DeviceTypes, EditorSettings } from '../types/websiteBuilder';

const WebsiteBuilderContext = createContext();

export const useWebsiteBuilder = () => {
  const context = useContext(WebsiteBuilderContext);
  if (!context) {
    throw new Error('useWebsiteBuilder must be used within a WebsiteBuilderProvider');
  }
  return context;
};

export const WebsiteBuilderProvider = ({ children }) => {
  // Core State
  const [website, setWebsite] = useState(websiteBuilderService.website);
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Editor State
  const [editorMode, setEditorMode] = useState('edit'); // edit, preview
  const [deviceMode, setDeviceMode] = useState(DeviceTypes.DESKTOP);
  const [showGrid, setShowGrid] = useState(EditorSettings.showGrid);
  const [snapToGrid, setSnapToGrid] = useState(EditorSettings.snapToGrid);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);

  // History State
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Auto-save
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Initialize
  useEffect(() => {
    if (website.pages.length > 0 && !currentPage) {
      setCurrentPage(website.pages[0]);
    }
  }, [website, currentPage]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && EditorSettings.autoSave) {
      const timer = setTimeout(() => {
        saveWebsite();
      }, EditorSettings.autoSaveInterval);

      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges]);

  // Update history state
  const updateHistoryState = useCallback(() => {
    setCanUndo(websiteBuilderService.historyIndex >= 0);
    setCanRedo(websiteBuilderService.historyIndex < websiteBuilderService.history.length - 1);
  }, []);

  // Website Management
  const saveWebsite = useCallback(async () => {
    setLoading(true);
    try {
      const success = websiteBuilderService.saveWebsite();
      if (success) {
        setWebsite({ ...websiteBuilderService.website });
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        setError(null);
      } else {
        throw new Error('Failed to save website');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWebsiteSettings = useCallback(async (settings) => {
    setLoading(true);
    try {
      websiteBuilderService.website.globalSettings = {
        ...websiteBuilderService.website.globalSettings,
        ...settings
      };
      await saveWebsite();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [saveWebsite]);

  // Page Management
  const createPage = useCallback(async (name, slug) => {
    setLoading(true);
    try {
      const page = websiteBuilderService.addPage(name, slug);
      setWebsite({ ...websiteBuilderService.website });
      setCurrentPage(page);
      setHasUnsavedChanges(true);
      return page;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePage = useCallback(async (pageId, updates) => {
    setLoading(true);
    try {
      const updatedPage = websiteBuilderService.updatePage(pageId, updates);
      if (updatedPage) {
        setWebsite({ ...websiteBuilderService.website });
        if (currentPage && currentPage.id === pageId) {
          setCurrentPage(updatedPage);
        }
        setHasUnsavedChanges(true);
      }
      return updatedPage;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const deletePage = useCallback(async (pageId) => {
    setLoading(true);
    try {
      const success = websiteBuilderService.deletePage(pageId);
      if (success) {
        setWebsite({ ...websiteBuilderService.website });
        if (currentPage && currentPage.id === pageId) {
          setCurrentPage(websiteBuilderService.website.pages[0] || null);
        }
        setHasUnsavedChanges(true);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const switchPage = useCallback((pageId) => {
    const page = websiteBuilderService.getPage(pageId);
    if (page) {
      setCurrentPage(page);
      setSelectedBlock(null);
    }
  }, []);

  // Block Management
  const addBlock = useCallback(async (blockType, category, position = -1) => {
    if (!currentPage) return null;

    setLoading(true);
    try {
      const block = websiteBuilderService.addBlockToPage(currentPage.id, blockType, category, position);
      if (block) {
        setWebsite({ ...websiteBuilderService.website });
        setCurrentPage(websiteBuilderService.getPage(currentPage.id));
        setSelectedBlock(block);
        setHasUnsavedChanges(true);
        updateHistoryState();
      }
      return block;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentPage, updateHistoryState]);

  const updateBlock = useCallback(async (blockId, updates) => {
    if (!currentPage) return null;

    try {
      const updatedBlock = websiteBuilderService.updateBlock(currentPage.id, blockId, updates);
      if (updatedBlock) {
        setWebsite({ ...websiteBuilderService.website });
        setCurrentPage(websiteBuilderService.getPage(currentPage.id));
        if (selectedBlock && selectedBlock.id === blockId) {
          setSelectedBlock(updatedBlock);
        }
        setHasUnsavedChanges(true);
        updateHistoryState();
      }
      return updatedBlock;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [currentPage, selectedBlock, updateHistoryState]);

  const deleteBlock = useCallback(async (blockId) => {
    if (!currentPage) return false;

    setLoading(true);
    try {
      const success = websiteBuilderService.deleteBlock(currentPage.id, blockId);
      if (success) {
        setWebsite({ ...websiteBuilderService.website });
        setCurrentPage(websiteBuilderService.getPage(currentPage.id));
        if (selectedBlock && selectedBlock.id === blockId) {
          setSelectedBlock(null);
        }
        setHasUnsavedChanges(true);
        updateHistoryState();
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedBlock, updateHistoryState]);

  const moveBlock = useCallback(async (blockId, newPosition) => {
    if (!currentPage) return false;

    try {
      const success = websiteBuilderService.moveBlock(currentPage.id, blockId, newPosition);
      if (success) {
        setWebsite({ ...websiteBuilderService.website });
        setCurrentPage(websiteBuilderService.getPage(currentPage.id));
        setHasUnsavedChanges(true);
        updateHistoryState();
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [currentPage, updateHistoryState]);

  const duplicateBlock = useCallback(async (blockId) => {
    if (!currentPage) return null;

    setLoading(true);
    try {
      const duplicatedBlock = websiteBuilderService.duplicateBlock(currentPage.id, blockId);
      if (duplicatedBlock) {
        setWebsite({ ...websiteBuilderService.website });
        setCurrentPage(websiteBuilderService.getPage(currentPage.id));
        setSelectedBlock(duplicatedBlock);
        setHasUnsavedChanges(true);
        updateHistoryState();
      }
      return duplicatedBlock;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentPage, updateHistoryState]);

  // History Management
  const undo = useCallback(() => {
    const success = websiteBuilderService.undo();
    if (success) {
      setWebsite({ ...websiteBuilderService.website });
      setCurrentPage(websiteBuilderService.getPage(currentPage.id));
      setHasUnsavedChanges(true);
      updateHistoryState();
    }
    return success;
  }, [currentPage, updateHistoryState]);

  const redo = useCallback(() => {
    const success = websiteBuilderService.redo();
    if (success) {
      setWebsite({ ...websiteBuilderService.website });
      setCurrentPage(websiteBuilderService.getPage(currentPage.id));
      setHasUnsavedChanges(true);
      updateHistoryState();
    }
    return success;
  }, [currentPage, updateHistoryState]);

  // Publishing
  const publishPage = useCallback(async (pageId) => {
    setLoading(true);
    try {
      const success = websiteBuilderService.publishPage(pageId);
      if (success) {
        setWebsite({ ...websiteBuilderService.website });
        if (currentPage && currentPage.id === pageId) {
          setCurrentPage(websiteBuilderService.getPage(pageId));
        }
        await saveWebsite();
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentPage, saveWebsite]);

  const unpublishPage = useCallback(async (pageId) => {
    setLoading(true);
    try {
      const success = websiteBuilderService.unpublishPage(pageId);
      if (success) {
        setWebsite({ ...websiteBuilderService.website });
        if (currentPage && currentPage.id === pageId) {
          setCurrentPage(websiteBuilderService.getPage(pageId));
        }
        await saveWebsite();
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentPage, saveWebsite]);

  const value = {
    // Core State
    website,
    currentPage,
    selectedBlock,
    loading,
    error,

    // Editor State
    editorMode,
    deviceMode,
    showGrid,
    snapToGrid,
    isDragging,
    draggedBlock,

    // History State
    canUndo,
    canRedo,

    // Auto-save State
    hasUnsavedChanges,
    lastSaved,

    // Website Management
    saveWebsite,
    updateWebsiteSettings,

    // Page Management
    createPage,
    updatePage,
    deletePage,
    switchPage,

    // Block Management
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    duplicateBlock,

    // Selection
    setSelectedBlock,

    // Editor Controls
    setEditorMode,
    setDeviceMode,
    setShowGrid,
    setSnapToGrid,
    setIsDragging,
    setDraggedBlock,

    // History
    undo,
    redo,

    // Publishing
    publishPage,
    unpublishPage,

    // Utility
    setError
  };

  return (
    <WebsiteBuilderContext.Provider value={value}>
      {children}
    </WebsiteBuilderContext.Provider>
  );
};

export default WebsiteBuilderContext;
