import React, { createContext, useContext, useReducer, useEffect } from 'react';
import customerAdvancedService from '../services/customerAdvancedService.js';
import { CommunicationStatus, ServiceStatus } from '../types/customerAdvanced.js';

// Customer Advanced Context Actions
const CUSTOMER_ADVANCED_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_COMMUNICATIONS: 'SET_COMMUNICATIONS',
  SET_SERVICE_HISTORY: 'SET_SERVICE_HISTORY',
  SET_CUSTOMER_ANALYTICS: 'SET_CUSTOMER_ANALYTICS',
  SET_CUSTOMER_INSIGHTS: 'SET_CUSTOMER_INSIGHTS',
  SET_CUSTOMER_JOURNEY: 'SET_CUSTOMER_JOURNEY',
  SET_CURRENT_CUSTOMER: 'SET_CURRENT_CUSTOMER',
  ADD_COMMUNICATION: 'ADD_COMMUNICATION',
  UPDATE_COMMUNICATION: 'UPDATE_COMMUNICATION',
  ADD_SERVICE: 'ADD_SERVICE',
  UPDATE_SERVICE: 'UPDATE_SERVICE',
  UPDATE_ANALYTICS: 'UPDATE_ANALYTICS',
  UPDATE_INSIGHTS: 'UPDATE_INSIGHTS',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  currentCustomerId: null,
  communications: [],
  serviceHistory: [],
  customerAnalytics: null,
  customerInsights: null,
  customerJourney: null,
  allInsightsSummary: {
    totalCustomers: 0,
    highRiskCustomers: 0,
    totalOpportunities: 0,
    totalOpportunityValue: 0,
    pendingRecommendations: 0
  },
  loading: false,
  error: null
};

// Customer Advanced reducer
function customerAdvancedReducer(state, action) {
  switch (action.type) {
    case CUSTOMER_ADVANCED_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case CUSTOMER_ADVANCED_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case CUSTOMER_ADVANCED_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case CUSTOMER_ADVANCED_ACTIONS.SET_CURRENT_CUSTOMER:
      return {
        ...state,
        currentCustomerId: action.payload
      };

    case CUSTOMER_ADVANCED_ACTIONS.SET_COMMUNICATIONS:
      return {
        ...state,
        communications: action.payload,
        loading: false,
        error: null
      };

    case CUSTOMER_ADVANCED_ACTIONS.SET_SERVICE_HISTORY:
      return {
        ...state,
        serviceHistory: action.payload,
        loading: false,
        error: null
      };

    case CUSTOMER_ADVANCED_ACTIONS.SET_CUSTOMER_ANALYTICS:
      return {
        ...state,
        customerAnalytics: action.payload
      };

    case CUSTOMER_ADVANCED_ACTIONS.SET_CUSTOMER_INSIGHTS:
      return {
        ...state,
        customerInsights: action.payload
      };

    case CUSTOMER_ADVANCED_ACTIONS.SET_CUSTOMER_JOURNEY:
      return {
        ...state,
        customerJourney: action.payload
      };

    case CUSTOMER_ADVANCED_ACTIONS.ADD_COMMUNICATION:
      return {
        ...state,
        communications: [action.payload, ...state.communications]
      };

    case CUSTOMER_ADVANCED_ACTIONS.UPDATE_COMMUNICATION:
      return {
        ...state,
        communications: state.communications.map(comm =>
          comm.id === action.payload.id ? action.payload : comm
        )
      };

    case CUSTOMER_ADVANCED_ACTIONS.ADD_SERVICE:
      return {
        ...state,
        serviceHistory: [action.payload, ...state.serviceHistory]
      };

    case CUSTOMER_ADVANCED_ACTIONS.UPDATE_SERVICE:
      return {
        ...state,
        serviceHistory: state.serviceHistory.map(service =>
          service.id === action.payload.id ? action.payload : service
        )
      };

    case CUSTOMER_ADVANCED_ACTIONS.UPDATE_ANALYTICS:
      return {
        ...state,
        customerAnalytics: action.payload
      };

    case CUSTOMER_ADVANCED_ACTIONS.UPDATE_INSIGHTS:
      return {
        ...state,
        customerInsights: action.payload
      };

    default:
      return state;
  }
}

// Create context
const CustomerAdvancedContext = createContext();

