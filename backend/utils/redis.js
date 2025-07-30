const redis = require('redis');
const logger = require('./logger');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Support both Upstash and traditional Redis
      const redisUrl = process.env.UPSTASH_REDIS_REST_URL || 
                      process.env.REDIS_URL || 
                      `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

      this.client = redis.createClient({
        url: redisUrl,
        password: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_PASSWORD,
        socket: {
          tls: process.env.NODE_ENV === 'production',
          rejectUnauthorized: false
        }
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis Client Connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        logger.info('Redis Client Ready');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        logger.info('Redis Client Disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      return true;
    } catch (error) {
      logger.error('Redis connection failed:', error);
      return false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    if (!this.isConnected) return false;
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async expire(key, ttl) {
    if (!this.isConnected) return false;
    try {
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error('Redis EXPIRE error:', error);
      return false;
    }
  }

  // Cache wrapper for functions
  async cache(key, fn, ttl = 3600) {
    try {
      // Try to get from cache first
      const cached = await this.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      // Execute function and cache result
      const result = await fn();
      if (result !== null && result !== undefined) {
        await this.set(key, JSON.stringify(result), ttl);
      }
      
      return result;
    } catch (error) {
      logger.error('Redis cache wrapper error:', error);
      // Fallback to executing function without cache
      return await fn();
    }
  }

  // Session management
  async setSession(sessionId, data, ttl = 86400) { // 24 hours default
    return await this.set(`session:${sessionId}`, JSON.stringify(data), ttl);
  }

  async getSession(sessionId) {
    const data = await this.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  async deleteSession(sessionId) {
    return await this.del(`session:${sessionId}`);
  }

  // Rate limiting
  async checkRateLimit(key, limit, window) {
    try {
      const current = await this.client.incr(key);
      if (current === 1) {
        await this.client.expire(key, window);
      }
      return current <= limit;
    } catch (error) {
      logger.error('Redis rate limit error:', error);
      return true; // Allow on error
    }
  }

  // Health check
  async ping() {
    if (!this.isConnected) return false;
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('Redis ping error:', error);
      return false;
    }
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      client: !!this.client
    };
  }
}

// Create singleton instance
const redisService = new RedisService();

// Auto-connect in production
if (process.env.NODE_ENV === 'production') {
  redisService.connect().catch(err => {
    logger.error('Failed to connect to Redis on startup:', err);
  });
}

module.exports = redisService;
