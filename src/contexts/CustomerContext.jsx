import React, { createContext, useContext, useReducer, useEffect } from 'react';
import customerService from '../services/customerService.js';
import { CustomerStatus, CustomerTypes } from '../types/customer.js';

// Customer Context Actions
const CUSTOMER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  SET_CURRENT_CUSTOMER: 'SET_CURRENT_CUSTOMER',
  SET_CUSTOMER_STATS: 'SET_CUSTOMER_STATS',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  customers: [],
  currentCustomer: null,
  customerStats: {
    total: 0,
    active: 0,
    inactive: 0,
    prospects: 0,
    vip: 0,
    corporate: 0,
    individual: 0,
    totalLifetimeValue: 0,
    averageLifetimeValue: 0
  },
  filters: {
    status: '',
    type: '',
    tier: '',
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
  loading: false,
  error: null
};

// Customer reducer
function customerReducer(state, action) {
  switch (action.type) {
    case CUSTOMER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case CUSTOMER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case CUSTOMER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case CUSTOMER_ACTIONS.SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
        loading: false,
        error: null
      };

    case CUSTOMER_ACTIONS.SET_CURRENT_CUSTOMER:
      return {
        ...state,
        currentCustomer: action.payload
      };

    case CUSTOMER_ACTIONS.SET_CUSTOMER_STATS:
      return {
        ...state,
        customerStats: action.payload
      };

    case CUSTOMER_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case CUSTOMER_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload
      };

    case CUSTOMER_ACTIONS.ADD_CUSTOMER:
      return {
        ...state,
        customers: [action.payload, ...state.customers],
        customerStats: {
          ...state.customerStats,
          total: state.customerStats.total + 1,
          [action.payload.status]: state.customerStats[action.payload.status] + 1,
          [action.payload.type]: state.customerStats[action.payload.type] + 1
        }
      };

    case CUSTOMER_ACTIONS.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
        currentCustomer: state.currentCustomer?.id === action.payload.id 
          ? action.payload 
          : state.currentCustomer
      };

    case CUSTOMER_ACTIONS.DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload),
        currentCustomer: state.currentCustomer?.id === action.payload 
          ? null 
          : state.currentCustomer
      };

    default:
      return state;
  }
}

// Create context
const CustomerContext = createContext();

// Customer provider component
export function CustomerProvider({ children }) {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
    loadCustomerStats();
  }, []);

  // Load customers when filters change
  useEffect(() => {
    loadCustomers();
  }, [state.filters, state.pagination.page, state.pagination.limit]);

  // Load customers
  const loadCustomers = async () => {
    dispatch({ type: CUSTOMER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await customerService.getCustomers({
        ...state.filters,
        page: state.pagination.page,
        limit: state.pagination.limit
      });

      if (result.success) {
        dispatch({ type: CUSTOMER_ACTIONS.SET_CUSTOMERS, payload: result.data });
        dispatch({ type: CUSTOMER_ACTIONS.SET_PAGINATION, payload: result.pagination });
      } else {
        dispatch({ type: CUSTOMER_ACTIONS.SET_ERROR, payload: result.error });
      }
    } catch (error) {
      dispatch({ type: CUSTOMER_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Load customer statistics
  const loadCustomerStats = async () => {
    try {
      const result = await customerService.getCustomerStats();
      if (result.success) {
        dispatch({ type: CUSTOMER_ACTIONS.SET_CUSTOMER_STATS, payload: result.data });
      }
    } catch (error) {
      console.error('Error loading customer stats:', error);
    }
  };

  // Create customer
  const createCustomer = async (customerData) => {
    dispatch({ type: CUSTOMER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await customerService.createCustomer(customerData);
      
      if (result.success) {
        dispatch({ type: CUSTOMER_ACTIONS.ADD_CUSTOMER, payload: result.data });
        await loadCustomerStats();
        return result;
      } else {
        dispatch({ type: CUSTOMER_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: CUSTOMER_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CUSTOMER_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update customer
  const updateCustomer = async (customerId, updateData) => {
    dispatch({ type: CUSTOMER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await customerService.updateCustomer(customerId, updateData);
      
      if (result.success) {
        dispatch({ type: CUSTOMER_ACTIONS.UPDATE_CUSTOMER, payload: result.data });
        await loadCustomerStats();
        return result;
      } else {
        dispatch({ type: CUSTOMER_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: CUSTOMER_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CUSTOMER_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Delete customer
  const deleteCustomer = async (customerId) => {
    dispatch({ type: CUSTOMER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await customerService.deleteCustomer(customerId);
      
      if (result.success) {
        dispatch({ type: CUSTOMER_ACTIONS.DELETE_CUSTOMER, payload: customerId });
        await loadCustomerStats();
        return result;
      } else {
        dispatch({ type: CUSTOMER_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: CUSTOMER_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CUSTOMER_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Get customer by ID
  const getCustomerById = async (customerId) => {
    try {
      const result = await customerService.getCustomerById(customerId);
      if (result.success) {
        dispatch({ type: CUSTOMER_ACTIONS.SET_CURRENT_CUSTOMER, payload: result.data });
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Search customers
  const searchCustomers = async (query) => {
    dispatch({ type: CUSTOMER_ACTIONS.SET_FILTERS, payload: { search: query } });
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: CUSTOMER_ACTIONS.SET_FILTERS, payload: filters });
  };

  // Set pagination
  const setPagination = (pagination) => {
    dispatch({ type: CUSTOMER_ACTIONS.SET_PAGINATION, payload: { ...state.pagination, ...pagination } });
  };

  // Clear current customer
  const clearCurrentCustomer = () => {
    dispatch({ type: CUSTOMER_ACTIONS.SET_CURRENT_CUSTOMER, payload: null });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CUSTOMER_ACTIONS.CLEAR_ERROR });
  };

  // Add move to customer history
  const addMoveToHistory = async (customerId, moveData) => {
    try {
      const result = await customerService.addMoveToHistory(customerId, moveData);
      if (result.success) {
        // Reload customer data to reflect the new move
        await getCustomerById(customerId);
        await loadCustomerStats();
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add communication record
  const addCommunication = async (customerId, communicationData) => {
    try {
      const result = await customerService.addCommunication(customerId, communicationData);
      if (result.success) {
        // Reload customer data to reflect the new communication
        await getCustomerById(customerId);
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Export customers
  const exportCustomers = async (format = 'json') => {
    try {
      const result = await customerService.exportCustomers(format);
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
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    searchCustomers,
    setFilters,
    setPagination,
    clearCurrentCustomer,
    clearError,
    addMoveToHistory,
    addCommunication,
    exportCustomers,
    loadCustomers,
    loadCustomerStats
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

// Custom hook to use customer context
export function useCustomers() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}

export default CustomerContext;
