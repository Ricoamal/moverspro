import { useState, useCallback, useRef } from 'react';
import { useWebsiteBuilder } from '../contexts/WebsiteBuilderContext';

// Helper function to create custom drag image
const createDragImage = (sourceElement, blockType) => {
  const dragImage = document.createElement('div');
  dragImage.style.position = 'absolute';
  dragImage.style.top = '-1000px';
  dragImage.style.left = '-1000px';
  dragImage.style.width = '200px';
  dragImage.style.height = '60px';
  dragImage.style.backgroundColor = '#3b82f6';
  dragImage.style.color = 'white';
  dragImage.style.borderRadius = '8px';
  dragImage.style.display = 'flex';
  dragImage.style.alignItems = 'center';
  dragImage.style.justifyContent = 'center';
  dragImage.style.fontSize = '14px';
  dragImage.style.fontWeight = '500';
  dragImage.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  dragImage.style.opacity = '0.9';
  dragImage.style.zIndex = '9999';
  dragImage.style.pointerEvents = 'none';

  // Add block type text
  dragImage.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="9" y1="9" x2="15" y2="9"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
      <span>${blockType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
    </div>
  `;

  document.body.appendChild(dragImage);
  return dragImage;
};

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
  const touchStartPos = useRef({ x: 0, y: 0 });
  const touchDragThreshold = 10; // pixels

  // Handle drag start from block palette
  const handleDragStart = useCallback((e, blockType, category, blockElement) => {
    // Prevent default browser drag behavior
    e.stopPropagation();

    const dragData = {
      type: 'NEW_BLOCK',
      blockType,
      category
    };

    // Set drag data
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';

    // Create custom drag image
    if (blockElement) {
      const dragImage = createDragImage(blockElement, blockType);
      e.dataTransfer.setDragImage(dragImage, 50, 25);

      // Clean up drag image after a short delay
      setTimeout(() => {
        if (dragImage.parentNode) {
          dragImage.parentNode.removeChild(dragImage);
        }
      }, 0);
    }

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.classList.add('dragging-active');

    setIsDragging(true);
    setDraggedBlock({ type: blockType, category });
  }, [setIsDragging, setDraggedBlock]);

  // Handle drag start from existing block
  const handleBlockDragStart = useCallback((e, block, index) => {
    // Prevent default browser drag behavior
    e.stopPropagation();

    const dragData = {
      type: 'EXISTING_BLOCK',
      blockId: block.id,
      sourceIndex: index
    };

    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';

    // Create custom drag image for existing block
    const dragImage = createDragImage(e.currentTarget, `Move ${block.type}`);
    e.dataTransfer.setDragImage(dragImage, 50, 25);

    // Clean up drag image after a short delay
    setTimeout(() => {
      if (dragImage.parentNode) {
        dragImage.parentNode.removeChild(dragImage);
      }
    }, 0);

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.classList.add('dragging-active');

    setIsDragging(true);
    setDraggedBlock({ ...block, sourceIndex: index });
  }, [setIsDragging, setDraggedBlock]);

  // Handle drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle drag enter
  const handleDragEnter = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setDragOverIndex(index);
    setDropZoneActive(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setDragOverIndex(null);
      setDropZoneActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(async (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
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
      // Restore text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.classList.remove('dragging-active');

      setIsDragging(false);
      setDraggedBlock(null);
      setDragOverIndex(null);
      setDropZoneActive(false);
    }
  }, [addBlock, moveBlock, setIsDragging, setDraggedBlock]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    // Restore text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.classList.remove('dragging-active');

    setIsDragging(false);
    setDraggedBlock(null);
    setDragOverIndex(null);
    setDropZoneActive(false);
    dragCounter.current = 0;
  }, [setIsDragging, setDraggedBlock]);

  // Touch event handlers for mobile support
  const handleTouchStart = useCallback((e, blockType, category) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = useCallback((e, blockType, category) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

    // Start drag if moved beyond threshold
    if (deltaX > touchDragThreshold || deltaY > touchDragThreshold) {
      // Simulate drag start for touch devices
      setIsDragging(true);
      setDraggedBlock({ type: blockType, category });
      document.body.classList.add('dragging-active');
    }
  }, [setIsDragging, setDraggedBlock, touchDragThreshold]);

  const handleTouchEnd = useCallback(async (e, blockType, category) => {
    if (isDragging) {
      // Find drop zone under touch point
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = elementBelow?.closest('[data-drop-zone]');

      if (dropZone) {
        const dropIndex = parseInt(dropZone.dataset.dropZone, 10);
        try {
          await addBlock(blockType, category, dropIndex);
        } catch (error) {
          console.error('Error adding block via touch:', error);
        }
      }

      // Reset drag state
      setIsDragging(false);
      setDraggedBlock(null);
      setDragOverIndex(null);
      setDropZoneActive(false);
      document.body.classList.remove('dragging-active');
    }
  }, [isDragging, addBlock, setIsDragging, setDraggedBlock]);

  // Get drop zone props
  const getDropZoneProps = useCallback((index) => ({
    onDragOver: handleDragOver,
    onDragEnter: (e) => handleDragEnter(e, index),
    onDragLeave: handleDragLeave,
    onDrop: (e) => handleDrop(e, index),
    'data-drop-zone': index,
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
    onDragStart: (e) => handleDragStart(e, blockType, category, e.currentTarget),
    onDragEnd: handleDragEnd,
    onMouseDown: (e) => {
      // Prevent text selection on mouse down
      e.preventDefault();
    },
    onTouchStart: (e) => handleTouchStart(e, blockType, category),
    onTouchMove: (e) => handleTouchMove(e, blockType, category),
    onTouchEnd: (e) => handleTouchEnd(e, blockType, category),
    className: `palette-item ${isDragging && draggedBlock?.type === blockType ? 'dragging' : ''}`
  }), [handleDragStart, handleDragEnd, handleTouchStart, handleTouchMove, handleTouchEnd, isDragging, draggedBlock]);

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

    // Touch handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,

    // Prop getters
    getDropZoneProps,
    getDraggableBlockProps,
    getPaletteItemProps
  };
};

export default useDragAndDrop;
