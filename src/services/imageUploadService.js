// Image Upload Service for Website Builder
class ImageUploadService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    this.uploadEndpoint = '/api/upload/images';
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    this.compressionQuality = 0.8;
  }

  // Validate file before upload
  validateFile(file) {
    const errors = [];

    if (!file) {
      errors.push('No file selected');
      return { isValid: false, errors };
    }

    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not supported. Allowed types: ${this.allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${this.maxFileSize / 1024 / 1024}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Compress image before upload
  async compressImage(file) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920x1080 for web)
        let { width, height } = img;
        const maxWidth = 1920;
        const maxHeight = 1080;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          file.type,
          this.compressionQuality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Generate thumbnail
  async generateThumbnail(file, size = 300) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // Calculate crop dimensions for square thumbnail
        const { width, height } = img;
        const minDim = Math.min(width, height);
        const x = (width - minDim) / 2;
        const y = (height - minDim) / 2;

        ctx.drawImage(img, x, y, minDim, minDim, 0, 0, size, size);
        
        canvas.toBlob(
          (blob) => {
            const thumbnailFile = new File([blob], `thumb_${file.name}`, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(thumbnailFile);
          },
          file.type,
          0.7
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Upload single image
  async uploadImage(file, options = {}) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Compress image if needed
      const compressedFile = await this.compressImage(file);
      
      // Generate thumbnail
      const thumbnail = await this.generateThumbnail(compressedFile);

      // Prepare form data
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('thumbnail', thumbnail);
      formData.append('originalName', file.name);
      formData.append('category', options.category || 'website-builder');
      formData.append('alt', options.alt || '');

      // For now, simulate upload with local storage (replace with actual API call)
      const result = await this.simulateUpload(compressedFile, thumbnail, options);
      
      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Simulate upload for development (replace with actual API call)
  async simulateUpload(file, thumbnail, options) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate unique ID
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // Create object URLs for preview
    const imageUrl = URL.createObjectURL(file);
    const thumbnailUrl = URL.createObjectURL(thumbnail);

    // Store in localStorage for persistence
    const imageData = {
      id,
      originalName: file.name,
      fileName: `${id}_${file.name}`,
      url: imageUrl,
      thumbnailUrl,
      size: file.size,
      type: file.type,
      category: options.category || 'website-builder',
      alt: options.alt || '',
      uploadedAt: new Date().toISOString(),
      dimensions: await this.getImageDimensions(file)
    };

    // Save to localStorage
    const existingImages = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
    existingImages.push(imageData);
    localStorage.setItem('uploaded_images', JSON.stringify(existingImages));

    return imageData;
  }

  // Get image dimensions
  async getImageDimensions(file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // Upload multiple images
  async uploadMultipleImages(files, options = {}) {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await this.uploadImage(file, {
        ...options,
        onProgress: (progress) => {
          if (options.onProgress) {
            options.onProgress({
              fileIndex: i,
              fileName: file.name,
              progress,
              totalFiles: files.length
            });
          }
        }
      });
      results.push(result);
    }

    return results;
  }

  // Get uploaded images
  getUploadedImages(category = null) {
    const images = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
    
    if (category) {
      return images.filter(img => img.category === category);
    }
    
    return images;
  }

  // Delete image
  deleteImage(imageId) {
    const images = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
    const filteredImages = images.filter(img => img.id !== imageId);
    localStorage.setItem('uploaded_images', JSON.stringify(filteredImages));
    
    return true;
  }

  // Get image by ID
  getImageById(imageId) {
    const images = this.getUploadedImages();
    return images.find(img => img.id === imageId);
  }

  // Search images
  searchImages(query, category = null) {
    const images = this.getUploadedImages(category);
    
    if (!query) return images;
    
    const searchTerm = query.toLowerCase();
    return images.filter(img => 
      img.originalName.toLowerCase().includes(searchTerm) ||
      img.alt.toLowerCase().includes(searchTerm) ||
      img.category.toLowerCase().includes(searchTerm)
    );
  }

  // Get storage usage
  getStorageUsage() {
    const images = this.getUploadedImages();
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    
    return {
      totalImages: images.length,
      totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
    };
  }
}

// Create singleton instance
const imageUploadService = new ImageUploadService();
export default imageUploadService;
