// Enhanced Payroll & Compensation System - Data Types and Models

export const PayrollStatus = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

export const PayrollPeriodType = {
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually'
};

export const TaxBrackets = {
  KENYA: [
    { min: 0, max: 24000, rate: 0.10, relief: 2400 },
    { min: 24001, max: 32333, rate: 0.25, relief: 0 },
    { min: 32334, max: 500000, rate: 0.30, relief: 0 },
    { min: 500001, max: 800000, rate: 0.325, relief: 0 },
    { min: 800001, max: Infinity, rate: 0.35, relief: 0 }
  ]
};

export const StatutoryRates = {
  NHIF: [
    { min: 0, max: 5999, amount: 150 },
    { min: 6000, max: 7999, amount: 300 },
    { min: 8000, max: 11999, amount: 400 },
    { min: 12000, max: 14999, amount: 500 },
    { min: 15000, max: 19999, amount: 600 },
    { min: 20000, max: 24999, amount: 750 },
    { min: 25000, max: 29999, amount: 850 },
    { min: 30000, max: 34999, amount: 900 },
    { min: 35000, max: 39999, amount: 950 },
    { min: 40000, max: 44999, amount: 1000 },
    { min: 45000, max: 49999, amount: 1100 },
    { min: 50000, max: 59999, amount: 1200 },
    { min: 60000, max: 69999, amount: 1300 },
    { min: 70000, max: 79999, amount: 1400 },
    { min: 80000, max: 89999, amount: 1500 },
    { min: 90000, max: 99999, amount: 1600 },
    { min: 100000, max: Infinity, amount: 1700 }
  ],
  NSSF: {
    rate: 0.06, // 6% of pensionable pay
    maxContribution: 2160, // Maximum monthly contribution
    employeeRate: 0.06,
    employerRate: 0.06
  },
  HOUSING_LEVY: {
    rate: 0.015, // 1.5% of gross salary
    maxContribution: 2500 // Maximum monthly contribution
  }
};

export const AllowanceTypes = {
  TRANSPORT: 'transport',
  HOUSING: 'housing',
  MEAL: 'meal',
  MEDICAL: 'medical',
  COMMUNICATION: 'communication',
  OVERTIME: 'overtime',
  COMMISSION: 'commission',
  BONUS: 'bonus',
  ACTING: 'acting',
  RESPONSIBILITY: 'responsibility',
  HARDSHIP: 'hardship',
  RISK: 'risk',
  SHIFT: 'shift',
  LEAVE: 'leave',
  THIRTEENTH_MONTH: 'thirteenth_month'
};

export const DeductionTypes = {
  LOAN: 'loan',
  ADVANCE: 'advance',
  UNIFORM: 'uniform',
  DAMAGE: 'damage',
  FINE: 'fine',
  UNION_DUES: 'union_dues',
  INSURANCE: 'insurance',
  SAVINGS: 'savings',
  WELFARE: 'welfare',
  GARNISHMENT: 'garnishment',
  COURT_ORDER: 'court_order',
  OVERPAYMENT: 'overpayment'
};

export const PayrollItemStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  COMPLETED: 'completed'
};

// Payroll Period Schema
export const PayrollPeriodSchema = {
  id: '',
  name: '', // e.g., "January 2024 Payroll"
  periodType: PayrollPeriodType.MONTHLY,
  startDate: null,
  endDate: null,
  payDate: null,
  status: PayrollStatus.DRAFT,
  totalEmployees: 0,
  totalGrossPay: 0,
  totalDeductions: 0,
  totalNetPay: 0,
  totalTax: 0,
  totalNHIF: 0,
  totalNSSF: 0,
  totalHousingLevy: 0,
  createdAt: null,
  createdBy: '',
  approvedAt: null,
  approvedBy: '',
  processedAt: null,
  processedBy: '',
  notes: ''
};

// Payroll Item Schema (Individual Employee Payroll)
export const PayrollItemSchema = {
  id: '',
  payrollPeriodId: '',
  employeeId: '',
  employeeNumber: '',
  employeeName: '',
  department: '',
  role: '',
  
  // Basic Pay Information
  basicSalary: 0,
  daysWorked: 0,
  totalWorkingDays: 0,
  hoursWorked: 0,
  overtimeHours: 0,
  overtimeRate: 1.5,
  
  // Allowances
  allowances: [
    {
      id: '',
      type: AllowanceTypes.TRANSPORT,
      name: '',
      amount: 0,
      taxable: true,
      frequency: 'monthly', // monthly, daily, hourly, per_move
      prorated: false
    }
  ],
  totalAllowances: 0,
  taxableAllowances: 0,
  nonTaxableAllowances: 0,
  
  // Deductions
  deductions: [
    {
      id: '',
      type: DeductionTypes.LOAN,
      name: '',
      amount: 0,
      balance: 0,
      installmentNumber: 0,
      totalInstallments: 0,
      status: PayrollItemStatus.ACTIVE
    }
  ],
  totalDeductions: 0,
  
  // Statutory Deductions
  statutoryDeductions: {
    paye: 0,
    nhif: 0,
    nssf: 0,
    housingLevy: 0,
    total: 0
  },
  
  // Calculations
  grossPay: 0,
  taxableIncome: 0,
  netPay: 0,
  
  // Payment Information
  paymentMethod: 'mpesa',
  mpesaNumber: '',
  bankDetails: {
    bankName: '',
    accountNumber: '',
    branchCode: ''
  },
  
  // Status and Tracking
  status: PayrollStatus.DRAFT,
  paymentStatus: 'pending', // pending, processing, completed, failed
  paymentReference: '',
  paymentDate: null,
  
  // Audit Trail
  createdAt: null,
  updatedAt: null,
  processedAt: null,
  notes: ''
};

