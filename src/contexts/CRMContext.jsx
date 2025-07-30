import React, { createContext, useContext, useReducer, useEffect } from 'react';
import crmService from '../services/crmService.js';
import { LeadStatus, OpportunityStages } from '../types/crm.js';

// CRM Context Actions
const CRM_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_LEADS: 'SET_LEADS',
  SET_OPPORTUNITIES: 'SET_OPPORTUNITIES',
  SET_ACTIVITIES: 'SET_ACTIVITIES',
  SET_CAMPAIGNS: 'SET_CAMPAIGNS',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_LEAD: 'ADD_LEAD',
  UPDATE_LEAD: 'UPDATE_LEAD',
  ADD_OPPORTUNITY: 'ADD_OPPORTUNITY',
  UPDATE_OPPORTUNITY: 'UPDATE_OPPORTUNITY',
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  UPDATE_ACTIVITY: 'UPDATE_ACTIVITY',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  leads: [],
  opportunities: [],
  activities: [],
  campaigns: [],
  dashboardData: {
    leadMetrics: {
      totalLeads: 0,
      newLeads: 0,
      qualifiedLeads: 0,
      convertedLeads: 0,
      conversionRate: 0
    },
    opportunityMetrics: {
      totalOpportunities: 0,
      totalValue: 0,
      averageDealSize: 0,
      winRate: 0
    },
    activityMetrics: {
      totalActivities: 0,
      completedActivities: 0,
      overdueActivities: 0
    }
  },
  filters: {
    leads: {
      status: '',
      source: '',
      rating: '',
      assignedTo: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    },
    opportunities: {
      stage: '',
      ownerId: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    },
    activities: {
      type: '',
      status: '',
      assignedTo: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  },
  pagination: {
    leads: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    },
    opportunities: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    },
    activities: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    }
  },
  loading: false,
  error: null
};

// CRM reducer
function crmReducer(state, action) {
  switch (action.type) {
    case CRM_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case CRM_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case CRM_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case CRM_ACTIONS.SET_LEADS:
      return {
        ...state,
        leads: action.payload,
        loading: false,
        error: null
      };

    case CRM_ACTIONS.SET_OPPORTUNITIES:
      return {
        ...state,
        opportunities: action.payload,
        loading: false,
        error: null
      };

    case CRM_ACTIONS.SET_ACTIVITIES:
      return {
        ...state,
        activities: action.payload,
        loading: false,
        error: null
      };

    case CRM_ACTIONS.SET_CAMPAIGNS:
      return {
        ...state,
        campaigns: action.payload,
        loading: false,
        error: null
      };

    case CRM_ACTIONS.SET_DASHBOARD_DATA:
      return {
        ...state,
        dashboardData: action.payload
      };

    case CRM_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.type]: {
            ...state.filters[action.payload.type],
            ...action.payload.filters
          }
        }
      };

    case CRM_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [action.payload.type]: action.payload.pagination
        }
      };

    case CRM_ACTIONS.ADD_LEAD:
      return {
        ...state,
        leads: [action.payload, ...state.leads]
      };

    case CRM_ACTIONS.UPDATE_LEAD:
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id ? action.payload : lead
        )
      };

    case CRM_ACTIONS.ADD_OPPORTUNITY:
      return {
        ...state,
        opportunities: [action.payload, ...state.opportunities]
      };

    case CRM_ACTIONS.UPDATE_OPPORTUNITY:
      return {
        ...state,
        opportunities: state.opportunities.map(opp =>
          opp.id === action.payload.id ? action.payload : opp
        )
      };

    case CRM_ACTIONS.ADD_ACTIVITY:
      return {
        ...state,
        activities: [action.payload, ...state.activities]
      };

    case CRM_ACTIONS.UPDATE_ACTIVITY:
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload.id ? action.payload : activity
        )
      };

    default:
      return state;
  }
}

// Create context
const CRMContext = createContext();