// Customer Advanced provider component
export function CustomerAdvancedProvider({ children }) {
  const [state, dispatch] = useReducer(customerAdvancedReducer, initialState);

  // Set current customer and load their data
  const setCurrentCustomer = async (customerId) => {
    dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_CURRENT_CUSTOMER, payload: customerId });
    
    if (customerId) {
      await loadCustomerData(customerId);
    } else {
      // Clear data when no customer selected
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_COMMUNICATIONS, payload: [] });
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_SERVICE_HISTORY, payload: [] });
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_CUSTOMER_ANALYTICS, payload: null });
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_CUSTOMER_INSIGHTS, payload: null });
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_CUSTOMER_JOURNEY, payload: null });
    }
  };

  // Load all customer data
  const loadCustomerData = async (customerId) => {
    dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Load communications
      const commResult = await customerAdvancedService.getCustomerCommunications(customerId);
      if (commResult.success) {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_COMMUNICATIONS, payload: commResult.data });
      }

      // Load service history
      const serviceResult = await customerAdvancedService.getCustomerServiceHistory(customerId);
      if (serviceResult.success) {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_SERVICE_HISTORY, payload: serviceResult.data });
      }

      // Load analytics
      const analyticsResult = await customerAdvancedService.getCustomerAnalytics(customerId);
      if (analyticsResult.success) {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_CUSTOMER_ANALYTICS, payload: analyticsResult.data });
      }

      // Load insights
      const insightsResult = await customerAdvancedService.getCustomerInsights(customerId);
      if (insightsResult.success) {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_CUSTOMER_INSIGHTS, payload: insightsResult.data });
      }

      // Load journey
      const journeyResult = await customerAdvancedService.getCustomerJourney(customerId);
      if (journeyResult.success) {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_CUSTOMER_JOURNEY, payload: journeyResult.data });
      }

    } catch (error) {
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Create communication
  const createCommunication = async (communicationData) => {
    dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await customerAdvancedService.createCommunication(communicationData);
      
      if (result.success) {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.ADD_COMMUNICATION, payload: result.data });
        
        // Refresh analytics and insights
        if (state.currentCustomerId) {
          await refreshCustomerAnalytics(state.currentCustomerId);
        }
        
        return result;
      } else {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update communication status
  const updateCommunicationStatus = async (communicationId, status, notes = '') => {
    try {
      const result = await customerAdvancedService.updateCommunicationStatus(communicationId, status, notes);
      
      if (result.success) {
        // Reload communications for current customer
        if (state.currentCustomerId) {
          const commResult = await customerAdvancedService.getCustomerCommunications(state.currentCustomerId);
          if (commResult.success) {
            dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_COMMUNICATIONS, payload: commResult.data });
          }
        }
        return result;
      } else {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Create service record
  const createServiceRecord = async (serviceData) => {
    dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await customerAdvancedService.createServiceRecord(serviceData);
      
      if (result.success) {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.ADD_SERVICE, payload: result.data });
        
        // Refresh analytics and insights
        if (state.currentCustomerId) {
          await refreshCustomerAnalytics(state.currentCustomerId);
        }
        
        return result;
      } else {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Refresh customer analytics
  const refreshCustomerAnalytics = async (customerId) => {
    try {
      const result = await customerAdvancedService.updateCustomerAnalytics(customerId);
      
      if (result.success) {
        dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.UPDATE_ANALYTICS, payload: result.data });
        
        // Also refresh insights
        const insightsResult = await customerAdvancedService.getCustomerInsights(customerId);
        if (insightsResult.success) {
          dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.UPDATE_INSIGHTS, payload: insightsResult.data });
        }
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Get all insights summary
  const getAllInsightsSummary = async () => {
    try {
      const result = await customerAdvancedService.getAllCustomerInsights();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Export customer data
  const exportCustomerData = async (customerId, format = 'json') => {
    try {
      const result = await customerAdvancedService.exportCustomerData(customerId, format);
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

  // Clear error
  const clearError = () => {
    dispatch({ type: CUSTOMER_ADVANCED_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // State
    ...state,
    
    // Actions
    setCurrentCustomer,
    loadCustomerData,
    createCommunication,
    updateCommunicationStatus,
    createServiceRecord,
    refreshCustomerAnalytics,
    getAllInsightsSummary,
    exportCustomerData,
    clearError
  };

  return (
    <CustomerAdvancedContext.Provider value={value}>
      {children}
    </CustomerAdvancedContext.Provider>
  );
}

// Custom hook to use customer advanced context
export function useCustomerAdvanced() {
  const context = useContext(CustomerAdvancedContext);
  if (!context) {
    throw new Error('useCustomerAdvanced must be used within a CustomerAdvancedProvider');
  }
  return context;
}

export default CustomerAdvancedContext;
