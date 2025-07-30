// Staff Management System - Data Types and Models

export const StaffRoles = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  TEAM_LEAD: 'team_lead',
  DRIVER: 'driver',
  MOVER: 'mover',
  PACKER: 'packer',
  CUSTOMER_SERVICE: 'customer_service',
  SALES_REP: 'sales_rep',
  ACCOUNTANT: 'accountant',
  HR_OFFICER: 'hr_officer',
  CLEANER: 'cleaner',
  SECURITY: 'security'
};

export const StaffStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  SUSPENDED: 'suspended',
  TERMINATED: 'terminated',
  PROBATION: 'probation'
};

export const EmploymentType = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  CASUAL: 'casual',
  INTERN: 'intern'
};

export const Departments = {
  OPERATIONS: 'operations',
  SALES: 'sales',
  CUSTOMER_SERVICE: 'customer_service',
  FINANCE: 'finance',
  HR: 'hr',
  ADMIN: 'admin',
  SECURITY: 'security',
  MAINTENANCE: 'maintenance'
};

export const ShiftTypes = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night',
  FULL_DAY: 'full_day',
  FLEXIBLE: 'flexible'
};

export const LeaveTypes = {
  ANNUAL: 'annual',
  SICK: 'sick',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  EMERGENCY: 'emergency',
  UNPAID: 'unpaid',
  STUDY: 'study',
  COMPASSIONATE: 'compassionate'
};

export const PayrollFrequency = {
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly'
};

export const PaymentMethods = {
  MPESA: 'mpesa',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  CHEQUE: 'cheque'
};

// Staff Data Structure
export const StaffSchema = {
  // Basic Information
  id: '',
  employeeNumber: '', // Auto-generated unique identifier
  status: StaffStatus.ACTIVE,
  
  // Personal Information
  personalInfo: {
    title: '', // Mr, Mrs, Ms, Dr, etc.
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: null,
    gender: '', // male, female, other
    nationality: 'Kenyan',
    idNumber: '',
    passportNumber: '',
    profilePhoto: null,
    maritalStatus: '', // single, married, divorced, widowed
    religion: '',
    nextOfKin: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: ''
    }
  },
  
  // Contact Information
  contactInfo: {
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    alternateEmail: '',
    whatsappNumber: '',
    address: {
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Kenya',
      coordinates: {
        latitude: null,
        longitude: null
      }
    }
  },
  
  // Employment Information
  employmentInfo: {
    role: StaffRoles.MOVER,
    department: Departments.OPERATIONS,
    employmentType: EmploymentType.FULL_TIME,
    hireDate: null,
    probationEndDate: null,
    contractEndDate: null,
    reportingManager: '', // Staff ID
    workLocation: '',
    jobDescription: '',
    responsibilities: [],
    skills: [],
    certifications: []
  },
  
  // Payroll Information
  payrollInfo: {
    basicSalary: 0,
    currency: 'KSH',
    payrollFrequency: PayrollFrequency.MONTHLY,
    paymentMethod: PaymentMethods.MPESA,
    mpesaNumber: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      branchCode: '',
      swiftCode: ''
    },
    taxNumber: '', // KRA PIN
    nhifNumber: '',
    nssfNumber: '',
    allowances: [
      {
        id: '',
        name: '', // transport, housing, meal, etc.
        amount: 0,
        frequency: 'monthly', // monthly, daily, per_move
        taxable: true
      }
    ],
    deductions: [
      {
        id: '',
        name: '', // loan, advance, uniform, etc.
        amount: 0,
        frequency: 'monthly',
        startDate: null,
        endDate: null,
        balance: 0
      }
    ]
  },
  
  // Schedule Information
  scheduleInfo: {
    shiftType: ShiftTypes.FULL_DAY,
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '08:00',
    endTime: '17:00',
    breakDuration: 60, // minutes
    overtimeRate: 1.5, // multiplier
    weeklyHours: 40,
    flexibleSchedule: false
  },
  
  // Performance Information
  performanceInfo: {
    currentRating: 0, // 1-5 scale
    lastReviewDate: null,
    nextReviewDate: null,
    goals: [
      {
        id: '',
        title: '',
        description: '',
        targetDate: null,
        status: 'pending', // pending, in_progress, completed, cancelled
        progress: 0 // percentage
      }
    ],
    achievements: [
      {
        id: '',
        title: '',
        description: '',
        date: null,
        category: '' // award, milestone, recognition
      }
    ],
    disciplinaryActions: [
      {
        id: '',
        type: '', // warning, suspension, termination
        reason: '',
        date: null,
        description: '',
        actionTaken: '',
        issuedBy: ''
      }
    ]
  },
  
  // Attendance Information
  attendanceInfo: {
    totalWorkingDays: 0,
    daysPresent: 0,
    daysAbsent: 0,
    lateArrivals: 0,
    earlyDepartures: 0,
    overtimeHours: 0,
    attendanceRate: 0, // percentage
    punctualityRate: 0 // percentage
  },
  
  // Leave Information
  leaveInfo: {
    annualLeaveEntitlement: 21, // days per year
    annualLeaveUsed: 0,
    annualLeaveBalance: 21,
    sickLeaveUsed: 0,
    otherLeaveUsed: 0,
    leaveHistory: [
      {
        id: '',
        type: LeaveTypes.ANNUAL,
        startDate: null,
        endDate: null,
        days: 0,
        reason: '',
        status: 'pending', // pending, approved, rejected, cancelled
        approvedBy: '',
        appliedDate: null,
        approvalDate: null
      }
    ]
  },
  
  // Training Information
  trainingInfo: {
    completedTrainings: [
      {
        id: '',
        name: '',
        provider: '',
        completionDate: null,
        certificateUrl: '',
        expiryDate: null,
        score: null
      }
    ],
    ongoingTrainings: [
      {
        id: '',
        name: '',
        provider: '',
        startDate: null,
        expectedCompletionDate: null,
        progress: 0 // percentage
      }
    ],
    requiredTrainings: [
      {
        id: '',
        name: '',
        dueDate: null,
        priority: 'high' // high, medium, low
      }
    ]
  },
  
  // Documents
  documents: [
    {
      id: '',
      name: '',
      type: 'contract', // contract, id_copy, certificate, cv, photo
      url: '',
      uploadDate: null,
      uploadedBy: '',
      expiryDate: null,
      isActive: true
    }
  ],
  
  // Access Control
  accessControl: {
    permissions: [], // Array of permission strings
    canAccessCustomers: false,
    canAccessFinance: false,
    canAccessReports: false,
    canManageStaff: false,
    canProcessPayroll: false,
    lastLoginAt: null,
    loginAttempts: 0,
    accountLocked: false,
    passwordLastChanged: null,
    twoFactorEnabled: false
  },
  
  // Emergency Information
  emergencyInfo: {
    medicalConditions: '',
    allergies: '',
    medications: '',
    bloodType: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: ''
    },
    hospitalPreference: '',
    insuranceProvider: '',
    insuranceNumber: ''
  },
  
  // System Information
  systemInfo: {
    createdAt: null,
    createdBy: '',
    updatedAt: null,
    updatedBy: '',
    onboardingCompleted: false,
    onboardingDate: null,
    offboardingDate: null,
    offboardingReason: '',
    notes: [
      {
        id: '',
        content: '',
        type: 'general', // general, important, warning, hr
        createdBy: '',
        createdAt: null,
        isPrivate: true
      }
    ]
  }
};