// CRM provider component
export function CRMProvider({ children }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
    loadLeads();
    loadOpportunities();
    loadActivities();
  }, []);

  // Load leads when filters change
  useEffect(() => {
    if (state.filters.leads || state.pagination.leads.page) {
      loadLeads();
    }
  }, [state.filters.leads, state.pagination.leads.page]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const result = await crmService.getCRMDashboard();
      if (result.success) {
        dispatch({ type: CRM_ACTIONS.SET_DASHBOARD_DATA, payload: result.data });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  // Load leads
  const loadLeads = async () => {
    dispatch({ type: CRM_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await crmService.getLeads({
        ...state.filters.leads,
        page: state.pagination.leads.page,
        limit: state.pagination.leads.limit
      });

      if (result.success) {
        dispatch({ type: CRM_ACTIONS.SET_LEADS, payload: result.data });
        dispatch({ 
          type: CRM_ACTIONS.SET_PAGINATION, 
          payload: { type: 'leads', pagination: result.pagination } 
        });
      } else {
        dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: result.error });
      }
    } catch (error) {
      dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Load opportunities
  const loadOpportunities = async () => {
    try {
      const result = await crmService.getOpportunities(state.filters.opportunities);
      if (result.success) {
        dispatch({ type: CRM_ACTIONS.SET_OPPORTUNITIES, payload: result.data });
      }
    } catch (error) {
      console.error('Error loading opportunities:', error);
    }
  };

  // Load activities
  const loadActivities = async () => {
    try {
      const result = await crmService.getActivities(state.filters.activities);
      if (result.success) {
        dispatch({ type: CRM_ACTIONS.SET_ACTIVITIES, payload: result.data });
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  // Create lead
  const createLead = async (leadData) => {
    dispatch({ type: CRM_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await crmService.createLead(leadData);
      
      if (result.success) {
        dispatch({ type: CRM_ACTIONS.ADD_LEAD, payload: result.data });
        await loadDashboardData();
        return result;
      } else {
        dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CRM_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update lead
  const updateLead = async (leadId, updateData) => {
    try {
      const result = await crmService.updateLead(leadId, updateData);
      
      if (result.success) {
        dispatch({ type: CRM_ACTIONS.UPDATE_LEAD, payload: result.data });
        await loadDashboardData();
        return result;
      } else {
        dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Convert lead to opportunity
  const convertLeadToOpportunity = async (leadId, opportunityData) => {
    dispatch({ type: CRM_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await crmService.convertLeadToOpportunity(leadId, opportunityData);
      
      if (result.success) {
        dispatch({ type: CRM_ACTIONS.ADD_OPPORTUNITY, payload: result.data });
        // Reload leads to update the converted lead
        await loadLeads();
        await loadDashboardData();
        return result;
      } else {
        dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CRM_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Create opportunity
  const createOpportunity = async (opportunityData) => {
    dispatch({ type: CRM_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await crmService.createOpportunity(opportunityData);
      
      if (result.success) {
        dispatch({ type: CRM_ACTIONS.ADD_OPPORTUNITY, payload: result.data });
        await loadDashboardData();
        return result;
      } else {
        dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CRM_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Create activity
  const createActivity = async (activityData) => {
    try {
      const result = await crmService.createActivity(activityData);
      
      if (result.success) {
        dispatch({ type: CRM_ACTIONS.ADD_ACTIVITY, payload: result.data });
        return result;
      } else {
        dispatch({ type: CRM_ACTIONS.SET_ERROR, payload: result.error });
        return result;
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Set filters
  const setFilters = (type, filters) => {
    dispatch({ 
      type: CRM_ACTIONS.SET_FILTERS, 
      payload: { type, filters } 
    });
  };

  // Set pagination
  const setPagination = (type, pagination) => {
    dispatch({ 
      type: CRM_ACTIONS.SET_PAGINATION, 
      payload: { type, pagination: { ...state.pagination[type], ...pagination } } 
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CRM_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // State
    ...state,
    
    // Actions
    createLead,
    updateLead,
    convertLeadToOpportunity,
    createOpportunity,
    createActivity,
    loadLeads,
    loadOpportunities,
    loadActivities,
    loadDashboardData,
    setFilters,
    setPagination,
    clearError
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
}

// Custom hook to use CRM context
export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}

export default CRMContext;
