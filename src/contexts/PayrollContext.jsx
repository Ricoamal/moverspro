import React, { createContext, useContext, useReducer, useEffect } from 'react';
import payrollService from '../services/payrollService.js';
import { PayrollStatus } from '../types/payroll.js';

// Payroll Context Actions
const PAYROLL_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PAYROLL_PERIODS: 'SET_PAYROLL_PERIODS',
  SET_CURRENT_PERIOD: 'SET_CURRENT_PERIOD',
  SET_PAYROLL_ITEMS: 'SET_PAYROLL_ITEMS',
  SET_PAYROLL_STATS: 'SET_PAYROLL_STATS',
  SET_COMPENSATION_PACKAGES: 'SET_COMPENSATION_PACKAGES',
  SET_PAYSLIPS: 'SET_PAYSLIPS',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_PAYROLL_PERIOD: 'ADD_PAYROLL_PERIOD',
  UPDATE_PAYROLL_PERIOD: 'UPDATE_PAYROLL_PERIOD',
  ADD_PAYROLL_ITEMS: 'ADD_PAYROLL_ITEMS',
  UPDATE_PAYROLL_ITEM: 'UPDATE_PAYROLL_ITEM',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  payrollPeriods: [],
  currentPeriod: null,
  payrollItems: [],
  payrollStats: {
    totalPeriods: 0,
    currentYearPeriods: 0,
    pendingApproval: 0,
    approved: 0,
    completed: 0,
    totalPayrollValue: 0,
    totalTaxPaid: 0,
    averageGrossPay: 0,
    averageNetPay: 0
  },
  compensationPackages: [],
  payslips: [],
  filters: {
    status: '',
    year: new Date().getFullYear().toString(),
    search: '',
    sortBy: 'startDate',
    sortOrder: 'desc'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  },
  loading: false,
  error: null
};

// Payroll reducer
function payrollReducer(state, action) {
  switch (action.type) {
    case PAYROLL_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case PAYROLL_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case PAYROLL_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case PAYROLL_ACTIONS.SET_PAYROLL_PERIODS:
      return {
        ...state,
        payrollPeriods: action.payload,
        loading: false,
        error: null
      };

    case PAYROLL_ACTIONS.SET_CURRENT_PERIOD:
      return {
        ...state,
        currentPeriod: action.payload
      };

    case PAYROLL_ACTIONS.SET_PAYROLL_ITEMS:
      return {
        ...state,
        payrollItems: action.payload
      };

    case PAYROLL_ACTIONS.SET_PAYROLL_STATS:
      return {
        ...state,
        payrollStats: action.payload
      };

    case PAYROLL_ACTIONS.SET_COMPENSATION_PACKAGES:
      return {
        ...state,
        compensationPackages: action.payload
      };

    case PAYROLL_ACTIONS.SET_PAYSLIPS:
      return {
        ...state,
        payslips: action.payload
      };

    case PAYROLL_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case PAYROLL_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload
      };

    case PAYROLL_ACTIONS.ADD_PAYROLL_PERIOD:
      return {
        ...state,
        payrollPeriods: [action.payload, ...state.payrollPeriods]
      };

    case PAYROLL_ACTIONS.UPDATE_PAYROLL_PERIOD:
      return {
        ...state,
        payrollPeriods: state.payrollPeriods.map(period =>
          period.id === action.payload.id ? action.payload : period
        ),
        currentPeriod: state.currentPeriod?.id === action.payload.id 
          ? action.payload 
          : state.currentPeriod
      };

    case PAYROLL_ACTIONS.ADD_PAYROLL_ITEMS:
      return {
        ...state,
        payrollItems: [...state.payrollItems, ...action.payload]
      };

    case PAYROLL_ACTIONS.UPDATE_PAYROLL_ITEM:
      return {
        ...state,
        payrollItems: state.payrollItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };

    default:
      return state;
  }
}

// Create context
const PayrollContext = createContext();

