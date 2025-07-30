import React, { useState } from 'react';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import { PageStatus } from '../../../types/websiteBuilder';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PageManager = () => {
  const {
    website,
    currentPage,
    switchPage,
    createPage,
    updatePage,
    deletePage,
    publishPage,
    unpublishPage,
    loading
  } = useWebsiteBuilder();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!newPageName.trim()) return;

    const slug = newPageSlug.trim() || newPageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    try {
      await createPage(newPageName.trim(), slug);
      setNewPageName('');
      setNewPageSlug('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Error creating page. Please try again.');
    }
  };

  const handleDeletePage = async (page) => {
    if (website.pages.length <= 1) {
      alert('Cannot delete the last page.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${page.name}"?`)) {
      await deletePage(page.id);
    }
  };

  const handleTogglePublish = async (page) => {
    if (page.status === PageStatus.PUBLISHED) {
      await unpublishPage(page.id);
    } else {
      await publishPage(page.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case PageStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case PageStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case PageStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Pages</h3>
          <Button
            size="sm"
            onClick={() => setShowCreateForm(true)}
            disabled={loading}
          >
            <Icon name="Plus" size={16} className="mr-1" />
            New Page
          </Button>
        </div>
      </div>

      {/* Create Page Form */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleCreatePage} className="space-y-3">
            <Input
              label="Page Name"
              value={newPageName}
              onChange={setNewPageName}
              placeholder="e.g., About Us"
              required
            />
            <Input
              label="URL Slug"
              value={newPageSlug}
              onChange={setNewPageSlug}
              placeholder="e.g., about-us (optional)"
            />
            <div className="flex items-center space-x-2">
              <Button
                type="submit"
                size="sm"
                loading={loading}
                disabled={!newPageName.trim()}
              >
                Create Page
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPageName('');
                  setNewPageSlug('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto">
        {website.pages.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pages</h3>
            <p className="text-gray-600 mb-4">Create your first page to get started.</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Icon name="Plus" size={16} className="mr-2" />
              Create Page
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {website.pages.map((page) => (
              <div
                key={page.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  currentPage?.id === page.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => switchPage(page.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {page.name}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(page.status)}`}>
                        {page.status}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      /{page.slug}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Icon name="Layers" size={12} className="mr-1" />
                        {page.blocks?.length || 0} blocks
                      </span>
                      <span>
                        Updated {formatDate(page.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Page Actions */}
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePublish(page);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title={page.status === PageStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
                    >
                      <Icon 
                        name={page.status === PageStatus.PUBLISHED ? 'Eye' : 'EyeOff'} 
                        size={14} 
                      />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newName = prompt('Enter new page name:', page.name);
                        if (newName && newName !== page.name) {
                          updatePage(page.id, { name: newName });
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Rename Page"
                    >
                      <Icon name="Edit" size={14} />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Duplicate page
                        const newName = `${page.name} Copy`;
                        const newSlug = `${page.slug}-copy`;
                        createPage(newName, newSlug);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Duplicate Page"
                    >
                      <Icon name="Copy" size={14} />
                    </button>
                    
                    {website.pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(page);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Page"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Page Preview */}
                {currentPage?.id === page.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span>Page Settings</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Icon name="Settings" size={12} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <div>Title: {page.title || 'Not set'}</div>
                        <div>Description: {page.description ? `${page.description.substring(0, 50)}...` : 'Not set'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center justify-between">
            <span>Total Pages:</span>
            <span className="font-medium">{website.pages.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Published:</span>
            <span className="font-medium text-green-600">
              {website.pages.filter(p => p.status === PageStatus.PUBLISHED).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Drafts:</span>
            <span className="font-medium text-yellow-600">
              {website.pages.filter(p => p.status === PageStatus.DRAFT).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageManager;
