const request = require('supertest');
const { app } = require('../../server');
const { User, Company } = require('../../models');

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    const validRegistrationData = {
      companyName: 'Test Moving Company',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@testmoving.com',
      password: 'TestPassword123!',
      phone: '+254712345678'
    };

    it('should register a new company and user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegistrationData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Company and user registered successfully',
        data: {
          user: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@testmoving.com',
            role: 'admin'
          },
          company: {
            name: 'Test Moving Company',
            slug: 'test-moving-company',
            status: 'trial'
          },
          tokens: {
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
          }
        }
      });

      // Verify user was created in database
      const user = await User.findOne({ where: { email: 'john@testmoving.com' } });
      expect(user).toBeTruthy();
      expect(user.first_name).toBe('John');
      expect(user.role).toBe('admin');

      // Verify company was created
      const company = await Company.findOne({ where: { slug: 'test-moving-company' } });
      expect(company).toBeTruthy();
      expect(company.name).toBe('Test Moving Company');
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        companyName: 'T', // Too short
        firstName: '',
        lastName: 'Doe',
        email: 'invalid-email',
        password: '123', // Too weak
        phone: 'invalid-phone'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: expect.stringContaining('Validation failed')
      });
    });

    it('should prevent duplicate email registration', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(validRegistrationData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validRegistrationData,
          companyName: 'Another Company'
        })
        .expect(409);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: 'User with this email already exists'
      });
    });

    it('should handle unique company slug generation', async () => {
      // Register first company
      await request(app)
        .post('/api/auth/register')
        .send(validRegistrationData)
        .expect(201);

      // Register second company with same name
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validRegistrationData,
          email: 'jane@testmoving.com'
        })
        .expect(201);

      expect(response.body.data.company.slug).toBe('test-moving-company-1');
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser;
    let testCompany;

    beforeEach(async () => {
      testUser = await global.testUtils.createTestUser({
        email: 'test@example.com',
        password: 'TestPassword123!'
      });
      testCompany = await Company.findByPk(testUser.company_id);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: testUser.id,
            firstName: testUser.first_name,
            lastName: testUser.last_name,
            email: testUser.email,
            role: testUser.role
          },
          company: {
            id: testCompany.id,
            name: testCompany.name
          },
          tokens: {
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
          }
        }
      });
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: 'Invalid email or password'
      });
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: 'Invalid email or password'
      });
    });

    it('should reject login for inactive user', async () => {
      await testUser.update({ is_active: false });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: 'Invalid email or password'
      });
    });

    it('should update last login information', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        })
        .expect(200);

      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser.last_login_at).toBeTruthy();
      expect(updatedUser.last_login_ip).toBeTruthy();
    });
  });

  describe('POST /api/auth/refresh', () => {
    let testUser;
    let refreshToken;

    beforeEach(async () => {
      testUser = await global.testUtils.createTestUser();
      
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!'
        });

      refreshToken = loginResponse.body.data.tokens.refreshToken;
    });

    it('should refresh access token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        }
      });
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: 'Invalid refresh token'
      });
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: 'Refresh token is required'
      });
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await global.testUtils.createTestUser({
        email: 'test@example.com'
      });
    });

    it('should send password reset for valid email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });

      // Verify reset token was generated
      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser.password_reset_token).toBeTruthy();
      expect(updatedUser.password_reset_expires).toBeTruthy();
    });

    it('should not reveal if email does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: expect.stringContaining('valid email address')
      });
    });
  });

  describe('POST /api/auth/reset-password', () => {
    let testUser;
    let resetToken;

    beforeEach(async () => {
      testUser = await global.testUtils.createTestUser();
      resetToken = await testUser.generatePasswordResetToken();
    });

    it('should reset password successfully', async () => {
      const newPassword = 'NewPassword123!';
      
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          password: newPassword
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Password has been reset successfully'
      });

      // Verify password was changed
      const updatedUser = await User.findByPk(testUser.id);
      const isValidPassword = await updatedUser.validatePassword(newPassword);
      expect(isValidPassword).toBe(true);

      // Verify reset token was cleared
      expect(updatedUser.password_reset_token).toBeNull();
      expect(updatedUser.password_reset_expires).toBeNull();
    });

    it('should reject invalid reset token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'NewPassword123!'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: 'Invalid or expired reset token'
      });
    });

    it('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          password: 'weak'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'fail',
        message: expect.stringContaining('Password must')
      });
    });
  });
});