// Payroll provider component
export function PayrollProvider({ children }) {
  const [state, dispatch] = useReducer(payrollReducer, initialState);

  // Load data on mount
  useEffect(() => {
    loadPayrollPeriods();
    loadPayrollStats();
  }, []);

  // Load payroll periods when filters change
  useEffect(() => {
    if (state.filters || state.pagination.page || state.pagination.limit) {
      loadPayrollPeriods();
    }
  }, [state.filters, state.pagination.page, state.pagination.limit]);

  // Load payroll periods
  const loadPayrollPeriods = async () => {
    dispatch({ type: PAYROLL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await payrollService.getPayrollPeriods({
        ...state.filters,
        page: state.pagination.page,
        limit: state.pagination.limit
      });

      if (result.success) {
        dispatch({ type: PAYROLL_ACTIONS.SET_PAYROLL_PERIODS, payload: result.data });
        dispatch({ type: PAYROLL_ACTIONS.SET_PAGINATION, payload: result.pagination });
      } else {
        dispatch({ type: PAYROLL_ACTIONS.SET_ERROR, payload: result.error });
      }
    } catch (error) {
      dispatch({ type: PAYROLL_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Load payroll statistics
  const loadPayrollStats = async () => {
    try {
      const result = await payrollService.getPayrollStats();
      if (result.success) {
        dispatch({ type: PAYROLL_ACTIONS.SET_PAYROLL_STATS, payload: result.data });
      }
    } catch (error) {
      console.error('Error loading payroll stats:', error);
    }
  };

  // Create payroll period
  const createPayrollPeriod = async (periodData) => {
    dispatch({ type: PAYROLL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await payrollService.createPayrollPeriod(periodData);
      
      if (result.success) {
        dispatch({ type: PAYROLL_ACTIONS.ADD_PAYROLL_PERIOD, payload: result.data });
        await loadPayrollStats();
        return result;
      } else {
        dispatch({ type: PAYROLL_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: PAYROLL_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: PAYROLL_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Generate payroll
  const generatePayroll = async (payrollPeriodId, employees, adjustments = {}) => {
    dispatch({ type: PAYROLL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await payrollService.generatePayroll(payrollPeriodId, employees, adjustments);
      
      if (result.success) {
        dispatch({ type: PAYROLL_ACTIONS.UPDATE_PAYROLL_PERIOD, payload: result.data.payrollPeriod });
        dispatch({ type: PAYROLL_ACTIONS.ADD_PAYROLL_ITEMS, payload: result.data.payrollItems });
        await loadPayrollStats();
        return result;
      } else {
        dispatch({ type: PAYROLL_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: PAYROLL_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: PAYROLL_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Load payroll items for a period
  const loadPayrollItems = async (payrollPeriodId) => {
    try {
      const result = await payrollService.getPayrollItems(payrollPeriodId);
      if (result.success) {
        dispatch({ type: PAYROLL_ACTIONS.SET_PAYROLL_ITEMS, payload: result.data });
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Approve payroll period
  const approvePayrollPeriod = async (payrollPeriodId, approvedBy) => {
    dispatch({ type: PAYROLL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await payrollService.approvePayrollPeriod(payrollPeriodId, approvedBy);
      
      if (result.success) {
        // Reload the specific period
        const updatedPeriod = payrollService.payrollPeriods.find(p => p.id === payrollPeriodId);
        if (updatedPeriod) {
          dispatch({ type: PAYROLL_ACTIONS.UPDATE_PAYROLL_PERIOD, payload: updatedPeriod });
        }
        await loadPayrollStats();
        return result;
      } else {
        dispatch({ type: PAYROLL_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: PAYROLL_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: PAYROLL_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Generate payslip
  const generatePayslip = async (payrollItemId) => {
    try {
      const result = await payrollService.generatePayslip(payrollItemId);
      if (result.success) {
        // Add to payslips array
        dispatch({ type: PAYROLL_ACTIONS.SET_PAYSLIPS, payload: [...state.payslips, result.data] });
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Create compensation package
  const createCompensationPackage = async (packageData) => {
    try {
      const result = await payrollService.createCompensationPackage(packageData);
      if (result.success) {
        // Reload compensation packages
        const packages = payrollService.compensationPackages;
        dispatch({ type: PAYROLL_ACTIONS.SET_COMPENSATION_PACKAGES, payload: packages });
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Calculate payroll item
  const calculatePayrollItem = async (employee, payrollPeriod, adjustments = {}) => {
    try {
      const result = await payrollService.calculatePayrollItem(employee, payrollPeriod, adjustments);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Set current period
  const setCurrentPeriod = (period) => {
    dispatch({ type: PAYROLL_ACTIONS.SET_CURRENT_PERIOD, payload: period });
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: PAYROLL_ACTIONS.SET_FILTERS, payload: filters });
  };

  // Set pagination
  const setPagination = (pagination) => {
    dispatch({ type: PAYROLL_ACTIONS.SET_PAGINATION, payload: { ...state.pagination, ...pagination } });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: PAYROLL_ACTIONS.CLEAR_ERROR });
  };

  // Export payroll data
  const exportPayrollData = async (payrollPeriodId, format = 'json') => {
    try {
      const result = await payrollService.exportPayrollData(payrollPeriodId, format);
      if (result.success) {
        // Create download link
        const blob = new Blob([result.data], { 
          type: format === 'csv' ? 'text/csv' : 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    // State
    ...state,
    
    // Actions
    createPayrollPeriod,
    generatePayroll,
    loadPayrollItems,
    approvePayrollPeriod,
    generatePayslip,
    createCompensationPackage,
    calculatePayrollItem,
    setCurrentPeriod,
    setFilters,
    setPagination,
    clearError,
    exportPayrollData,
    loadPayrollPeriods,
    loadPayrollStats
  };

  return (
    <PayrollContext.Provider value={value}>
      {children}
    </PayrollContext.Provider>
  );
}

// Custom hook to use payroll context
export function usePayroll() {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error('usePayroll must be used within a PayrollProvider');
  }
  return context;
}

export default PayrollContext;
