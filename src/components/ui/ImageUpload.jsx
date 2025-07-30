import React, { useState, useRef, useCallback } from 'react';
import Button from './Button';
import Icon from '../AppIcon';
import imageUploadService from '../../services/imageUploadService';

const ImageUpload = ({
  onImageSelect,
  onImageUpload,
  multiple = false,
  category = 'website-builder',
  accept = 'image/*',
  maxFiles = 10,
  className = '',
  showPreview = true,
  showGallery = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  // Load gallery images
  const loadGalleryImages = useCallback(() => {
    const images = imageUploadService.getUploadedImages(category);
    setGalleryImages(images);
  }, [category]);

  // Handle file selection
  const handleFileSelect = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    if (!multiple && fileArray.length > 1) {
      alert('Please select only one image');
      return;
    }

    if (fileArray.length > maxFiles) {
      alert(`Please select no more than ${maxFiles} images`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const results = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        const result = await imageUploadService.uploadImage(file, {
          category,
          onProgress: (progress) => {
            const overallProgress = ((i / fileArray.length) + (progress / 100 / fileArray.length)) * 100;
            setUploadProgress(overallProgress);
          }
        });

        if (result.success) {
          results.push(result.data);
        } else {
          console.error('Upload failed:', result.error);
          alert(`Failed to upload ${file.name}: ${result.error}`);
        }
      }

      if (results.length > 0) {
        setSelectedImages(results);
        
        if (onImageUpload) {
          onImageUpload(multiple ? results : results[0]);
        }
        
        if (onImageSelect) {
          onImageSelect(multiple ? results : results[0]);
        }
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [multiple, maxFiles, category, onImageSelect, onImageUpload]);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = useCallback((e) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  // Open file dialog
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Open image gallery
  const openImageGallery = useCallback(() => {
    loadGalleryImages();
    setShowImageGallery(true);
  }, [loadGalleryImages]);

  // Select from gallery
  const selectFromGallery = useCallback((image) => {
    if (multiple) {
      const isSelected = selectedImages.some(img => img.id === image.id);
      if (isSelected) {
        setSelectedImages(prev => prev.filter(img => img.id !== image.id));
      } else {
        setSelectedImages(prev => [...prev, image]);
      }
    } else {
      setSelectedImages([image]);
      if (onImageSelect) {
        onImageSelect(image);
      }
      setShowImageGallery(false);
    }
  }, [multiple, selectedImages, onImageSelect]);

  // Confirm gallery selection
  const confirmGallerySelection = useCallback(() => {
    if (onImageSelect) {
      onImageSelect(multiple ? selectedImages : selectedImages[0]);
    }
    setShowImageGallery(false);
  }, [multiple, selectedImages, onImageSelect]);

  // Filter gallery images
  const filteredGalleryImages = galleryImages.filter(img =>
    img.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.alt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`image-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="space-y-4">
            <Icon name="Upload" size={48} className="mx-auto text-blue-500 animate-pulse" />
            <div>
              <p className="text-lg font-medium text-gray-900">Uploading...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{Math.round(uploadProgress)}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Icon name="Upload" size={48} className="mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop images here or click to upload
              </p>
              <p className="text-sm text-gray-600">
                Supports JPG, PNG, GIF, WebP up to 10MB
              </p>
              {multiple && (
                <p className="text-xs text-gray-500 mt-1">
                  You can select up to {maxFiles} images
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <Button onClick={openFileDialog} variant="outline">
                <Icon name="Upload" size={16} className="mr-2" />
                Choose Files
              </Button>
              
              {showGallery && (
                <Button onClick={openImageGallery} variant="ghost">
                  <Icon name="Image" size={16} className="mr-2" />
                  From Gallery
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Preview */}
      {showPreview && selectedImages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.thumbnailUrl || image.url}
                  alt={image.alt || image.originalName}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => {
                    setSelectedImages(prev => prev.filter(img => img.id !== image.id));
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="X" size={12} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                  {image.originalName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Image Gallery</h3>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredGalleryImages.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Image" size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredGalleryImages.map((image) => (
                    <div
                      key={image.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImages.some(img => img.id === image.id)
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => selectFromGallery(image)}
                    >
                      <img
                        src={image.thumbnailUrl || image.url}
                        alt={image.alt || image.originalName}
                        className="w-full h-24 object-cover"
                      />
                      {selectedImages.some(img => img.id === image.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          <Icon name="Check" size={12} />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        {image.originalName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedImages.length} selected
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowImageGallery(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmGallerySelection}
                  disabled={selectedImages.length === 0}
                >
                  Select Images
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
