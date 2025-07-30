import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import ImageUpload from '../../../components/ui/ImageUpload';
import Icon from '../../../components/AppIcon';
import imageUploadService from '../../../services/imageUploadService';

const ImageGalleryManager = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImages, setSelectedImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name, size
  const [showUpload, setShowUpload] = useState(false);

  // Categories
  const categories = [
    { value: 'all', label: 'All Images' },
    { value: 'website-builder', label: 'Website Builder' },
    { value: 'backgrounds', label: 'Backgrounds' },
    { value: 'logos', label: 'Logos' },
    { value: 'team', label: 'Team Photos' },
    { value: 'services', label: 'Services' },
    { value: 'gallery', label: 'Gallery' }
  ];

  // Load images
  useEffect(() => {
    loadImages();
  }, []);

  // Filter and sort images
  useEffect(() => {
    let filtered = images;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(img =>
        img.originalName.toLowerCase().includes(query) ||
        img.alt.toLowerCase().includes(query) ||
        img.category.toLowerCase().includes(query)
      );
    }

    // Sort images
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.uploadedAt) - new Date(b.uploadedAt);
        case 'name':
          return a.originalName.localeCompare(b.originalName);
        case 'size':
          return b.size - a.size;
        case 'newest':
        default:
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      }
    });

    setFilteredImages(filtered);
  }, [images, searchQuery, selectedCategory, sortBy]);

  const loadImages = () => {
    const allImages = imageUploadService.getUploadedImages();
    setImages(allImages);
  };

  const handleImageUpload = (uploadedImages) => {
    loadImages();
    setShowUpload(false);
  };

  const handleImageSelect = (image) => {
    setSelectedImages(prev => {
      const isSelected = prev.some(img => img.id === image.id);
      if (isSelected) {
        return prev.filter(img => img.id !== image.id);
      } else {
        return [...prev, image];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages([...filteredImages]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedImages.length === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedImages.length} image(s)? This action cannot be undone.`
    );

    if (confirmDelete) {
      selectedImages.forEach(image => {
        imageUploadService.deleteImage(image.id);
      });
      setSelectedImages([]);
      loadImages();
    }
  };

  const handleUpdateImageAlt = (imageId, newAlt) => {
    // In a real implementation, this would update the image metadata
    console.log('Update alt text:', imageId, newAlt);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const storageUsage = imageUploadService.getStorageUsage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Image Gallery</h2>
              <p className="text-sm text-gray-600 mt-1">
                {storageUsage.totalImages} images • {storageUsage.totalSizeMB} MB used
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowUpload(!showUpload)}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Upload Images
              </Button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Upload Area */}
          {showUpload && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <ImageUpload
                onImageUpload={handleImageUpload}
                multiple={true}
                maxFiles={20}
                showPreview={true}
                showGallery={false}
              />
            </div>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={setSearchQuery}
                icon="Search"
              />
            </div>

            {/* Category Filter */}
            <Select
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />

            {/* Sort */}
            <Select
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'name', label: 'Name A-Z' },
                { value: 'size', label: 'Largest First' }
              ]}
              value={sortBy}
              onChange={setSortBy}
            />

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                <Icon name="Grid3x3" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                <Icon name="List" size={16} />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedImages.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                {selectedImages.length} image(s) selected
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedImages([])}
                >
                  Clear Selection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Delete Selected
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Image Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Image" size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload your first image to get started'
                }
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <Button onClick={() => setShowUpload(true)}>
                  <Icon name="Upload" size={16} className="mr-2" />
                  Upload Images
                </Button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImages.some(img => img.id === image.id)
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <img
                    src={image.thumbnailUrl || image.url}
                    alt={image.alt || image.originalName}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Selection Indicator */}
                  {selectedImages.some(img => img.id === image.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} />
                    </div>
                  )}

                  {/* Image Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs truncate font-medium">{image.originalName}</p>
                    <p className="text-xs text-gray-300">
                      {formatFileSize(image.size)} • {image.dimensions?.width}×{image.dimensions?.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`flex items-center p-3 rounded-lg border transition-all ${
                    selectedImages.some(img => img.id === image.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedImages.some(img => img.id === image.id)}
                    onChange={() => handleImageSelect(image)}
                    className="mr-3"
                  />

                  {/* Thumbnail */}
                  <img
                    src={image.thumbnailUrl || image.url}
                    alt={image.alt || image.originalName}
                    className="w-12 h-12 object-cover rounded mr-4"
                  />

                  {/* Image Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{image.originalName}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(image.size)} • {image.dimensions?.width}×{image.dimensions?.height} • {formatDate(image.uploadedAt)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{image.category}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newAlt = prompt('Enter alt text:', image.alt);
                        if (newAlt !== null) {
                          handleUpdateImageAlt(image.id, newAlt);
                        }
                      }}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this image?')) {
                          imageUploadService.deleteImage(image.id);
                          loadImages();
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {selectedImages.length === filteredImages.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-gray-600">
              Showing {filteredImages.length} of {images.length} images
            </span>
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryManager;
