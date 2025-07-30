// Enhanced Payroll Service with Tax Calculations
import { 
  PayrollStatus, 
  PayrollPeriodSchema, 
  PayrollItemSchema, 
  TaxBrackets, 
  StatutoryRates,
  PayslipSchema 
} from '../types/payroll.js';

class PayrollService {
  constructor() {
    this.payrollPeriods = this.loadPayrollPeriods();
    this.payrollItems = this.loadPayrollItems();
    this.compensationPackages = this.loadCompensationPackages();
    this.payslips = this.loadPayslips();
  }

  // Load data from localStorage
  loadPayrollPeriods() {
    try {
      const stored = localStorage.getItem('moveease_payroll_periods');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading payroll periods:', error);
      return [];
    }
  }

  loadPayrollItems() {
    try {
      const stored = localStorage.getItem('moveease_payroll_items');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading payroll items:', error);
      return [];
    }
  }

  loadCompensationPackages() {
    try {
      const stored = localStorage.getItem('moveease_compensation_packages');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading compensation packages:', error);
      return [];
    }
  }

  loadPayslips() {
    try {
      const stored = localStorage.getItem('moveease_payslips');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading payslips:', error);
      return [];
    }
  }

  // Save data to localStorage
  savePayrollPeriods() {
    try {
      localStorage.setItem('moveease_payroll_periods', JSON.stringify(this.payrollPeriods));
      return true;
    } catch (error) {
      console.error('Error saving payroll periods:', error);
      return false;
    }
  }

  savePayrollItems() {
    try {
      localStorage.setItem('moveease_payroll_items', JSON.stringify(this.payrollItems));
      return true;
    } catch (error) {
      console.error('Error saving payroll items:', error);
      return false;
    }
  }

  saveCompensationPackages() {
    try {
      localStorage.setItem('moveease_compensation_packages', JSON.stringify(this.compensationPackages));
      return true;
    } catch (error) {
      console.error('Error saving compensation packages:', error);
      return false;
    }
  }

  savePayslips() {
    try {
      localStorage.setItem('moveease_payslips', JSON.stringify(this.payslips));
      return true;
    } catch (error) {
      console.error('Error saving payslips:', error);
      return false;
    }
  }

  // Generate unique IDs
  generateId(prefix = 'payroll') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Tax Calculation Functions
  calculatePAYE(taxableIncome, personalRelief = 2400) {
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of TaxBrackets.KENYA) {
      if (remainingIncome <= 0) break;

      const taxableAtThisBracket = Math.min(
        remainingIncome,
        bracket.max === Infinity ? remainingIncome : bracket.max - bracket.min + 1
      );

      tax += taxableAtThisBracket * bracket.rate;
      remainingIncome -= taxableAtThisBracket;
    }

    // Apply personal relief
    tax = Math.max(0, tax - personalRelief);
    
