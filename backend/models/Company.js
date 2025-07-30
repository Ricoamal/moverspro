module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [10, 20]
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Kenya'
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Moving & Storage'
    },
    company_size: {
      type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '500+'),
      allowNull: false,
      defaultValue: '1-10'
    },
    founded_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1900,
        max: new Date().getFullYear()
      }
    },
    license_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tax_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'trial'),
      allowNull: false,
      defaultValue: 'trial'
    },
    subscription_plan: {
      type: DataTypes.ENUM('trial', 'basic', 'professional', 'enterprise'),
      allowNull: false,
      defaultValue: 'trial'
    },
    subscription_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trial_ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: () => {
        const date = new Date();
        date.setDate(date.getDate() + 30); // 30-day trial
        return date;
      }
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        timezone: 'Africa/Nairobi',
        currency: 'KES',
        date_format: 'DD/MM/YYYY',
        time_format: '24h',
        language: 'en',
        business_hours: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '08:00', close: '16:00', closed: false },
          sunday: { open: '10:00', close: '16:00', closed: true }
        },
        notifications: {
          email: true,
          sms: true,
          push: true
        },
        features: {
          website_builder: true,
          crm: true,
          payroll: true,
          analytics: true
        }
      }
    },
    branding: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        primary_color: '#3B82F6',
        secondary_color: '#1E40AF',
        accent_color: '#F59E0B',
        logo_url: null,
        favicon_url: null,
        custom_css: null
      }
    },
    integrations: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        mpesa: {
          enabled: false,
          consumer_key: null,
          consumer_secret: null,
          shortcode: null,
          passkey: null
        },
        email: {
          enabled: false,
          provider: 'smtp',
          smtp_host: null,
          smtp_port: 587,
          smtp_user: null,
          smtp_pass: null
        },
        sms: {
          enabled: false,
          provider: 'twilio',
          account_sid: null,
          auth_token: null,
          phone_number: null
        },
        google: {
          analytics_id: null,
          maps_api_key: null,
          calendar_enabled: false
        }
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'companies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['slug']
      },
      {
        fields: ['status']
      },
      {
        fields: ['subscription_plan']
      }
    ]
  });

  // Instance methods
  Company.prototype.isTrialExpired = function() {
    return this.trial_ends_at && new Date() > this.trial_ends_at;
  };

  Company.prototype.isSubscriptionExpired = function() {
    return this.subscription_expires_at && new Date() > this.subscription_expires_at;
  };

  Company.prototype.canAccessFeature = function(feature) {
    const features = this.settings?.features || {};
    return features[feature] === true;
  };

  Company.prototype.getBusinessHours = function(day) {
    const businessHours = this.settings?.business_hours || {};
    return businessHours[day.toLowerCase()] || null;
  };

  Company.prototype.isBusinessOpen = function(datetime = new Date()) {
    const day = datetime.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const hours = this.getBusinessHours(day);
    
    if (!hours || hours.closed) {
      return false;
    }

    const currentTime = datetime.toTimeString().slice(0, 5);
    return currentTime >= hours.open && currentTime <= hours.close;
  };

  // Class methods
  Company.findBySlug = function(slug) {
    return this.findOne({ where: { slug, is_active: true } });
  };

  Company.findActive = function() {
    return this.findAll({ 
      where: { 
        is_active: true,
        status: 'active'
      } 
    });
  };

  // Associations
  Company.associate = function(models) {
    // Company has many users
    Company.hasMany(models.User, {
      foreignKey: 'company_id',
      as: 'users'
    });

    // Company has many customers
    Company.hasMany(models.Customer, {
      foreignKey: 'company_id',
      as: 'customers'
    });

    // Company has many staff
    Company.hasMany(models.Staff, {
      foreignKey: 'company_id',
      as: 'staff'
    });

    // Company has many departments
    Company.hasMany(models.Department, {
      foreignKey: 'company_id',
      as: 'departments'
    });

    // Company has many websites
    Company.hasMany(models.Website, {
      foreignKey: 'company_id',
      as: 'websites'
    });

    // Company has many settings
    Company.hasMany(models.Setting, {
      foreignKey: 'company_id',
      as: 'companySettings'
    });

    // Company has many activity logs
    Company.hasMany(models.ActivityLog, {
      foreignKey: 'company_id',
      as: 'activityLogs'
    });
  };

  return Company;
};