// Compensation Package Schema
export const CompensationPackageSchema = {
  id: '',
  employeeId: '',
  packageName: '',
  effectiveDate: null,
  endDate: null,
  isActive: true,
  
  // Base Compensation
  basicSalary: 0,
  currency: 'KSH',
  payFrequency: PayrollPeriodType.MONTHLY,
  
  // Regular Allowances
  regularAllowances: [
    {
      id: '',
      type: AllowanceTypes.TRANSPORT,
      name: '',
      amount: 0,
      percentage: 0, // If percentage-based
      isPercentage: false,
      taxable: true,
      frequency: 'monthly'
    }
  ],
  
  // Benefits
  benefits: {
    medicalInsurance: {
      enabled: false,
      provider: '',
      coverage: '', // individual, family
      employerContribution: 0,
      employeeContribution: 0
    },
    lifeInsurance: {
      enabled: false,
      provider: '',
      coverage: 0,
      employerContribution: 0,
      employeeContribution: 0
    },
    pension: {
      enabled: false,
      provider: '',
      employerContribution: 0.06, // 6%
      employeeContribution: 0.06
    },
    leaveEntitlement: {
      annualLeave: 21,
      sickLeave: 7,
      maternityLeave: 90,
      paternityLeave: 14
    }
  },
  
  // Performance Incentives
  incentives: {
    performanceBonus: {
      enabled: false,
      type: 'percentage', // percentage, fixed
      amount: 0,
      frequency: 'annually',
      criteria: ''
    },
    commission: {
      enabled: false,
      rate: 0,
      target: 0,
      threshold: 0
    },
    overtimeEligible: true,
    overtimeRate: 1.5
  },
  
  // Totals
  totalMonthlyPackage: 0,
  totalAnnualPackage: 0,
  
  // Audit
  createdAt: null,
  createdBy: '',
  updatedAt: null,
  updatedBy: '',
  approvedAt: null,
  approvedBy: ''
};

// Payslip Schema
export const PayslipSchema = {
  id: '',
  payrollItemId: '',
  payrollPeriodId: '',
  employeeId: '',
  employeeNumber: '',
  employeeName: '',
  department: '',
  role: '',
  
  // Period Information
  payPeriod: '',
  payDate: null,
  
  // Earnings
  earnings: {
    basicSalary: 0,
    allowances: [],
    overtime: 0,
    bonus: 0,
    commission: 0,
    total: 0
  },
  
  // Deductions
  deductions: {
    statutory: {
      paye: 0,
      nhif: 0,
      nssf: 0,
      housingLevy: 0,
      total: 0
    },
    voluntary: [],
    total: 0
  },
  
  // Summary
  grossPay: 0,
  totalDeductions: 0,
  netPay: 0,
  
  // Year to Date
  ytd: {
    grossPay: 0,
    paye: 0,
    nhif: 0,
    nssf: 0,
    netPay: 0
  },
  
  // Company Information
  companyInfo: {
    name: 'MoveEase Pro',
    address: '',
    phone: '',
    email: '',
    kraPin: '',
    nssfNumber: '',
    nhifNumber: ''
  },
  
  // Generation Info
  generatedAt: null,
  generatedBy: '',
  pdfUrl: '',
  emailSent: false,
  emailSentAt: null
};

// Payroll Report Schema
export const PayrollReportSchema = {
  id: '',
  name: '',
  type: 'summary', // summary, detailed, statutory, department, comparative
  payrollPeriodId: '',
  filters: {
    departments: [],
    roles: [],
    employmentTypes: [],
    paymentMethods: []
  },
  
  // Report Data
  summary: {
    totalEmployees: 0,
    totalGrossPay: 0,
    totalDeductions: 0,
    totalNetPay: 0,
    totalTax: 0,
    totalNHIF: 0,
    totalNSSF: 0,
    totalHousingLevy: 0,
    averageGrossPay: 0,
    averageNetPay: 0
  },
  
  // Breakdown by Department
  departmentBreakdown: [],
  
  // Breakdown by Role
  roleBreakdown: [],
  
  // Statutory Returns
  statutoryReturns: {
    paye: {
      totalTax: 0,
      employees: []
    },
    nhif: {
      totalContribution: 0,
      employees: []
    },
    nssf: {
      totalContribution: 0,
      employees: []
    },
    housingLevy: {
      totalContribution: 0,
      employees: []
    }
  },
  
  // Generation Info
  generatedAt: null,
  generatedBy: '',
  format: 'pdf', // pdf, excel, csv
  fileUrl: ''
};

// Payroll Validation Rules
export const PayrollValidation = {
  basicSalary: { min: 0, max: 10000000 },
  allowances: { min: 0, max: 5000000 },
  deductions: { min: 0, max: 5000000 },
  workingDays: { min: 0, max: 31 },
  overtimeHours: { min: 0, max: 200 }
};

export default {
  PayrollStatus,
  PayrollPeriodType,
  TaxBrackets,
  StatutoryRates,
  AllowanceTypes,
  DeductionTypes,
  PayrollItemStatus,
  PayrollPeriodSchema,
  PayrollItemSchema,
  CompensationPackageSchema,
  PayslipSchema,
  PayrollReportSchema,
  PayrollValidation
};
