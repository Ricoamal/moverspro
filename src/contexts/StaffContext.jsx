import React, { createContext, useContext, useReducer, useEffect } from 'react';
import staffService from '../services/staffService.js';
import mpesaService from '../services/mpesaService.js';
import { StaffStatus, StaffRoles, Departments } from '../types/staff.js';

// Staff Context Actions
const STAFF_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_STAFF: 'SET_STAFF',
  SET_CURRENT_STAFF: 'SET_CURRENT_STAFF',
  SET_STAFF_STATS: 'SET_STAFF_STATS',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_STAFF: 'ADD_STAFF',
  UPDATE_STAFF: 'UPDATE_STAFF',
  DELETE_STAFF: 'DELETE_STAFF',
  SET_PAYMENT_HISTORY: 'SET_PAYMENT_HISTORY',
  SET_PAYMENT_STATS: 'SET_PAYMENT_STATS',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  staff: [],
  currentStaff: null,
  staffStats: {
    total: 0,
    active: 0,
    inactive: 0,
    onLeave: 0,
    probation: 0,
    byDepartment: {},
    byRole: {},
    byEmploymentType: {},
    totalSalaryBudget: 0,
    averageSalary: 0
  },
  filters: {
    status: '',
    role: '',
    department: '',
    employmentType: '',
    search: '',
    sortBy: 'systemInfo.createdAt',
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
  paymentHistory: [],
  paymentStats: {
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    totalAmount: 0,
    successfulAmount: 0,
    averagePayment: 0,
    lastPaymentDate: null
  },
  loading: false,
  error: null
};

// Staff reducer
function staffReducer(state, action) {
  switch (action.type) {
    case STAFF_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case STAFF_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case STAFF_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case STAFF_ACTIONS.SET_STAFF:
      return {
        ...state,
        staff: action.payload,
        loading: false,
        error: null
      };

    case STAFF_ACTIONS.SET_CURRENT_STAFF:
      return {
        ...state,
        currentStaff: action.payload
      };

    case STAFF_ACTIONS.SET_STAFF_STATS:
      return {
        ...state,
        staffStats: action.payload
      };

    case STAFF_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case STAFF_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload
      };

    case STAFF_ACTIONS.ADD_STAFF:
      return {
        ...state,
        staff: [action.payload, ...state.staff],
        staffStats: {
          ...state.staffStats,
          total: state.staffStats.total + 1,
          [action.payload.status]: (state.staffStats[action.payload.status] || 0) + 1
        }
      };

    case STAFF_ACTIONS.UPDATE_STAFF:
      return {
        ...state,
        staff: state.staff.map(employee =>
          employee.id === action.payload.id ? action.payload : employee
        ),
        currentStaff: state.currentStaff?.id === action.payload.id 
          ? action.payload 
          : state.currentStaff
      };

    case STAFF_ACTIONS.DELETE_STAFF:
      return {
        ...state,
        staff: state.staff.filter(employee => employee.id !== action.payload),
        currentStaff: state.currentStaff?.id === action.payload 
          ? null 
          : state.currentStaff
      };

    case STAFF_ACTIONS.SET_PAYMENT_HISTORY:
      return {
        ...state,
        paymentHistory: action.payload
      };

    case STAFF_ACTIONS.SET_PAYMENT_STATS:
      return {
        ...state,
        paymentStats: action.payload
      };

    default:
      return state;
  }
}

// Create context
const StaffContext = createContext();

