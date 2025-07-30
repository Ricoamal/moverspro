const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Database configuration
const config = {
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: process.env.DATABASE_PORT || process.env.DB_PORT || 3306,
  database: process.env.DATABASE_NAME || process.env.DB_NAME || 'moveease_pro',
  username: process.env.DATABASE_USERNAME || process.env.DB_USER || 'root',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || '',
  dialect: 'mysql',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: true
    } : false
  },
  logging: (sql, timing) => {
    if (process.env.NODE_ENV === 'development') {
      logger.dbLogger.query(sql, timing);
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
};

// Initialize Sequelize
const sequelize = new Sequelize(config);

// Import models
const Company = require('./Company')(sequelize, Sequelize.DataTypes);
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Customer = require('./Customer')(sequelize, Sequelize.DataTypes);
const Staff = require('./Staff')(sequelize, Sequelize.DataTypes);
const Department = require('./Department')(sequelize, Sequelize.DataTypes);
const Payroll = require('./Payroll')(sequelize, Sequelize.DataTypes);
const PayrollItem = require('./PayrollItem')(sequelize, Sequelize.DataTypes);
const Lead = require('./Lead')(sequelize, Sequelize.DataTypes);
const Quote = require('./Quote')(sequelize, Sequelize.DataTypes);
const Move = require('./Move')(sequelize, Sequelize.DataTypes);
const MoveItem = require('./MoveItem')(sequelize, Sequelize.DataTypes);
const Invoice = require('./Invoice')(sequelize, Sequelize.DataTypes);
const Payment = require('./Payment')(sequelize, Sequelize.DataTypes);
const Website = require('./Website')(sequelize, Sequelize.DataTypes);
const WebsitePage = require('./WebsitePage')(sequelize, Sequelize.DataTypes);
const WebsiteBlock = require('./WebsiteBlock')(sequelize, Sequelize.DataTypes);
const Upload = require('./Upload')(sequelize, Sequelize.DataTypes);
const Setting = require('./Setting')(sequelize, Sequelize.DataTypes);
const ActivityLog = require('./ActivityLog')(sequelize, Sequelize.DataTypes);
const Notification = require('./Notification')(sequelize, Sequelize.DataTypes);

// Create models object
const db = {
  sequelize,
  Sequelize,
  Company,
  User,
  Customer,
  Staff,
  Department,
  Payroll,
  PayrollItem,
  Lead,
  Quote,
  Move,
  MoveItem,
  Invoice,
  Payment,
  Website,
  WebsitePage,
  WebsiteBlock,
  Upload,
  Setting,
  ActivityLog,
  Notification
};

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
};

// Sync database (development only)
const syncDatabase = async (force = false) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force, alter: !force });
      logger.info(`Database synchronized ${force ? '(forced)' : '(altered)'}`);
    }
  } catch (error) {
    logger.error('Database sync error:', error);
    throw error;
  }
};

// Close database connection
const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed.');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

module.exports = {
  ...db,
  testConnection,
  syncDatabase,
  closeConnection
};
