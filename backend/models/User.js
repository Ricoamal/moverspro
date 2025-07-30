const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
      }
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 255]
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [10, 20]
      }
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'manager', 'staff', 'customer'),
      allowNull: false,
      defaultValue: 'staff'
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    job_title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hire_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    employment_type: {
      type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'intern'),
      allowNull: true,
      defaultValue: 'full_time'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'terminated'),
      allowNull: false,
      defaultValue: 'active'
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login_ip: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email_verification_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    two_factor_secret: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        theme: 'light',
        language: 'en',
        timezone: 'Africa/Nairobi',
        notifications: {
          email: true,
          sms: false,
          push: true,
          desktop: true
        },
        dashboard: {
          widgets: ['recent_customers', 'pending_quotes', 'revenue_chart', 'upcoming_moves']
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['role']
      },
      {
        fields: ['status']
      },
      {
        fields: ['department_id']
      }
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  // Instance methods
  User.prototype.getFullName = function() {
    return `${this.first_name} ${this.last_name}`;
  };

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.hasPermission = function(permission) {
    if (this.role === 'super_admin') return true;
    return this.permissions && this.permissions.includes(permission);
  };

  User.prototype.hasRole = function(role) {
    return this.role === role;
  };

  User.prototype.hasAnyRole = function(roles) {
    return roles.includes(this.role);
  };

  User.prototype.canAccessCompany = function(companyId) {
    if (this.role === 'super_admin') return true;
    return this.company_id === companyId;
  };

  User.prototype.updateLastLogin = function(ip) {
    return this.update({
      last_login_at: new Date(),
      last_login_ip: ip
    });
  };

  User.prototype.generatePasswordResetToken = function() {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    return this.update({
      password_reset_token: token,
      password_reset_expires: expires
    }).then(() => token);
  };

  User.prototype.generateEmailVerificationToken = function() {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');

    return this.update({
      email_verification_token: token
    }).then(() => token);
  };

  User.prototype.verifyEmail = function() {
    return this.update({
      email_verified_at: new Date(),
      email_verification_token: null
    });
  };

  User.prototype.isEmailVerified = function() {
    return this.email_verified_at !== null;
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    
    // Remove sensitive fields
    delete values.password;
    delete values.password_reset_token;
    delete values.password_reset_expires;
    delete values.email_verification_token;
    delete values.two_factor_secret;
    
    return values;
  };

  // Class methods
  User.findByEmail = function(email) {
    return this.findOne({ 
      where: { email, is_active: true },
      include: ['company', 'department']
    });
  };

  User.findByResetToken = function(token) {
    return this.findOne({
      where: {
        password_reset_token: token,
        password_reset_expires: {
          [sequelize.Op.gt]: new Date()
        },
        is_active: true
      }
    });
  };

  User.findByVerificationToken = function(token) {
    return this.findOne({
      where: {
        email_verification_token: token,
        is_active: true
      }
    });
  };

  // Associations
  User.associate = function(models) {
    // User belongs to company
    User.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });

    // User belongs to department
    User.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });

    // User has many activity logs
    User.hasMany(models.ActivityLog, {
      foreignKey: 'user_id',
      as: 'activityLogs'
    });

    // User has many notifications
    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications'
    });
  };

  return User;
};
