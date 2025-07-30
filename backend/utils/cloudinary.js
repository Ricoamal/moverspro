const cloudinary = require('cloudinary').v2;
const logger = require('./logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

class CloudinaryService {
  constructor() {
    this.isConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }

  // Upload image from buffer
  async uploadImage(buffer, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const defaultOptions = {
        resource_type: 'image',
        folder: 'moveease-pro',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        ...options
      };

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          defaultOptions,
          (error, result) => {
            if (error) {
              logger.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes
              });
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      logger.error('Cloudinary upload failed:', error);
      throw error;
    }
  }

  // Upload image from file path
  async uploadImageFromPath(filePath, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const defaultOptions = {
        resource_type: 'image',
        folder: 'moveease-pro',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        ...options
      };

      const result = await cloudinary.uploader.upload(filePath, defaultOptions);
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      };
    } catch (error) {
      logger.error('Cloudinary upload from path failed:', error);
      throw error;
    }
  }

  // Delete image
  async deleteImage(publicId) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      logger.error('Cloudinary delete failed:', error);
      throw error;
    }
  }

  // Generate optimized URL
  generateOptimizedUrl(publicId, options = {}) {
    if (!this.isConfigured) {
      return null;
    }

    const defaultOptions = {
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options
    };

    return cloudinary.url(publicId, defaultOptions);
  }

  // Generate thumbnail
  generateThumbnail(publicId, width = 150, height = 150) {
    if (!this.isConfigured) {
      return null;
    }

    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto:good',
      fetch_format: 'auto'
    });
  }

  // Upload document (PDF, DOC, etc.)
  async uploadDocument(buffer, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const defaultOptions = {
        resource_type: 'raw',
        folder: 'moveease-pro/documents',
        ...options
      };

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          defaultOptions,
          (error, result) => {
            if (error) {
              logger.error('Cloudinary document upload error:', error);
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                bytes: result.bytes
              });
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      logger.error('Cloudinary document upload failed:', error);
      throw error;
    }
  }

  // Get upload stats
  async getUploadStats() {
    if (!this.isConfigured) {
      return null;
    }

    try {
      const result = await cloudinary.api.usage();
      return {
        credits: result.credits,
        used_credits: result.used_credits,
        limit: result.limit,
        storage: result.storage,
        bandwidth: result.bandwidth
      };
    } catch (error) {
      logger.error('Cloudinary stats error:', error);
      return null;
    }
  }

  // Health check
  async ping() {
    if (!this.isConfigured) {
      return false;
    }

    try {
      await cloudinary.api.ping();
      return true;
    } catch (error) {
      logger.error('Cloudinary ping failed:', error);
      return false;
    }
  }

  // Check if configured
  isReady() {
    return this.isConfigured;
  }
}

// Create singleton instance
const cloudinaryService = new CloudinaryService();

module.exports = cloudinaryService;
