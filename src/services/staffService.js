// Staff Management Service Layer
import { StaffSchema, StaffValidation, StaffStatus, RolePermissions } from '../types/staff.js';
import { loadSampleStaff } from '../data/sampleStaff.js';

class StaffService {
  constructor() {
    // Load sample data if no staff exist
    loadSampleStaff();
    this.staff = this.loadStaff();
    this.nextEmployeeNumber = this.getNextEmployeeNumber();
  }

  // Load staff from localStorage
  loadStaff() {
    try {
      const stored = localStorage.getItem('moveease_staff');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading staff:', error);
      return [];
    }
  }

  // Save staff to localStorage
  saveStaff() {
    try {
      localStorage.setItem('moveease_staff', JSON.stringify(this.staff));
      return true;
    } catch (error) {
      console.error('Error saving staff:', error);
      return false;
    }
  }

  // Generate next employee number
  getNextEmployeeNumber() {
    const maxNumber = this.staff.reduce((max, employee) => {
      const num = parseInt(employee.employeeNumber.replace('EMP', ''));
      return num > max ? num : max;
    }, 1000);
    return maxNumber + 1;
  }

  // Generate unique staff ID
  generateStaffId() {
    return 'staff_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Validate staff data
  validateStaff(staffData) {
    const errors = {};

    // Required fields validation
    StaffValidation.required.forEach(field => {
      const value = this.getNestedValue(staffData, field);
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors[field] = `${field} is required`;
      }
    });

    // Email validation
    if (staffData.contactInfo?.email) {
      if (!StaffValidation.email.test(staffData.contactInfo.email)) {
        errors.email = 'Invalid email format';
      }
    }

    // Phone validation
    if (staffData.contactInfo?.primaryPhone) {
      if (!StaffValidation.phone.test(staffData.contactInfo.primaryPhone)) {
        errors.primaryPhone = 'Invalid phone number format';
      }
    }

    // ID Number validation
    if (staffData.personalInfo?.idNumber) {
      if (!StaffValidation.idNumber.test(staffData.personalInfo.idNumber)) {
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

  // Create new staff member
  async createStaff(staffData) {
    try {
      // Validate staff data
      const validation = this.validateStaff(staffData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
      }

      // Check for duplicate email or phone
      const existingStaff = this.staff.find(s => 
        s.contactInfo.email === staffData.contactInfo?.email ||
        s.contactInfo.primaryPhone === staffData.contactInfo?.primaryPhone
      );

      if (existingStaff) {
        throw new Error('Staff member with this email or phone already exists');
      }

      // Create staff object
      const employee = {
        ...StaffSchema,
        id: this.generateStaffId(),
        employeeNumber: `EMP${this.nextEmployeeNumber.toString().padStart(4, '0')}`,
        ...staffData,
        accessControl: {
          ...StaffSchema.accessControl,
          permissions: RolePermissions[staffData.employmentInfo?.role] || []
        },
        systemInfo: {
          ...StaffSchema.systemInfo,
          createdAt: new Date().toISOString(),
          createdBy: 'system', // TODO: Get from auth context
          updatedAt: new Date().toISOString(),
          updatedBy: 'system'
        }
      };

      // Add to staff array
      this.staff.push(employee);
      this.nextEmployeeNumber++;

      // Save to storage
      this.saveStaff();

      return {
        success: true,
        data: employee,
        message: 'Staff member created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create staff member'
      };
    }
  }

  // Get staff member by ID
  getStaffById(staffId) {
    try {
      const employee = this.staff.find(s => s.id === staffId);
      if (!employee) {
        throw new Error('Staff member not found');
      }

      return {
        success: true,
        data: employee
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get staff member by employee number
  getStaffByEmployeeNumber(employeeNumber) {
    try {
      const employee = this.staff.find(s => s.employeeNumber === employeeNumber);
      if (!employee) {
        throw new Error('Staff member not found');
      }

      return {
        success: true,
        data: employee
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update staff member
  async updateStaff(staffId, updateData) {
    try {
      const staffIndex = this.staff.findIndex(s => s.id === staffId);
      if (staffIndex === -1) {
        throw new Error('Staff member not found');
      }

      // Validate update data
      const mergedData = { ...this.staff[staffIndex], ...updateData };
      const validation = this.validateStaff(mergedData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
      }

      // Update permissions if role changed
      if (updateData.employmentInfo?.role) {
        updateData.accessControl = {
          ...this.staff[staffIndex].accessControl,
          permissions: RolePermissions[updateData.employmentInfo.role] || []
        };
      }

      // Update staff member
      this.staff[staffIndex] = {
        ...this.staff[staffIndex],
        ...updateData,
        systemInfo: {
          ...this.staff[staffIndex].systemInfo,
          updatedAt: new Date().toISOString(),
          updatedBy: 'system' // TODO: Get from auth context
        }
      };

      // Save to storage
      this.saveStaff();

      return {
        success: true,
        data: this.staff[staffIndex],
        message: 'Staff member updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update staff member'
      };
    }
  }

  // Delete staff member (soft delete)
  async deleteStaff(staffId) {
    try {
      const staffIndex = this.staff.findIndex(s => s.id === staffId);
      if (staffIndex === -1) {
        throw new Error('Staff member not found');
      }

      // Soft delete by changing status
      this.staff[staffIndex].status = StaffStatus.TERMINATED;
      this.staff[staffIndex].systemInfo.updatedAt = new Date().toISOString();
      this.staff[staffIndex].systemInfo.updatedBy = 'system';
      this.staff[staffIndex].systemInfo.offboardingDate = new Date().toISOString();

      // Save to storage
      this.saveStaff();

      return {
        success: true,
        message: 'Staff member deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete staff member'
      };
    }
  }

  // Get all staff with filtering and pagination
  getStaff(options = {}) {
    try {
      let filteredStaff = [...this.staff];

      // Apply filters
      if (options.status) {
        filteredStaff = filteredStaff.filter(s => s.status === options.status);
      }

      if (options.role) {
        filteredStaff = filteredStaff.filter(s => s.employmentInfo.role === options.role);
      }

      if (options.department) {
        filteredStaff = filteredStaff.filter(s => s.employmentInfo.department === options.department);
      }

      if (options.employmentType) {
        filteredStaff = filteredStaff.filter(s => s.employmentInfo.employmentType === options.employmentType);
      }

      if (options.search) {
        const searchTerm = options.search.toLowerCase();
        filteredStaff = filteredStaff.filter(s => 
          s.personalInfo.firstName.toLowerCase().includes(searchTerm) ||
          s.personalInfo.lastName.toLowerCase().includes(searchTerm) ||
          s.contactInfo.email.toLowerCase().includes(searchTerm) ||
          s.contactInfo.primaryPhone.includes(searchTerm) ||
          s.employeeNumber.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (options.sortBy) {
        filteredStaff.sort((a, b) => {
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

      const paginatedStaff = filteredStaff.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedStaff,
        pagination: {
          page,
          limit,
          total: filteredStaff.length,
          totalPages: Math.ceil(filteredStaff.length / limit),
          hasNext: endIndex < filteredStaff.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch staff'
      };
    }
  }

  // Get staff by department
  getStaffByDepartment(department) {
    return this.getStaff({ department });
  }

  // Get staff by role
  getStaffByRole(role) {
    return this.getStaff({ role });
  }

  // Get staff statistics
  getStaffStats() {
    try {
      const stats = {
        total: this.staff.length,
        active: this.staff.filter(s => s.status === StaffStatus.ACTIVE).length,
        inactive: this.staff.filter(s => s.status === StaffStatus.INACTIVE).length,
        onLeave: this.staff.filter(s => s.status === StaffStatus.ON_LEAVE).length,
        probation: this.staff.filter(s => s.status === StaffStatus.PROBATION).length,
        byDepartment: {},
        byRole: {},
        byEmploymentType: {},
        totalSalaryBudget: 0,
        averageSalary: 0
      };

      // Calculate department distribution
      this.staff.forEach(employee => {
        const dept = employee.employmentInfo.department;
        stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
        
        const role = employee.employmentInfo.role;
        stats.byRole[role] = (stats.byRole[role] || 0) + 1;
        
        const empType = employee.employmentInfo.employmentType;
        stats.byEmploymentType[empType] = (stats.byEmploymentType[empType] || 0) + 1;
        
        stats.totalSalaryBudget += employee.payrollInfo.basicSalary || 0;
      });

      stats.averageSalary = stats.total > 0 ? stats.totalSalaryBudget / stats.total : 0;

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

  // Add leave request
  addLeaveRequest(staffId, leaveData) {
    try {
      const staffIndex = this.staff.findIndex(s => s.id === staffId);
      if (staffIndex === -1) {
        throw new Error('Staff member not found');
      }

      const leave = {
        id: 'leave_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        ...leaveData,
        appliedDate: new Date().toISOString(),
        status: 'pending'
      };

      this.staff[staffIndex].leaveInfo.leaveHistory.push(leave);
      this.saveStaff();

      return {
        success: true,
        data: leave,
        message: 'Leave request submitted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Approve/Reject leave request
  updateLeaveRequest(staffId, leaveId, status, approvedBy) {
    try {
      const staffIndex = this.staff.findIndex(s => s.id === staffId);
      if (staffIndex === -1) {
        throw new Error('Staff member not found');
      }

      const leaveIndex = this.staff[staffIndex].leaveInfo.leaveHistory.findIndex(l => l.id === leaveId);
      if (leaveIndex === -1) {
        throw new Error('Leave request not found');
      }

      this.staff[staffIndex].leaveInfo.leaveHistory[leaveIndex].status = status;
      this.staff[staffIndex].leaveInfo.leaveHistory[leaveIndex].approvedBy = approvedBy;
      this.staff[staffIndex].leaveInfo.leaveHistory[leaveIndex].approvalDate = new Date().toISOString();

      // Update leave balances if approved
      if (status === 'approved') {
        const leave = this.staff[staffIndex].leaveInfo.leaveHistory[leaveIndex];
        if (leave.type === 'annual') {
          this.staff[staffIndex].leaveInfo.annualLeaveUsed += leave.days;
          this.staff[staffIndex].leaveInfo.annualLeaveBalance -= leave.days;
        } else if (leave.type === 'sick') {
          this.staff[staffIndex].leaveInfo.sickLeaveUsed += leave.days;
        } else {
          this.staff[staffIndex].leaveInfo.otherLeaveUsed += leave.days;
        }
      }

      this.saveStaff();

      return {
        success: true,
        message: `Leave request ${status} successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add training record
  addTraining(staffId, trainingData) {
    try {
      const staffIndex = this.staff.findIndex(s => s.id === staffId);
      if (staffIndex === -1) {
        throw new Error('Staff member not found');
      }

      const training = {
        id: 'training_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        ...trainingData
      };

      if (trainingData.status === 'completed') {
        this.staff[staffIndex].trainingInfo.completedTrainings.push(training);
      } else {
        this.staff[staffIndex].trainingInfo.ongoingTrainings.push(training);
      }

      this.saveStaff();

      return {
        success: true,
        data: training,
        message: 'Training record added successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Export staff data
  exportStaff(format = 'json') {
    try {
      const data = this.staff.map(employee => ({
        employeeNumber: employee.employeeNumber,
        name: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
        email: employee.contactInfo.email,
        phone: employee.contactInfo.primaryPhone,
        role: employee.employmentInfo.role,
        department: employee.employmentInfo.department,
        status: employee.status,
        hireDate: employee.employmentInfo.hireDate,
        basicSalary: employee.payrollInfo.basicSalary,
        paymentMethod: employee.payrollInfo.paymentMethod
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
          filename: `staff_export_${new Date().toISOString().split('T')[0]}.csv`
        };
      }

      return {
        success: true,
        data: JSON.stringify(data, null, 2),
        filename: `staff_export_${new Date().toISOString().split('T')[0]}.json`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check user permissions
  hasPermission(staffId, permission) {
    try {
      const employee = this.staff.find(s => s.id === staffId);
      if (!employee) {
        return false;
      }

      return employee.accessControl.permissions.includes(permission);
    } catch (error) {
      return false;
    }
  }

  // Get staff for payroll processing
  getStaffForPayroll(payrollDate = new Date()) {
    try {
      const activeStaff = this.staff.filter(s => 
        s.status === StaffStatus.ACTIVE || s.status === StaffStatus.ON_LEAVE
      );

      return {
        success: true,
        data: activeStaff.map(employee => ({
          id: employee.id,
          employeeNumber: employee.employeeNumber,
          name: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
          department: employee.employmentInfo.department,
          role: employee.employmentInfo.role,
          basicSalary: employee.payrollInfo.basicSalary,
          allowances: employee.payrollInfo.allowances,
          deductions: employee.payrollInfo.deductions,
          paymentMethod: employee.payrollInfo.paymentMethod,
          mpesaNumber: employee.payrollInfo.mpesaNumber,
          bankDetails: employee.payrollInfo.bankDetails,
          taxNumber: employee.payrollInfo.taxNumber
        }))
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
const staffService = new StaffService();

export default staffService;
