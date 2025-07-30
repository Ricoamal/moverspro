const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

// Add request logging middleware
logger.requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      companyId: req.companyId
    };
    
    if (res.statusCode >= 400) {
      logger.error('HTTP Request Error', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  });
  
  next();
};

// Add database logging
logger.dbLogger = {
  query: (sql, duration) => {
    logger.debug(`DB Query [${duration}ms]: ${sql}`);
  },
  error: (error, sql) => {
    logger.error(`DB Error: ${error.message}`, { sql, error: error.stack });
  }
};

// Add security logging
logger.security = {
  loginAttempt: (email, success, ip) => {
    const message = `Login attempt for ${email} from ${ip}: ${success ? 'SUCCESS' : 'FAILED'}`;
    if (success) {
      logger.info(message);
    } else {
      logger.warn(message);
    }
  },
  
  suspiciousActivity: (activity, userId, ip) => {
    logger.warn(`Suspicious activity detected: ${activity}`, {
      userId,
      ip,
      timestamp: new Date().toISOString()
    });
  },
  
  dataAccess: (resource, action, userId) => {
    logger.info(`Data access: ${action} on ${resource}`, {
      userId,
      timestamp: new Date().toISOString()
    });
  }
};

// Add business logging
logger.business = {
  customerAction: (action, customerId, userId) => {
    logger.info(`Customer action: ${action}`, {
      customerId,
      userId,
      timestamp: new Date().toISOString()
    });
  },
  
  paymentEvent: (event, amount, customerId) => {
    logger.info(`Payment event: ${event}`, {
      amount,
      customerId,
      timestamp: new Date().toISOString()
    });
  },
  
  systemEvent: (event, details) => {
    logger.info(`System event: ${event}`, {
      details,
      timestamp: new Date().toISOString()
    });
  }
};

// Add performance monitoring
logger.performance = {
  apiCall: (endpoint, duration, statusCode) => {
    const level = duration > 1000 ? 'warn' : 'info';
    logger[level](`API Performance: ${endpoint} took ${duration}ms`, {
      endpoint,
      duration,
      statusCode,
      timestamp: new Date().toISOString()
    });
  },
  
  dbQuery: (query, duration) => {
    const level = duration > 500 ? 'warn' : 'debug';
    logger[level](`DB Performance: Query took ${duration}ms`, {
      query: query.substring(0, 100) + '...',
      duration,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = logger;
