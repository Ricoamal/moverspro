// Website Builder Service
import { 
  createBlockSchema, 
  createPageSchema, 
  createWebsiteSchema,
  BlockTypes,
  BlockCategories,
  PageStatus,
  BlockContentSchemas
} from '../types/websiteBuilder';

class WebsiteBuilderService {
  constructor() {
    this.website = this.loadWebsite();
    this.currentPage = null;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
    
    // Initialize with default data if empty
    this.initializeDefaultData();
  }

  // Load website data from localStorage
  loadWebsite() {
    try {
      const saved = localStorage.getItem('moveease_website');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading website data:', error);
    }
    return createWebsiteSchema();
  }

  // Save website data to localStorage
  saveWebsite() {
    try {
      this.website.updatedAt = new Date().toISOString();
      localStorage.setItem('moveease_website', JSON.stringify(this.website));
      return true;
    } catch (error) {
      console.error('Error saving website data:', error);
      return false;
    }
  }

  // Initialize with default data
  initializeDefaultData() {
    if (!this.website.id) {
      this.website = {
        ...createWebsiteSchema(),
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create default home page
      const homePage = this.createPage('Home', 'home');
      this.website.pages.push(homePage);
      this.currentPage = homePage;
      
      this.saveWebsite();
    }
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Page Management
  createPage(name, slug) {
    const page = {
      ...createPageSchema(),
      id: this.generateId(),
      name,
      slug,
      title: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return page;
  }

  addPage(name, slug) {
    const page = this.createPage(name, slug);
    this.website.pages.push(page);
    this.saveWebsite();
    return page;
  }

  updatePage(pageId, updates) {
    const pageIndex = this.website.pages.findIndex(p => p.id === pageId);
    if (pageIndex !== -1) {
      this.website.pages[pageIndex] = {
        ...this.website.pages[pageIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveWebsite();
      return this.website.pages[pageIndex];
    }
    return null;
  }

  deletePage(pageId) {
    const pageIndex = this.website.pages.findIndex(p => p.id === pageId);
    if (pageIndex !== -1) {
      this.website.pages.splice(pageIndex, 1);
      this.saveWebsite();
      return true;
    }
    return false;
  }

  getPage(pageId) {
    return this.website.pages.find(p => p.id === pageId);
  }

  getPageBySlug(slug) {
    return this.website.pages.find(p => p.slug === slug);
  }

  // Block Management
  createBlock(type, category, content = {}) {
    const block = {
      ...createBlockSchema(type, category),
      id: this.generateId(),
      name: this.getBlockName(type),
      content: {
        ...BlockContentSchemas[type],
        ...content
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return block;
  }

  addBlockToPage(pageId, blockType, category, position = -1) {
    const page = this.getPage(pageId);
    if (!page) return null;

    const block = this.createBlock(blockType, category);
    
    if (position === -1 || position >= page.blocks.length) {
      page.blocks.push(block);
      block.position = page.blocks.length - 1;
    } else {
      page.blocks.splice(position, 0, block);
      // Update positions
      page.blocks.forEach((b, index) => {
        b.position = index;
      });
    }

    this.updatePage(pageId, { blocks: page.blocks });
    this.addToHistory('ADD_BLOCK', { pageId, block });
    
    return block;
  }

  updateBlock(pageId, blockId, updates) {
    const page = this.getPage(pageId);
    if (!page) return null;

    const blockIndex = page.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return null;

    const oldBlock = { ...page.blocks[blockIndex] };
    page.blocks[blockIndex] = {
      ...page.blocks[blockIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.updatePage(pageId, { blocks: page.blocks });
    this.addToHistory('UPDATE_BLOCK', { pageId, blockId, oldBlock, newBlock: page.blocks[blockIndex] });
    
    return page.blocks[blockIndex];
  }

  deleteBlock(pageId, blockId) {
    const page = this.getPage(pageId);
    if (!page) return false;

    const blockIndex = page.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return false;

    const deletedBlock = page.blocks[blockIndex];
    page.blocks.splice(blockIndex, 1);
    
    // Update positions
    page.blocks.forEach((b, index) => {
      b.position = index;
    });

    this.updatePage(pageId, { blocks: page.blocks });
    this.addToHistory('DELETE_BLOCK', { pageId, block: deletedBlock, position: blockIndex });
    
    return true;
  }

  moveBlock(pageId, blockId, newPosition) {
    const page = this.getPage(pageId);
    if (!page) return false;

    const blockIndex = page.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return false;

    const block = page.blocks[blockIndex];
    const oldPosition = blockIndex;
    
    // Remove block from current position
    page.blocks.splice(blockIndex, 1);
    
    // Insert at new position
    page.blocks.splice(newPosition, 0, block);
    
    // Update all positions
    page.blocks.forEach((b, index) => {
      b.position = index;
    });

    this.updatePage(pageId, { blocks: page.blocks });
    this.addToHistory('MOVE_BLOCK', { pageId, blockId, oldPosition, newPosition });
    
    return true;
  }

  duplicateBlock(pageId, blockId) {
    const page = this.getPage(pageId);
    if (!page) return null;

    const block = page.blocks.find(b => b.id === blockId);
    if (!block) return null;

    const duplicatedBlock = {
      ...block,
      id: this.generateId(),
      name: `${block.name} Copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const position = block.position + 1;
    page.blocks.splice(position, 0, duplicatedBlock);
    
    // Update positions
    page.blocks.forEach((b, index) => {
      b.position = index;
    });

    this.updatePage(pageId, { blocks: page.blocks });
    this.addToHistory('DUPLICATE_BLOCK', { pageId, originalBlockId: blockId, duplicatedBlock });
    
    return duplicatedBlock;
  }

  // History Management
  addToHistory(action, data) {
    // Remove any history after current index
    this.history = this.history.slice(0, this.historyIndex + 1);
    
    // Add new action
    this.history.push({
      action,
      data,
      timestamp: new Date().toISOString()
    });

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  undo() {
    if (this.historyIndex < 0) return false;

    const historyItem = this.history[this.historyIndex];
    this.executeUndoAction(historyItem);
    this.historyIndex--;
    
    return true;
  }

  redo() {
    if (this.historyIndex >= this.history.length - 1) return false;

    this.historyIndex++;
    const historyItem = this.history[this.historyIndex];
    this.executeRedoAction(historyItem);
    
    return true;
  }

  executeUndoAction(historyItem) {
    const { action, data } = historyItem;
    
    switch (action) {
      case 'ADD_BLOCK':
        this.deleteBlock(data.pageId, data.block.id);
        break;
      case 'DELETE_BLOCK':
        const page = this.getPage(data.pageId);
        if (page) {
          page.blocks.splice(data.position, 0, data.block);
          page.blocks.forEach((b, index) => {
            b.position = index;
          });
          this.updatePage(data.pageId, { blocks: page.blocks });
        }
        break;
      case 'UPDATE_BLOCK':
        this.updateBlock(data.pageId, data.blockId, data.oldBlock);
        break;
      case 'MOVE_BLOCK':
        this.moveBlock(data.pageId, data.blockId, data.oldPosition);
        break;
    }
  }

  executeRedoAction(historyItem) {
    const { action, data } = historyItem;
    
    switch (action) {
      case 'ADD_BLOCK':
        const page = this.getPage(data.pageId);
        if (page) {
          page.blocks.push(data.block);
          this.updatePage(data.pageId, { blocks: page.blocks });
        }
        break;
      case 'DELETE_BLOCK':
        this.deleteBlock(data.pageId, data.block.id);
        break;
      case 'UPDATE_BLOCK':
        this.updateBlock(data.pageId, data.blockId, data.newBlock);
        break;
      case 'MOVE_BLOCK':
        this.moveBlock(data.pageId, data.blockId, data.newPosition);
        break;
    }
  }

  // Utility Methods
  getBlockName(type) {
    const names = {
      [BlockTypes.HERO_BANNER]: 'Hero Banner',
      [BlockTypes.HERO_VIDEO]: 'Video Hero',
      [BlockTypes.FEATURES_GRID]: 'Features Grid',
      [BlockTypes.ABOUT_SIMPLE]: 'About Section',
      [BlockTypes.SERVICES_GRID]: 'Services Grid',
      [BlockTypes.TESTIMONIALS_GRID]: 'Testimonials',
      [BlockTypes.GALLERY_GRID]: 'Photo Gallery',
      [BlockTypes.CONTACT_FORM]: 'Contact Form',
      [BlockTypes.FOOTER_SIMPLE]: 'Footer'
    };
    
    return names[type] || 'Block';
  }

  // Export/Import
  exportWebsite() {
    return JSON.stringify(this.website, null, 2);
  }

  importWebsite(data) {
    try {
      const imported = JSON.parse(data);
      this.website = imported;
      this.saveWebsite();
      return true;
    } catch (error) {
      console.error('Error importing website:', error);
      return false;
    }
  }

  // Publishing
  publishPage(pageId) {
    const page = this.getPage(pageId);
    if (!page) return false;

    page.status = PageStatus.PUBLISHED;
    page.publishedAt = new Date().toISOString();
    
    this.updatePage(pageId, { status: page.status, publishedAt: page.publishedAt });
    return true;
  }

  unpublishPage(pageId) {
    const page = this.getPage(pageId);
    if (!page) return false;

    page.status = PageStatus.DRAFT;
    page.publishedAt = null;
    
    this.updatePage(pageId, { status: page.status, publishedAt: page.publishedAt });
    return true;
  }
}

// Create singleton instance
const websiteBuilderService = new WebsiteBuilderService();
export default websiteBuilderService;
