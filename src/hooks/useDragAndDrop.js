import { useState, useCallback, useRef } from 'react';
import { useWebsiteBuilder } from '../contexts/WebsiteBuilderContext';

export const useDragAndDrop = () => {
  const {
    currentPage,
    addBlock,
    moveBlock,
    setIsDragging,
    setDraggedBlock,
    isDragging,
    draggedBlock
  } = useWebsiteBuilder();

  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const dragCounter = useRef(0);

  // Handle drag start from block palette
  const handleDragStart = useCallback((e, blockType, category) => {
    const dragData = {
      type: 'NEW_BLOCK',
      blockType,
      category
    };
    
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    
    setIsDragging(true);
    setDraggedBlock({ type: blockType, category });
  }, [setIsDragging, setDraggedBlock]);

  // Handle drag start from existing block
  const handleBlockDragStart = useCallback((e, block, index) => {
    const dragData = {
      type: 'EXISTING_BLOCK',
      blockId: block.id,
      sourceIndex: index
    };
    
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    setIsDragging(true);
    setDraggedBlock({ ...block, sourceIndex: index });
  }, [setIsDragging, setDraggedBlock]);

  // Handle drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle drag enter
  const handleDragEnter = useCallback((e, index) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(index);
    setDropZoneActive(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    dragCounter.current--;
    
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
      setDropZoneActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(async (e, dropIndex) => {
    e.preventDefault();
    dragCounter.current = 0;
    
    try {
      const dragDataString = e.dataTransfer.getData('text/plain');
      const dragData = JSON.parse(dragDataString);
      
      if (dragData.type === 'NEW_BLOCK') {
        // Adding new block from palette
        await addBlock(dragData.blockType, dragData.category, dropIndex);
      } else if (dragData.type === 'EXISTING_BLOCK') {
        // Moving existing block
        if (dragData.sourceIndex !== dropIndex) {
          await moveBlock(dragData.blockId, dropIndex);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    } finally {
      setIsDragging(false);
      setDraggedBlock(null);
      setDragOverIndex(null);
      setDropZoneActive(false);
    }
  }, [addBlock, moveBlock, setIsDragging, setDraggedBlock]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedBlock(null);
    setDragOverIndex(null);
    setDropZoneActive(false);
    dragCounter.current = 0;
  }, [setIsDragging, setDraggedBlock]);

  // Get drop zone props
  const getDropZoneProps = useCallback((index) => ({
    onDragOver: handleDragOver,
    onDragEnter: (e) => handleDragEnter(e, index),
    onDragLeave: handleDragLeave,
    onDrop: (e) => handleDrop(e, index),
    className: `drop-zone ${dragOverIndex === index ? 'drag-over' : ''} ${dropZoneActive ? 'active' : ''}`
  }), [handleDragOver, handleDragEnter, handleDragLeave, handleDrop, dragOverIndex, dropZoneActive]);

  // Get draggable block props
  const getDraggableBlockProps = useCallback((block, index) => ({
    draggable: true,
    onDragStart: (e) => handleBlockDragStart(e, block, index),
    onDragEnd: handleDragEnd,
    className: `draggable-block ${isDragging && draggedBlock?.id === block.id ? 'dragging' : ''}`
  }), [handleBlockDragStart, handleDragEnd, isDragging, draggedBlock]);

  // Get palette item props
  const getPaletteItemProps = useCallback((blockType, category) => ({
    draggable: true,
    onDragStart: (e) => handleDragStart(e, blockType, category),
    onDragEnd: handleDragEnd,
    className: `palette-item ${isDragging && draggedBlock?.type === blockType ? 'dragging' : ''}`
  }), [handleDragStart, handleDragEnd, isDragging, draggedBlock]);

  return {
    // State
    isDragging,
    draggedBlock,
    dragOverIndex,
    dropZoneActive,

    // Handlers
    handleDragStart,
    handleBlockDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,

    // Prop getters
    getDropZoneProps,
    getDraggableBlockProps,
    getPaletteItemProps
  };
};

export default useDragAndDrop;