// Staff provider component
export function StaffProvider({ children }) {
  const [state, dispatch] = useReducer(staffReducer, initialState);

  // Load staff on mount
  useEffect(() => {
    loadStaff();
    loadStaffStats();
    loadPaymentHistory();
    loadPaymentStats();
  }, []);

  // Load staff when filters change
  useEffect(() => {
    if (state.filters || state.pagination.page || state.pagination.limit) {
      loadStaff();
    }
  }, [state.filters, state.pagination.page, state.pagination.limit]);

  // Load staff
  const loadStaff = async () => {
    dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await staffService.getStaff({
        ...state.filters,
        page: state.pagination.page,
        limit: state.pagination.limit
      });

      if (result.success) {
        dispatch({ type: STAFF_ACTIONS.SET_STAFF, payload: result.data });
        dispatch({ type: STAFF_ACTIONS.SET_PAGINATION, payload: result.pagination });
      } else {
        dispatch({ type: STAFF_ACTIONS.SET_ERROR, payload: result.error });
      }
    } catch (error) {
      dispatch({ type: STAFF_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Load staff statistics
  const loadStaffStats = async () => {
    try {
      const result = await staffService.getStaffStats();
      if (result.success) {
        dispatch({ type: STAFF_ACTIONS.SET_STAFF_STATS, payload: result.data });
      }
    } catch (error) {
      console.error('Error loading staff stats:', error);
    }
  };

  // Load payment history
  const loadPaymentHistory = async () => {
    try {
      const result = await mpesaService.getPaymentHistory();
      if (result.success) {
        dispatch({ type: STAFF_ACTIONS.SET_PAYMENT_HISTORY, payload: result.data });
      }
    } catch (error) {
      console.error('Error loading payment history:', error);
    }
  };

  // Load payment statistics
  const loadPaymentStats = async () => {
    try {
      const result = await mpesaService.getPaymentStats();
      if (result.success) {
        dispatch({ type: STAFF_ACTIONS.SET_PAYMENT_STATS, payload: result.data });
      }
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  };

  // Create staff member
  const createStaff = async (staffData) => {
    dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await staffService.createStaff(staffData);
      
      if (result.success) {
        dispatch({ type: STAFF_ACTIONS.ADD_STAFF, payload: result.data });
        await loadStaffStats();
        return result;
      } else {
        dispatch({ type: STAFF_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: STAFF_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update staff member
  const updateStaff = async (staffId, updateData) => {
    dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await staffService.updateStaff(staffId, updateData);
      
      if (result.success) {
        dispatch({ type: STAFF_ACTIONS.UPDATE_STAFF, payload: result.data });
        await loadStaffStats();
        return result;
      } else {
        dispatch({ type: STAFF_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: STAFF_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Delete staff member
  const deleteStaff = async (staffId) => {
    dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await staffService.deleteStaff(staffId);
      
      if (result.success) {
        dispatch({ type: STAFF_ACTIONS.DELETE_STAFF, payload: staffId });
        await loadStaffStats();
        return result;
      } else {
        dispatch({ type: STAFF_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: STAFF_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Get staff member by ID
  const getStaffById = async (staffId) => {
    try {
      const result = await staffService.getStaffById(staffId);
      if (result.success) {
        dispatch({ type: STAFF_ACTIONS.SET_CURRENT_STAFF, payload: result.data });
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Process single M-Pesa payment
  const processPayment = async (paymentData) => {
    dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await mpesaService.sendB2CPayment(paymentData);
      
      if (result.success) {
        await loadPaymentHistory();
        await loadPaymentStats();
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Process bulk payroll
  const processBulkPayroll = async (payrollData) => {
    dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await mpesaService.processBulkPayroll(payrollData);
      
      if (result.success) {
        await loadPaymentHistory();
        await loadPaymentStats();
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Retry failed payment
  const retryPayment = async (paymentId) => {
    try {
      const result = await mpesaService.retryPayment(paymentId);
      
      if (result.success) {
        await loadPaymentHistory();
        await loadPaymentStats();
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add leave request
  const addLeaveRequest = async (staffId, leaveData) => {
    try {
      const result = await staffService.addLeaveRequest(staffId, leaveData);
      if (result.success) {
        await getStaffById(staffId);
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update leave request
  const updateLeaveRequest = async (staffId, leaveId, status, approvedBy) => {
    try {
      const result = await staffService.updateLeaveRequest(staffId, leaveId, status, approvedBy);
      if (result.success) {
        await getStaffById(staffId);
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add training record
  const addTraining = async (staffId, trainingData) => {
    try {
      const result = await staffService.addTraining(staffId, trainingData);
      if (result.success) {
        await getStaffById(staffId);
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: STAFF_ACTIONS.SET_FILTERS, payload: filters });
  };

  // Set pagination
  const setPagination = (pagination) => {
    dispatch({ type: STAFF_ACTIONS.SET_PAGINATION, payload: { ...state.pagination, ...pagination } });
  };

  // Clear current staff
  const clearCurrentStaff = () => {
    dispatch({ type: STAFF_ACTIONS.SET_CURRENT_STAFF, payload: null });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: STAFF_ACTIONS.CLEAR_ERROR });
  };

  // Export staff data
  const exportStaff = async (format = 'json') => {
    try {
      const result = await staffService.exportStaff(format);
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

  // Export payment history
  const exportPaymentHistory = async (format = 'json') => {
    try {
      const result = await mpesaService.exportPaymentHistory(format);
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
    createStaff,
    updateStaff,
    deleteStaff,
    getStaffById,
    setFilters,
    setPagination,
    clearCurrentStaff,
    clearError,
    addLeaveRequest,
    updateLeaveRequest,
    addTraining,
    processPayment,
    processBulkPayroll,
    retryPayment,
    exportStaff,
    exportPaymentHistory,
    loadStaff,
    loadStaffStats,
    loadPaymentHistory,
    loadPaymentStats
  };

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  );
}

// Custom hook to use staff context
export function useStaff() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
}

export default StaffContext;
