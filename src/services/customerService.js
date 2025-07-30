// Customer Management Service Layer
import { CustomerSchema, CustomerValidation, CustomerStatus } from '../types/customer.js';
import { loadSampleCustomers } from '../data/sampleCustomers.js';

class CustomerService {
  constructor() {
    // Load sample data if no customers exist
    loadSampleCustomers();
    this.customers = this.loadCustomers();
    this.nextCustomerNumber = this.getNextCustomerNumber();
  }

  // Load customers from localStorage
  loadCustomers() {
    try {
      const stored = localStorage.getItem('moveease_customers');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading customers:', error);
      return [];
    }
  }

  // Save customers to localStorage
  saveCustomers() {
    try {
      localStorage.setItem('moveease_customers', JSON.stringify(this.customers));
      return true;
    } catch (error) {
      console.error('Error saving customers:', error);
      return false;
    }
  }

  // Generate next customer number
  getNextCustomerNumber() {
    const maxNumber = this.customers.reduce((max, customer) => {
      const num = parseInt(customer.customerNumber.replace('CUST', ''));
      return num > max ? num : max;
    }, 1000);
    return maxNumber + 1;
  }

  // Generate unique customer ID
  generateCustomerId() {
    return 'cust_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Validate customer data
  validateCustomer(customerData) {
    const errors = {};

    // Required fields validation
    CustomerValidation.required.forEach(field => {
      const value = this.getNestedValue(customerData, field);
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors[field] = `${field} is required`;
      }
    });

    // Email validation
    if (customerData.contactInfo?.email) {
      if (!CustomerValidation.email.test(customerData.contactInfo.email)) {
        errors.email = 'Invalid email format';
      }
    }

    // Phone validation
    if (customerData.contactInfo?.primaryPhone) {
      if (!CustomerValidation.phone.test(customerData.contactInfo.primaryPhone)) {
        errors.primaryPhone = 'Invalid phone number format';
      }
    }

    // ID Number validation
    if (customerData.personalInfo?.idNumber) {
      if (!CustomerValidation.idNumber.test(customerData.personalInfo.idNumber)) {
        errors.idNumber = 'Invalid ID number format';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Helper function to get nested object values
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Create new customer
  async createCustomer(customerData) {
    try {
      // Validate customer data
      const validation = this.validateCustomer(customerData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
      }

      // Check for duplicate email or phone
      const existingCustomer = this.customers.find(c => 
        c.contactInfo.email === customerData.contactInfo?.email ||
        c.contactInfo.primaryPhone === customerData.contactInfo?.primaryPhone
      );

      if (existingCustomer) {
        throw new Error('Customer with this email or phone already exists');
      }

      // Create customer object
      const customer = {
        ...CustomerSchema,
        id: this.generateCustomerId(),
        customerNumber: `CUST${this.nextCustomerNumber.toString().padStart(4, '0')}`,
        ...customerData,
        systemInfo: {
          ...CustomerSchema.systemInfo,
          createdAt: new Date().toISOString(),
          createdBy: 'system', // TODO: Get from auth context
          updatedAt: new Date().toISOString(),
          updatedBy: 'system'
        }
      };

      // Add to customers array
      this.customers.push(customer);
      this.nextCustomerNumber++;

      // Save to storage
      this.saveCustomers();

      return {
        success: true,
        data: customer,
        message: 'Customer created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create customer'
      };
    }
  }

  // Get customer by ID
  getCustomerById(customerId) {
    try {
      const customer = this.customers.find(c => c.id === customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      return {
        success: true,
        data: customer
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get customer by customer number
  getCustomerByNumber(customerNumber) {
    try {
      const customer = this.customers.find(c => c.customerNumber === customerNumber);
      if (!customer) {
        throw new Error('Customer not found');
      }

      return {
        success: true,
        data: customer
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update customer
  async updateCustomer(customerId, updateData) {
    try {
      const customerIndex = this.customers.findIndex(c => c.id === customerId);
      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      // Validate update data
      const mergedData = { ...this.customers[customerIndex], ...updateData };
      const validation = this.validateCustomer(mergedData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
      }

      // Update customer
      this.customers[customerIndex] = {
        ...this.customers[customerIndex],
        ...updateData,
        systemInfo: {
          ...this.customers[customerIndex].systemInfo,
          updatedAt: new Date().toISOString(),
          updatedBy: 'system' // TODO: Get from auth context
        }
      };

      // Save to storage
      this.saveCustomers();

      return {
        success: true,
        data: this.customers[customerIndex],
        message: 'Customer updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update customer'
      };
    }
  }

  // Delete customer (soft delete)
  async deleteCustomer(customerId) {
    try {
      const customerIndex = this.customers.findIndex(c => c.id === customerId);
      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      // Soft delete by changing status
      this.customers[customerIndex].status = CustomerStatus.INACTIVE;
      this.customers[customerIndex].systemInfo.updatedAt = new Date().toISOString();
      this.customers[customerIndex].systemInfo.updatedBy = 'system';

      // Save to storage
      this.saveCustomers();

      return {
        success: true,
        message: 'Customer deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete customer'
      };
    }
  }

  // Get all customers with filtering and pagination
  getCustomers(options = {}) {
    try {
      let filteredCustomers = [...this.customers];

      // Apply filters
      if (options.status) {
        filteredCustomers = filteredCustomers.filter(c => c.status === options.status);
      }

      if (options.type) {
        filteredCustomers = filteredCustomers.filter(c => c.type === options.type);
      }

      if (options.tier) {
        filteredCustomers = filteredCustomers.filter(c => c.segmentation.tier === options.tier);
      }

      if (options.search) {
        const searchTerm = options.search.toLowerCase();
        filteredCustomers = filteredCustomers.filter(c => 
          c.personalInfo.firstName.toLowerCase().includes(searchTerm) ||
          c.personalInfo.lastName.toLowerCase().includes(searchTerm) ||
          c.contactInfo.email.toLowerCase().includes(searchTerm) ||
          c.contactInfo.primaryPhone.includes(searchTerm) ||
          c.customerNumber.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (options.sortBy) {
        filteredCustomers.sort((a, b) => {
          const aValue = this.getNestedValue(a, options.sortBy);
          const bValue = this.getNestedValue(b, options.sortBy);
          
          if (options.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      // Apply pagination
      const page = options.page || 1;
      const limit = options.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedCustomers,
        pagination: {
          page,
          limit,
          total: filteredCustomers.length,
          totalPages: Math.ceil(filteredCustomers.length / limit),
          hasNext: endIndex < filteredCustomers.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch customers'
      };
    }
  }

  // Search customers
  searchCustomers(query) {
    return this.getCustomers({ search: query });
  }

  // Get customer statistics
  getCustomerStats() {
    try {
      const stats = {
        total: this.customers.length,
        active: this.customers.filter(c => c.status === CustomerStatus.ACTIVE).length,
        inactive: this.customers.filter(c => c.status === CustomerStatus.INACTIVE).length,
        prospects: this.customers.filter(c => c.status === CustomerStatus.PROSPECT).length,
        vip: this.customers.filter(c => c.type === 'vip').length,
        corporate: this.customers.filter(c => c.type === 'corporate').length,
        individual: this.customers.filter(c => c.type === 'individual').length,
        totalLifetimeValue: this.customers.reduce((sum, c) => sum + (c.segmentation.lifetimeValue || 0), 0),
        averageLifetimeValue: 0
      };

      stats.averageLifetimeValue = stats.total > 0 ? stats.totalLifetimeValue / stats.total : 0;

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add move to customer history
  addMoveToHistory(customerId, moveData) {
    try {
      const customerIndex = this.customers.findIndex(c => c.id === customerId);
      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      const move = {
        id: 'move_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        ...moveData,
        date: moveData.date || new Date().toISOString()
      };

      this.customers[customerIndex].moveHistory.push(move);
      this.saveCustomers();

      return {
        success: true,
        data: move,
        message: 'Move added to customer history'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add communication record
  addCommunication(customerId, communicationData) {
    try {
      const customerIndex = this.customers.findIndex(c => c.id === customerId);
      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      const communication = {
        id: 'comm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        ...communicationData,
        timestamp: new Date().toISOString()
      };

      this.customers[customerIndex].communications.push(communication);
      this.saveCustomers();

      return {
        success: true,
        data: communication,
        message: 'Communication record added'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Export customers data
  exportCustomers(format = 'json') {
    try {
      const data = this.customers.map(customer => ({
        customerNumber: customer.customerNumber,
        name: `${customer.personalInfo.firstName} ${customer.personalInfo.lastName}`,
        email: customer.contactInfo.email,
        phone: customer.contactInfo.primaryPhone,
        type: customer.type,
        status: customer.status,
        tier: customer.segmentation.tier,
        lifetimeValue: customer.segmentation.lifetimeValue,
        totalMoves: customer.moveHistory.length,
        createdAt: customer.systemInfo.createdAt
      }));

      if (format === 'csv') {
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');

        return {
          success: true,
          data: csvContent,
          filename: `customers_export_${new Date().toISOString().split('T')[0]}.csv`
        };
      }

      return {
        success: true,
        data: JSON.stringify(data, null, 2),
        filename: `customers_export_${new Date().toISOString().split('T')[0]}.json`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const customerService = new CustomerService();

export default customerService;
