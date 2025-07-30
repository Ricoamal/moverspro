const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');
const logger = require('../utils/logger');

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in database
    const user = await User.findByPk(decoded.userId, {
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'status', 'subscription_plan']
        }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token - user not found'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User account is deactivated'
      });
    }

    if (user.company && user.company.status !== 'active') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Company account is not active'
      });
    }

    // Add user info to request object
    req.user = user;
    req.companyId = user.company_id;
    
    // Log successful authentication
    logger.info(`User authenticated: ${user.email} (ID: ${user.id})`);
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Token expired'
      });
    }

    logger.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Permission-based authorization middleware
const hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Access denied',
          message: 'Authentication required'
        });
      }

      // Super admin has all permissions
      if (req.user.role === 'super_admin') {
        return next();
      }

      // Check if user has the required permission
      const userPermissions = req.user.permissions || [];
      
      if (!userPermissions.includes(permission)) {
        return res.status(403).json({
          error: 'Access denied',
          message: `Permission '${permission}' required`
        });
      }

      next();
    } catch (error) {
      logger.error('Permission check error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Permission check failed'
      });
    }
  };
};

// Company ownership middleware
const requireCompanyAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    const resourceCompanyId = req.params.companyId || req.body.companyId || req.query.companyId;
    
    // If no company ID in request, use user's company
    if (!resourceCompanyId) {
      return next();
    }

    // Super admin can access any company
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Check if user belongs to the requested company
    if (req.user.company_id !== parseInt(resourceCompanyId)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Cannot access resources from different company'
      });
    }

    next();
  } catch (error) {
    logger.error('Company access check error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Company access check failed'
    });
  }
};

// Optional authentication middleware (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'status']
        }
      ],
      attributes: { exclude: ['password'] }
    });

    if (user && user.is_active) {
      req.user = user;
      req.companyId = user.company_id;
    }

    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};

// Rate limiting by user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.id;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(userId)) {
      const userRequests = requests.get(userId).filter(time => time > windowStart);
      requests.set(userId, userRequests);
    }

    // Check current request count
    const currentRequests = requests.get(userId) || [];
    
    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000 / 60} minutes.`
      });
    }

    // Add current request
    currentRequests.push(now);
    requests.set(userId, currentRequests);

    next();
  };
};

module.exports = {
  authenticateToken,
  authorize,
  hasPermission,
  requireCompanyAccess,
  optionalAuth,
  userRateLimit
};
