const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { User, Company } = require('../models');
const { catchAsync, AppError, validationError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: {
    error: 'Too many registration attempts, please try again later.'
  }
});

// Validation rules
const registerValidation = [
  body('companyName')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Company name must be between 2 and 255 characters'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must be less than 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must be less than 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Helper functions
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

const createCompanySlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
    .substring(0, 100);
};

// Routes

// @route   POST /api/auth/register
// @desc    Register new company and admin user
// @access  Public
router.post('/register', registerLimiter, registerValidation, catchAsync(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw validationError(errors);
  }

  const { companyName, firstName, lastName, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Create company slug
  let slug = createCompanySlug(companyName);
  
  // Ensure slug is unique
  let counter = 1;
  let originalSlug = slug;
  while (await Company.findOne({ where: { slug } })) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  // Create company
  const company = await Company.create({
    name: companyName,
    slug,
    email,
    trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
  });

  // Create admin user
  const user = await User.create({
    company_id: company.id,
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    phone,
    role: 'admin',
    permissions: [
      'manage_company',
      'manage_users',
      'manage_customers',
      'manage_staff',
      'manage_payroll',
      'manage_crm',
      'manage_website',
      'view_analytics'
    ]
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Log successful registration
  logger.security.loginAttempt(email, true, req.ip);
  logger.business.systemEvent('company_registered', {
    companyId: company.id,
    userId: user.id,
    companyName,
    userEmail: email
  });

  res.status(201).json({
    success: true,
    message: 'Company and user registered successfully',
    data: {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      },
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        status: company.status,
        subscriptionPlan: company.subscription_plan,
        trialEndsAt: company.trial_ends_at
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, loginValidation, catchAsync(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw validationError(errors);
  }

  const { email, password } = req.body;

  // Find user with company
  const user = await User.findOne({
    where: { email, is_active: true },
    include: [{
      model: Company,
      as: 'company',
      attributes: ['id', 'name', 'slug', 'status', 'subscription_plan', 'trial_ends_at']
    }]
  });

  if (!user) {
    logger.security.loginAttempt(email, false, req.ip);
    throw new AppError('Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) {
    logger.security.loginAttempt(email, false, req.ip);
    throw new AppError('Invalid email or password', 401);
  }

  // Check if company is active
  if (!user.company || user.company.status !== 'active') {
    if (user.company && user.company.status === 'trial') {
      // Allow trial users to login
    } else {
      throw new AppError('Company account is not active', 403);
    }
  }

  // Update last login
  await user.updateLastLogin(req.ip);

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Log successful login
  logger.security.loginAttempt(email, true, req.ip);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        avatar: user.avatar
      },
      company: user.company,
      tokens: {
        accessToken,
        refreshToken
      }
    }
  });
}));

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.is_active) {
      throw new AppError('Invalid refresh token', 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
}));

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', catchAsync(async (req, res) => {
  // In a more sophisticated setup, you might want to blacklist the token
  // For now, we'll just return success and let the client remove the token
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw validationError(errors);
  }

  const { email } = req.body;
  const user = await User.findByEmail(email);

  if (!user) {
    // Don't reveal if email exists or not
    return res.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    });
  }

  // Generate reset token
  const resetToken = await user.generatePasswordResetToken();

  // TODO: Send email with reset link
  // await emailService.sendPasswordReset(user.email, resetToken);

  logger.security.suspiciousActivity('password_reset_requested', user.id, req.ip);

  res.json({
    success: true,
    message: 'If an account with that email exists, we have sent a password reset link.'
  });
}));

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', authLimiter, [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw validationError(errors);
  }

  const { token, password } = req.body;
  const user = await User.findByResetToken(token);

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  // Update password and clear reset token
  await user.update({
    password,
    password_reset_token: null,
    password_reset_expires: null
  });

  logger.security.suspiciousActivity('password_reset_completed', user.id, req.ip);

  res.json({
    success: true,
    message: 'Password has been reset successfully'
  });
}));

module.exports = router;