// Staff Search and Filter Options
export const StaffFilters = {
  status: Object.values(StaffStatus),
  role: Object.values(StaffRoles),
  department: Object.values(Departments),
  employmentType: Object.values(EmploymentType),
  shiftType: Object.values(ShiftTypes)
};

// Staff Validation Rules
export const StaffValidation = {
  required: ['firstName', 'lastName', 'primaryPhone', 'email', 'role', 'department'],
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+254|0)[17]\d{8}$/, // Kenyan phone number format
  idNumber: /^\d{8}$/, // Kenyan ID number format
  employeeNumber: /^EMP\d{4}$/ // Employee number format
};

// Role Permissions
export const RolePermissions = {
  [StaffRoles.ADMIN]: [
    'manage_all_staff',
    'process_payroll',
    'access_all_reports',
    'manage_system_settings',
    'access_all_customers',
    'manage_finances'
  ],
  [StaffRoles.MANAGER]: [
    'manage_department_staff',
    'approve_leave',
    'access_department_reports',
    'access_all_customers',
    'view_payroll_reports'
  ],
  [StaffRoles.SUPERVISOR]: [
    'manage_team_staff',
    'approve_overtime',
    'access_team_reports',
    'access_assigned_customers'
  ],
  [StaffRoles.TEAM_LEAD]: [
    'view_team_staff',
    'assign_tasks',
    'access_team_performance',
    'access_assigned_customers'
  ],
  [StaffRoles.HR_OFFICER]: [
    'manage_all_staff',
    'process_payroll',
    'manage_leave',
    'access_hr_reports',
    'manage_training'
  ],
  [StaffRoles.ACCOUNTANT]: [
    'process_payroll',
    'manage_finances',
    'access_financial_reports',
    'manage_deductions'
  ],
  [StaffRoles.SALES_REP]: [
    'access_assigned_customers',
    'manage_quotes',
    'view_sales_reports'
  ],
  [StaffRoles.CUSTOMER_SERVICE]: [
    'access_all_customers',
    'manage_communications',
    'view_service_reports'
  ],
  [StaffRoles.DRIVER]: [
    'access_assigned_moves',
    'update_move_status',
    'view_schedule'
  ],
  [StaffRoles.MOVER]: [
    'access_assigned_moves',
    'update_move_status',
    'view_schedule'
  ],
  [StaffRoles.PACKER]: [
    'access_assigned_moves',
    'update_packing_status',
    'view_schedule'
  ]
};

export default {
  StaffRoles,
  StaffStatus,
  EmploymentType,
  Departments,
  ShiftTypes,
  LeaveTypes,
  PayrollFrequency,
  PaymentMethods,
  StaffSchema,
  StaffFilters,
  StaffValidation,
  RolePermissions
};