    return Math.round(tax);
  }

  calculateNHIF(grossSalary) {
    for (const bracket of StatutoryRates.NHIF) {
      if (grossSalary >= bracket.min && grossSalary <= bracket.max) {
        return bracket.amount;
      }
    }
    return 1700; // Maximum NHIF contribution
  }

  calculateNSSF(pensionablePay) {
    const contribution = pensionablePay * StatutoryRates.NSSF.rate;
    return Math.min(contribution, StatutoryRates.NSSF.maxContribution);
  }

  calculateHousingLevy(grossSalary) {
    const levy = grossSalary * StatutoryRates.HOUSING_LEVY.rate;
    return Math.min(levy, StatutoryRates.HOUSING_LEVY.maxContribution);
  }

  // Payroll Calculations
  calculatePayrollItem(employee, payrollPeriod, adjustments = {}) {
    try {
      // Get compensation package
      const compensationPackage = this.getActiveCompensationPackage(employee.id);
      
      // Basic calculations
      const workingDays = adjustments.workingDays || payrollPeriod.workingDays || 22;
      const daysWorked = adjustments.daysWorked || workingDays;
      const basicSalary = adjustments.basicSalary || compensationPackage?.basicSalary || employee.payrollInfo.basicSalary;
      
      // Prorate basic salary if not full month
      const proratedBasicSalary = (basicSalary / workingDays) * daysWorked;
      
      // Calculate allowances
      let totalAllowances = 0;
      let taxableAllowances = 0;
      let nonTaxableAllowances = 0;
      
      const allowances = adjustments.allowances || employee.payrollInfo.allowances || [];
      allowances.forEach(allowance => {
        let amount = allowance.amount;
        
        // Prorate if necessary
        if (allowance.prorated && daysWorked < workingDays) {
          amount = (amount / workingDays) * daysWorked;
        }
        
        totalAllowances += amount;
        if (allowance.taxable) {
          taxableAllowances += amount;
        } else {
          nonTaxableAllowances += amount;
        }
      });
      
      // Calculate overtime
      const overtimeHours = adjustments.overtimeHours || 0;
      const overtimeRate = adjustments.overtimeRate || 1.5;
      const hourlyRate = basicSalary / (workingDays * 8); // Assuming 8 hours per day
      const overtimePay = overtimeHours * hourlyRate * overtimeRate;
      
      // Gross pay calculation
      const grossPay = proratedBasicSalary + totalAllowances + overtimePay;
      
      // Taxable income (gross pay minus non-taxable allowances)
      const taxableIncome = grossPay - nonTaxableAllowances;
      
      // Statutory deductions
      const paye = this.calculatePAYE(taxableIncome);
      const nhif = this.calculateNHIF(grossPay);
      const nssf = this.calculateNSSF(basicSalary); // NSSF based on basic salary
      const housingLevy = this.calculateHousingLevy(grossPay);
      
      const statutoryDeductions = {
        paye,
        nhif,
        nssf,
        housingLevy,
        total: paye + nhif + nssf + housingLevy
      };
      
      // Other deductions
      let totalOtherDeductions = 0;
      const deductions = adjustments.deductions || employee.payrollInfo.deductions || [];
      deductions.forEach(deduction => {
        totalOtherDeductions += deduction.amount;
      });
      
      // Net pay calculation
      const totalDeductions = statutoryDeductions.total + totalOtherDeductions;
      const netPay = grossPay - totalDeductions;
      
      // Create payroll item
      const payrollItem = {
        ...PayrollItemSchema,
        id: this.generateId('payroll_item'),
        payrollPeriodId: payrollPeriod.id,
        employeeId: employee.id,
        employeeNumber: employee.employeeNumber,
        employeeName: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
        department: employee.employmentInfo.department,
        role: employee.employmentInfo.role,
        
        // Basic pay
        basicSalary: proratedBasicSalary,
        daysWorked,
        totalWorkingDays: workingDays,
        overtimeHours,
        overtimeRate,
        
        // Allowances
        allowances,
        totalAllowances,
        taxableAllowances,
        nonTaxableAllowances,
        
        // Deductions
        deductions,
        totalDeductions: totalOtherDeductions,
        
        // Statutory deductions
        statutoryDeductions,
        
        // Calculations
        grossPay,
        taxableIncome,
        netPay,
        
        // Payment info
        paymentMethod: employee.payrollInfo.paymentMethod,
        mpesaNumber: employee.payrollInfo.mpesaNumber,
        bankDetails: employee.payrollInfo.bankDetails,
        
        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: payrollItem
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create payroll period
  async createPayrollPeriod(periodData) {
    try {
      const payrollPeriod = {
        ...PayrollPeriodSchema,
        id: this.generateId('payroll_period'),
        ...periodData,
        createdAt: new Date().toISOString(),
        createdBy: 'system' // TODO: Get from auth context
      };

      this.payrollPeriods.push(payrollPeriod);
      this.savePayrollPeriods();

      return {
        success: true,
        data: payrollPeriod,
        message: 'Payroll period created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create payroll period'
      };
    }
  }

  // Generate payroll for all employees
  async generatePayroll(payrollPeriodId, employees, adjustments = {}) {
    try {
      const payrollPeriod = this.payrollPeriods.find(p => p.id === payrollPeriodId);
      if (!payrollPeriod) {
        throw new Error('Payroll period not found');
      }

      const payrollItems = [];
      let totalGrossPay = 0;
      let totalDeductions = 0;
      let totalNetPay = 0;
      let totalTax = 0;
      let totalNHIF = 0;
      let totalNSSF = 0;
      let totalHousingLevy = 0;

      for (const employee of employees) {
        const employeeAdjustments = adjustments[employee.id] || {};
        const result = this.calculatePayrollItem(employee, payrollPeriod, employeeAdjustments);
        
        if (result.success) {
          payrollItems.push(result.data);
          this.payrollItems.push(result.data);
          
          // Update totals
          totalGrossPay += result.data.grossPay;
          totalDeductions += result.data.statutoryDeductions.total + result.data.totalDeductions;
          totalNetPay += result.data.netPay;
          totalTax += result.data.statutoryDeductions.paye;
          totalNHIF += result.data.statutoryDeductions.nhif;
          totalNSSF += result.data.statutoryDeductions.nssf;
          totalHousingLevy += result.data.statutoryDeductions.housingLevy;
        }
      }

      // Update payroll period totals
      const periodIndex = this.payrollPeriods.findIndex(p => p.id === payrollPeriodId);
      this.payrollPeriods[periodIndex] = {
        ...this.payrollPeriods[periodIndex],
        totalEmployees: payrollItems.length,
        totalGrossPay,
        totalDeductions,
        totalNetPay,
        totalTax,
        totalNHIF,
        totalNSSF,
        totalHousingLevy,
        status: PayrollStatus.PENDING_APPROVAL,
        updatedAt: new Date().toISOString()
      };

      this.savePayrollPeriods();
      this.savePayrollItems();

      return {
        success: true,
        data: {
          payrollPeriod: this.payrollPeriods[periodIndex],
          payrollItems,
          summary: {
            totalEmployees: payrollItems.length,
            totalGrossPay,
            totalDeductions,
            totalNetPay,
            totalTax,
            totalNHIF,
            totalNSSF,
            totalHousingLevy
          }
        },
        message: 'Payroll generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to generate payroll'
      };
    }
  }

  // Get payroll periods
  getPayrollPeriods(options = {}) {
    try {
      let filteredPeriods = [...this.payrollPeriods];

      // Apply filters
      if (options.status) {
        filteredPeriods = filteredPeriods.filter(p => p.status === options.status);
      }

      if (options.year) {
        filteredPeriods = filteredPeriods.filter(p => 
          new Date(p.startDate).getFullYear() === parseInt(options.year)
        );
      }

      // Apply sorting
      filteredPeriods.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      // Apply pagination
      const page = options.page || 1;
      const limit = options.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedPeriods = filteredPeriods.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedPeriods,
        pagination: {
          page,
          limit,
          total: filteredPeriods.length,
          totalPages: Math.ceil(filteredPeriods.length / limit),
          hasNext: endIndex < filteredPeriods.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payroll items for a period
  getPayrollItems(payrollPeriodId) {
    try {
      const items = this.payrollItems.filter(item => item.payrollPeriodId === payrollPeriodId);
      
      return {
        success: true,
        data: items
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate payslip
  generatePayslip(payrollItemId) {
    try {
      const payrollItem = this.payrollItems.find(item => item.id === payrollItemId);
      if (!payrollItem) {
        throw new Error('Payroll item not found');
      }

      const payrollPeriod = this.payrollPeriods.find(p => p.id === payrollItem.payrollPeriodId);
      
      // Calculate YTD figures
      const ytdItems = this.payrollItems.filter(item => 
        item.employeeId === payrollItem.employeeId &&
        new Date(item.createdAt).getFullYear() === new Date().getFullYear()
      );

      const ytd = {
        grossPay: ytdItems.reduce((sum, item) => sum + item.grossPay, 0),
        paye: ytdItems.reduce((sum, item) => sum + item.statutoryDeductions.paye, 0),
        nhif: ytdItems.reduce((sum, item) => sum + item.statutoryDeductions.nhif, 0),
        nssf: ytdItems.reduce((sum, item) => sum + item.statutoryDeductions.nssf, 0),
        netPay: ytdItems.reduce((sum, item) => sum + item.netPay, 0)
      };

      const payslip = {
        ...PayslipSchema,
        id: this.generateId('payslip'),
        payrollItemId: payrollItem.id,
        payrollPeriodId: payrollItem.payrollPeriodId,
        employeeId: payrollItem.employeeId,
        employeeNumber: payrollItem.employeeNumber,
        employeeName: payrollItem.employeeName,
        department: payrollItem.department,
        role: payrollItem.role,
        
        payPeriod: payrollPeriod.name,
        payDate: payrollPeriod.payDate,
        
        earnings: {
          basicSalary: payrollItem.basicSalary,
          allowances: payrollItem.allowances,
          overtime: payrollItem.overtimeHours * (payrollItem.basicSalary / (payrollItem.totalWorkingDays * 8)) * payrollItem.overtimeRate,
          bonus: 0, // TODO: Calculate bonus
          commission: 0, // TODO: Calculate commission
          total: payrollItem.grossPay
        },
        
        deductions: {
          statutory: payrollItem.statutoryDeductions,
          voluntary: payrollItem.deductions,
          total: payrollItem.statutoryDeductions.total + payrollItem.totalDeductions
        },
        
        grossPay: payrollItem.grossPay,
        totalDeductions: payrollItem.statutoryDeductions.total + payrollItem.totalDeductions,
        netPay: payrollItem.netPay,
        
        ytd,
        
        generatedAt: new Date().toISOString(),
        generatedBy: 'system'
      };

      this.payslips.push(payslip);
      this.savePayslips();

      return {
        success: true,
        data: payslip,
        message: 'Payslip generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get active compensation package for employee
  getActiveCompensationPackage(employeeId) {
    return this.compensationPackages.find(pkg => 
      pkg.employeeId === employeeId && 
      pkg.isActive &&
      new Date(pkg.effectiveDate) <= new Date() &&
      (!pkg.endDate || new Date(pkg.endDate) >= new Date())
    );
  }

  // Create compensation package
  async createCompensationPackage(packageData) {
    try {
      // Deactivate existing packages for the employee
      this.compensationPackages.forEach(pkg => {
        if (pkg.employeeId === packageData.employeeId && pkg.isActive) {
          pkg.isActive = false;
          pkg.endDate = new Date().toISOString();
        }
      });

      const compensationPackage = {
        id: this.generateId('comp_package'),
        ...packageData,
        createdAt: new Date().toISOString(),
        createdBy: 'system'
      };

      this.compensationPackages.push(compensationPackage);
      this.saveCompensationPackages();

      return {
        success: true,
        data: compensationPackage,
        message: 'Compensation package created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Approve payroll period
  async approvePayrollPeriod(payrollPeriodId, approvedBy) {
    try {
      const periodIndex = this.payrollPeriods.findIndex(p => p.id === payrollPeriodId);
      if (periodIndex === -1) {
        throw new Error('Payroll period not found');
      }

      this.payrollPeriods[periodIndex] = {
        ...this.payrollPeriods[periodIndex],
        status: PayrollStatus.APPROVED,
        approvedAt: new Date().toISOString(),
        approvedBy,
        updatedAt: new Date().toISOString()
      };

      // Update all payroll items status
      this.payrollItems.forEach(item => {
        if (item.payrollPeriodId === payrollPeriodId) {
          item.status = PayrollStatus.APPROVED;
          item.updatedAt = new Date().toISOString();
        }
      });

      this.savePayrollPeriods();
      this.savePayrollItems();

      return {
        success: true,
        message: 'Payroll period approved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payroll statistics
  getPayrollStats() {
    try {
      const currentYear = new Date().getFullYear();
      const currentYearPeriods = this.payrollPeriods.filter(p => 
        new Date(p.startDate).getFullYear() === currentYear
      );

      const stats = {
        totalPeriods: this.payrollPeriods.length,
        currentYearPeriods: currentYearPeriods.length,
        pendingApproval: this.payrollPeriods.filter(p => p.status === PayrollStatus.PENDING_APPROVAL).length,
        approved: this.payrollPeriods.filter(p => p.status === PayrollStatus.APPROVED).length,
        completed: this.payrollPeriods.filter(p => p.status === PayrollStatus.COMPLETED).length,
        totalPayrollValue: currentYearPeriods.reduce((sum, p) => sum + p.totalNetPay, 0),
        totalTaxPaid: currentYearPeriods.reduce((sum, p) => sum + p.totalTax, 0),
        averageGrossPay: 0,
        averageNetPay: 0
      };

      const totalEmployeePayrolls = this.payrollItems.filter(item => 
        new Date(item.createdAt).getFullYear() === currentYear
      ).length;

      if (totalEmployeePayrolls > 0) {
        const totalGross = this.payrollItems
          .filter(item => new Date(item.createdAt).getFullYear() === currentYear)
          .reduce((sum, item) => sum + item.grossPay, 0);
        
        const totalNet = this.payrollItems
          .filter(item => new Date(item.createdAt).getFullYear() === currentYear)
          .reduce((sum, item) => sum + item.netPay, 0);

        stats.averageGrossPay = totalGross / totalEmployeePayrolls;
        stats.averageNetPay = totalNet / totalEmployeePayrolls;
      }

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

  // Export payroll data
  exportPayrollData(payrollPeriodId, format = 'json') {
    try {
      const payrollPeriod = this.payrollPeriods.find(p => p.id === payrollPeriodId);
      const payrollItems = this.payrollItems.filter(item => item.payrollPeriodId === payrollPeriodId);

      const data = payrollItems.map(item => ({
        employeeNumber: item.employeeNumber,
        employeeName: item.employeeName,
        department: item.department,
        role: item.role,
        basicSalary: item.basicSalary,
        allowances: item.totalAllowances,
        grossPay: item.grossPay,
        paye: item.statutoryDeductions.paye,
        nhif: item.statutoryDeductions.nhif,
        nssf: item.statutoryDeductions.nssf,
        housingLevy: item.statutoryDeductions.housingLevy,
        otherDeductions: item.totalDeductions,
        netPay: item.netPay,
        paymentMethod: item.paymentMethod,
        mpesaNumber: item.mpesaNumber
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
          filename: `payroll_${payrollPeriod.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
        };
      }

      return {
        success: true,
        data: JSON.stringify({ payrollPeriod, payrollItems: data }, null, 2),
        filename: `payroll_${payrollPeriod.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
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
const payrollService = new PayrollService();

export default payrollService;
