const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('./logger');

class JWTService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '7d';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
    
    // In-memory blacklist (in production, use Redis)
    this.blacklistedTokens = new Set();
  }

  // Generate access token
  generateAccessToken(payload) {
    try {
      return jwt.sign(
        {
          ...payload,
          type: 'access',
          iat: Math.floor(Date.now() / 1000)
        },
        this.accessTokenSecret,
        {
          expiresIn: this.accessTokenExpiry,
          issuer: 'moveease-pro',
          audience: 'moveease-pro-client'
        }
      );
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw new Error('Token generation failed');
    }
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    try {
      return jwt.sign(
        {
          ...payload,
          type: 'refresh',
          iat: Math.floor(Date.now() / 1000)
        },
        this.refreshTokenSecret,
        {
          expiresIn: this.refreshTokenExpiry,
          issuer: 'moveease-pro',
          audience: 'moveease-pro-client'
        }
      );
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Token generation failed');
    }
  }

  // Generate both tokens
  generateTokenPair(payload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    
    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpiry(accessToken)
    };
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      if (this.isBlacklisted(token)) {
        throw new Error('Token has been revoked');
      }

      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'moveease-pro',
        audience: 'moveease-pro-client'
      });

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      logger.error('Access token verification failed:', error.message);
      throw error;
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      if (this.isBlacklisted(token)) {
        throw new Error('Token has been revoked');
      }

      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'moveease-pro',
        audience: 'moveease-pro-client'
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      logger.error('Refresh token verification failed:', error.message);
      throw error;
    }
  }

  // Decode token without verification (for expired tokens)
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      logger.error('Token decode failed:', error);
      return null;
    }
  }

  // Get token expiry time
  getTokenExpiry(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token) {
    const expiry = this.getTokenExpiry(token);
    return expiry ? new Date() > expiry : true;
  }

  // Get time until token expires (in seconds)
  getTimeUntilExpiry(token) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return 0;
    
    const now = new Date();
    return Math.max(0, Math.floor((expiry - now) / 1000));
  }

  // Blacklist a token
  blacklistToken(token) {
    try {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.payload) {
        // Store token ID or hash to save memory
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        this.blacklistedTokens.add(tokenHash);
        
        // Set timeout to remove from blacklist after expiry
        const expiry = this.getTokenExpiry(token);
        if (expiry) {
          const timeUntilExpiry = expiry - new Date();
          if (timeUntilExpiry > 0) {
            setTimeout(() => {
              this.blacklistedTokens.delete(tokenHash);
            }, timeUntilExpiry);
          }
        }
        
        logger.info('Token blacklisted successfully');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error blacklisting token:', error);
      return false;
    }
  }

  // Check if token is blacklisted
  isBlacklisted(token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.blacklistedTokens.has(tokenHash);
  }

  // Refresh access token using refresh token
  refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      
      // Generate new access token with same payload (excluding token-specific fields)
      const { type, iat, exp, iss, aud, ...payload } = decoded;
      const newAccessToken = this.generateAccessToken(payload);
      
      return {
        accessToken: newAccessToken,
        expiresIn: this.getTokenExpiry(newAccessToken)
      };
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  // Generate secure random token (for password reset, email verification, etc.)
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate API key
  generateApiKey(prefix = 'mk') {
    const randomPart = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now().toString(36);
    return `${prefix}_${timestamp}_${randomPart}`;
  }

  // Validate API key format
  validateApiKeyFormat(apiKey) {
    const pattern = /^mk_[a-z0-9]+_[a-f0-9]{32}$/;
    return pattern.test(apiKey);
  }

  // Create session token (for remember me functionality)
  createSessionToken(userId, deviceInfo = {}) {
    const payload = {
      userId,
      deviceInfo: {
        userAgent: deviceInfo.userAgent || '',
        ip: deviceInfo.ip || '',
        fingerprint: deviceInfo.fingerprint || ''
      },
      sessionId: this.generateSecureToken(16)
    };

    return this.generateRefreshToken(payload);
  }

  // Validate session token
  validateSessionToken(token, currentDeviceInfo = {}) {
    try {
      const decoded = this.verifyRefreshToken(token);
      
      // Optional: Validate device fingerprint for additional security
      if (process.env.VALIDATE_DEVICE_FINGERPRINT === 'true') {
        const storedFingerprint = decoded.deviceInfo?.fingerprint;
        const currentFingerprint = currentDeviceInfo.fingerprint;
        
        if (storedFingerprint && currentFingerprint && storedFingerprint !== currentFingerprint) {
          throw new Error('Device fingerprint mismatch');
        }
      }

      return decoded;
    } catch (error) {
      logger.error('Session token validation failed:', error);
      throw error;
    }
  }

  // Get token statistics
  getTokenStats() {
    return {
      blacklistedTokens: this.blacklistedTokens.size,
      accessTokenExpiry: this.accessTokenExpiry,
      refreshTokenExpiry: this.refreshTokenExpiry
    };
  }

  // Clean up expired blacklisted tokens (call periodically)
  cleanupBlacklist() {
    // This is a simple implementation
    // In production, use Redis with TTL or a proper cleanup job
    const sizeBefore = this.blacklistedTokens.size;
    
    // Clear all for now (tokens will be re-added if still valid)
    this.blacklistedTokens.clear();
    
    logger.info(`Blacklist cleanup completed. Removed ${sizeBefore} entries.`);
  }
}

// Create singleton instance
const jwtService = new JWTService();

// Export both the class and instance
module.exports = {
  JWTService,
  jwtService
};
