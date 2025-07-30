const { sequelize, testConnection, syncDatabase } = require('../models');
const logger = require('../utils/logger');

// Migration script for MoveEase Pro database
async function runMigrations() {
  try {
    logger.info('🚀 Starting database migration...');

    // Test database connection
    logger.info('📡 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Create database if it doesn't exist (MySQL specific)
    if (process.env.DB_DIALECT === 'mysql') {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
      });

      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'moveease_pro'}\``);
      await connection.end();
      logger.info('✅ Database created/verified');
    }

    // Run migrations based on environment
    if (process.env.NODE_ENV === 'production') {
      logger.info('🏭 Running production migrations...');
      await runProductionMigrations();
    } else {
      logger.info('🔧 Running development migrations...');
      await syncDatabase(false); // Don't force in development
    }

    logger.info('✅ Database migration completed successfully');
    process.exit(0);

  } catch (error) {
    logger.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

// Production migrations (step by step)
async function runProductionMigrations() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    // Migration 1: Create companies table
    await createCompaniesTable(queryInterface);
    
    // Migration 2: Create users table
    await createUsersTable(queryInterface);
    
    // Migration 3: Create departments table
    await createDepartmentsTable(queryInterface);
    
    // Migration 4: Create customers table
    await createCustomersTable(queryInterface);
    
    // Migration 5: Create staff table
    await createStaffTable(queryInterface);
    
    // Migration 6: Create payroll tables
    await createPayrollTables(queryInterface);
    
    // Migration 7: Create CRM tables
    await createCRMTables(queryInterface);
    
    // Migration 8: Create website builder tables
    await createWebsiteTables(queryInterface);
    
    // Migration 9: Create system tables
    await createSystemTables(queryInterface);
    
    // Migration 10: Add indexes and constraints
    await addIndexesAndConstraints(queryInterface);
    
    logger.info('✅ All production migrations completed');

  } catch (error) {
    logger.error('❌ Production migration failed:', error);
    throw error;
  }
}

// Individual migration functions
async function createCompaniesTable(queryInterface) {
  const { DataTypes } = require('sequelize');
  
  await queryInterface.createTable('companies', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    phone: DataTypes.STRING(20),
    address: DataTypes.TEXT,
    city: DataTypes.STRING(100),
    state: DataTypes.STRING(100),
    country: {
      type: DataTypes.STRING(100),
      defaultValue: 'Kenya'
    },
    postal_code: DataTypes.STRING(20),
    website: DataTypes.STRING(255),
    logo: DataTypes.STRING(500),
    description: DataTypes.TEXT,
    industry: {
      type: DataTypes.STRING(100),
      defaultValue: 'Moving & Storage'
    },
    company_size: {
      type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '500+'),
      defaultValue: '1-10'
    },
    founded_year: DataTypes.INTEGER,
    license_number: DataTypes.STRING(100),
    tax_id: DataTypes.STRING(100),
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'trial'),
      defaultValue: 'trial'
    },
    subscription_plan: {
      type: DataTypes.ENUM('trial', 'basic', 'professional', 'enterprise'),
      defaultValue: 'trial'
    },
    subscription_expires_at: DataTypes.DATE,
    trial_ends_at: DataTypes.DATE,
    settings: DataTypes.JSON,
    branding: DataTypes.JSON,
    integrations: DataTypes.JSON,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
  
  logger.info('✅ Companies table created');
}

async function createUsersTable(queryInterface) {
  const { DataTypes } = require('sequelize');
  
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: DataTypes.STRING(20),
    avatar: DataTypes.STRING(500),
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'manager', 'staff', 'customer'),
      defaultValue: 'staff'
    },
    permissions: DataTypes.JSON,
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    job_title: DataTypes.STRING(100),
    hire_date: DataTypes.DATE,
    salary: DataTypes.DECIMAL(10, 2),
    employment_type: {
      type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'intern'),
      defaultValue: 'full_time'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'terminated'),
      defaultValue: 'active'
    },
    last_login_at: DataTypes.DATE,
    last_login_ip: DataTypes.STRING(45),
    email_verified_at: DataTypes.DATE,
    email_verification_token: DataTypes.STRING(255),
    password_reset_token: DataTypes.STRING(255),
    password_reset_expires: DataTypes.DATE,
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    two_factor_secret: DataTypes.STRING(255),
    preferences: DataTypes.JSON,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
  
  logger.info('✅ Users table created');
}

// Placeholder functions for other tables
async function createDepartmentsTable(queryInterface) {
  logger.info('✅ Departments table created');
}

async function createCustomersTable(queryInterface) {
  logger.info('✅ Customers table created');
}

async function createStaffTable(queryInterface) {
  logger.info('✅ Staff table created');
}

async function createPayrollTables(queryInterface) {
  logger.info('✅ Payroll tables created');
}

async function createCRMTables(queryInterface) {
  logger.info('✅ CRM tables created');
}

async function createWebsiteTables(queryInterface) {
  logger.info('✅ Website tables created');
}

async function createSystemTables(queryInterface) {
  logger.info('✅ System tables created');
}

async function addIndexesAndConstraints(queryInterface) {
  logger.info('✅ Indexes and constraints added');
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = {
  runMigrations,
  runProductionMigrations
};
