const { sequelize } = require('../models');
const logger = require('../utils/logger');

// Mock logger to prevent console output during tests
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  security: {
    loginAttempt: jest.fn(),
    suspiciousActivity: jest.fn(),
    dataAccess: jest.fn()
  },
  business: {
    customerAction: jest.fn(),
    paymentEvent: jest.fn(),
    systemEvent: jest.fn()
  },
  performance: {
    apiCall: jest.fn(),
    dbQuery: jest.fn()
  },
  requestLogger: jest.fn((req, res, next) => next()),
  dbLogger: {
    query: jest.fn(),
    error: jest.fn()
  }
}));

// Mock external services
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  }))
}));

jest.mock('twilio', () => jest.fn(() => ({
  messages: {
    create: jest.fn().mockResolvedValue({ sid: 'test-message-sid' })
  }
})));

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn()
  }))
}));

// Global test utilities
global.testUtils = {
  // Test database setup
  async setupTestDb() {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
      logger.info('Test database setup completed');
    } catch (error) {
      logger.error('Test database setup failed:', error);
      throw error;
    }
  },

  // Clean database
  async cleanDb() {
    try {
      const models = Object.keys(sequelize.models);
      await sequelize.transaction(async (t) => {
        for (const model of models) {
          await sequelize.models[model].destroy({
            where: {},
            force: true,
            transaction: t
          });
        }
      });
    } catch (error) {
      logger.error('Database cleanup failed:', error);
      throw error;
    }
  },

  // Create test user
  async createTestUser(overrides = {}) {
    const { User, Company } = require('../models');
    
    const company = await Company.create({
      name: 'Test Company',
      slug: 'test-company',
      email: 'test@company.com',
      status: 'active'
    });

    return await User.create({
      company_id: company.id,
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      role: 'admin',
      permissions: ['manage_company', 'manage_users'],
      ...overrides
    });
  },

  // Create test company
  async createTestCompany(overrides = {}) {
    const { Company } = require('../models');
    
    return await Company.create({
      name: 'Test Moving Company',
      slug: 'test-moving-company',
      email: 'info@testmoving.com',
      status: 'active',
      subscription_plan: 'professional',
      ...overrides
    });
  },

  // Create test customer
  async createTestCustomer(companyId, overrides = {}) {
    const { Customer } = require('../models');
    
    return await Customer.create({
      company_id: companyId,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+254712345678',
      address: '123 Test Street',
      city: 'Nairobi',
      status: 'active',
      ...overrides
    });
  },

  // Generate JWT token for testing
  generateTestToken(userId) {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  },

  // Mock request object
  mockRequest(overrides = {}) {
    return {
      body: {},
      params: {},
      query: {},
      headers: {},
      user: null,
      companyId: null,
      ip: '127.0.0.1',
      get: jest.fn(),
      ...overrides
    };
  },

  // Mock response object
  mockResponse() {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
      locals: {}
    };
    return res;
  },

  // Mock next function
  mockNext() {
    return jest.fn();
  },

  // Wait for async operations
  async waitFor(callback, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const result = await callback();
        if (result) return result;
      } catch (error) {
        // Continue waiting
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Timeout waiting for condition');
  },

  // Mock file upload
  mockFile(filename = 'test.jpg', mimetype = 'image/jpeg', size = 1024) {
    return {
      fieldname: 'file',
      originalname: filename,
      encoding: '7bit',
      mimetype,
      size,
      buffer: Buffer.from('test file content'),
      destination: '/tmp',
      filename: `test-${Date.now()}-${filename}`,
      path: `/tmp/test-${Date.now()}-${filename}`
    };
  },

  // Mock email service
  mockEmailService: {
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
    sendPasswordReset: jest.fn().mockResolvedValue(true),
    sendInvoice: jest.fn().mockResolvedValue(true),
    sendNotification: jest.fn().mockResolvedValue(true)
  },

  // Mock SMS service
  mockSMSService: {
    sendSMS: jest.fn().mockResolvedValue({ sid: 'test-sms-sid' }),
    sendOTP: jest.fn().mockResolvedValue({ sid: 'test-otp-sid' })
  },

  // Mock payment service
  mockPaymentService: {
    processPayment: jest.fn().mockResolvedValue({
      id: 'test-payment-id',
      status: 'completed',
      amount: 1000
    }),
    refundPayment: jest.fn().mockResolvedValue({
      id: 'test-refund-id',
      status: 'completed'
    })
  },

  // Assert error response
  expectErrorResponse(res, statusCode, message) {
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
        message: expect.stringContaining(message)
      })
    );
  },

  // Assert success response
  expectSuccessResponse(res, statusCode = 200, data = null) {
    expect(res.status).toHaveBeenCalledWith(statusCode);
    if (data) {
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining(data)
        })
      );
    } else {
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true
        })
      );
    }
  }
};

// Setup test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.DB_NAME = 'moveease_pro_test';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

// Global setup and teardown
beforeAll(async () => {
  await global.testUtils.setupTestDb();
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await global.testUtils.cleanDb();
});

// Increase timeout for database operations
jest.setTimeout(30000);
