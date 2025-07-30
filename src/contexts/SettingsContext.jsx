import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial settings state
const initialSettings = {
  company: {
    name: 'MoveEase Pro',
    email: 'info@moveeasepro.com',
    phone: '+254 700 123 456',
    address: '123 Business Street, Nairobi, Kenya',
    website: 'https://moveeasepro.com',
    logo: null,
    primaryColor: '#1E40AF',
    secondaryColor: '#64748B',
    registrationNumber: '',
    taxNumber: '',
    businessLicense: ''
  },
  communication: {
    sms: {
      enabled: true,
      provider: 'africastalking',
      apiKey: '',
      username: '',
      senderId: 'MoveEase'
    },
    email: {
      enabled: true,
      provider: 'smtp',
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: 'MoveEase Pro'
    }
  },
  seo: {
    metaTitle: 'MoveEase Pro - Professional Moving Services',
    metaDescription: 'Professional moving and relocation services in Kenya',
    metaKeywords: 'moving, relocation, Kenya, professional',
    openGraph: {
      title: '',
      description: '',
      image: '',
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      site: '',
      creator: '',
      title: '',
      description: '',
      image: ''
    },
    analytics: {
      googleAnalytics: '',
      googleTagManager: '',
      facebookPixel: '',
      hotjar: ''
    }
  },
  localization: {
    country: 'KE',
    language: 'en-KE',
    timezone: 'Africa/Nairobi',
    baseCurrency: 'KES',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    firstDayOfWeek: 'monday',
    etims: {
      enabled: false,
      pinNumber: '',
      serialNumber: '',
      environment: 'sandbox'
    }
  },
  paymentGateways: {
    mpesa: {
      enabled: true,
      consumerKey: '',
      consumerSecret: '',
      environment: 'sandbox',
      shortcode: '',
      passkey: ''
    }
  },
  integrations: {
    googleCalendar: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      connected: false
    },
    googleMaps: {
      enabled: true,
      apiKey: '',
      connected: false
    },
    googleDrive: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      connected: false
    }
  },
  advancedFeatures: {
    qrCodes: {
      enabled: true,
      includeInQuotes: true,
      includeInInvoices: true,
      includeInTracking: true,
      logoOverlay: false
    },
    aiChatbot: {
      enabled: false,
      botName: 'MoveBot',
      welcomeMessage: 'Hello! How can I help you with your moving needs today?',
      autoBooking: false
    },
    virtualTours: {
      enabled: false,
      maxVideoSize: '100',
      allowedFormats: ['mp4', 'mov', 'avi'],
      autoUploadToDrive: true,
      shareableLinks: true,
      expirationDays: '30'
    }
  },
  documentTemplates: {
    invoice: {
      layout: 'modern',
      headerText: 'INVOICE',
      footerText: 'Thank you for your business!',
      showLogo: true,
      primaryColor: '#1E40AF'
    },
    quote: {
      layout: 'modern',
      headerText: 'QUOTATION',
      footerText: 'This quote is valid for 30 days',
      showLogo: true,
      primaryColor: '#059669'
    },
    delivery: {
      layout: 'minimal',
      headerText: 'DELIVERY NOTE',
      footerText: 'Goods delivered in good condition',
      showLogo: true,
      primaryColor: '#7C3AED'
    }
  }
};

// Settings actions
const SETTINGS_ACTIONS = {
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_SETTINGS: 'RESET_SETTINGS',
  IMPORT_SETTINGS: 'IMPORT_SETTINGS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Settings reducer
function settingsReducer(state, action) {
  switch (action.type) {
    case SETTINGS_ACTIONS.LOAD_SETTINGS:
      return {
        ...state,
        settings: { ...initialSettings, ...action.payload },
        loading: false,
        error: null
      };
    
    case SETTINGS_ACTIONS.UPDATE_SETTINGS:
      const updatedSettings = {
        ...state.settings,
        ...action.payload
      };
      return {
        ...state,
        settings: updatedSettings,
        lastModified: new Date().toISOString()
      };
    
    case SETTINGS_ACTIONS.RESET_SETTINGS:
      return {
        ...state,
        settings: initialSettings,
        lastModified: new Date().toISOString()
      };
    
    case SETTINGS_ACTIONS.IMPORT_SETTINGS:
      return {
        ...state,
        settings: { ...initialSettings, ...action.payload },
        lastModified: new Date().toISOString()
      };
    
    case SETTINGS_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case SETTINGS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
}

// Initial state
const initialState = {
  settings: initialSettings,
  loading: false,
  error: null,
  lastModified: null
};

// Create context
const SettingsContext = createContext();

// Settings provider component
export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    if (state.lastModified) {
      saveSettings(state.settings);
    }
  }, [state.settings, state.lastModified]);

  // Load settings from localStorage
  const loadSettings = async () => {
    try {
      dispatch({ type: SETTINGS_ACTIONS.SET_LOADING, payload: true });
      
      const savedSettings = localStorage.getItem('moveease_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: parsedSettings });
      } else {
        dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: {} });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: 'Failed to load settings' });
    }
  };

  // Save settings to localStorage
  const saveSettings = async (settings) => {
    try {
      localStorage.setItem('moveease_settings', JSON.stringify(settings));
      localStorage.setItem('moveease_settings_backup', JSON.stringify({
        settings,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving settings:', error);
      dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: 'Failed to save settings' });
    }
  };

  // Update specific settings section
  const updateSettings = (section, data) => {
    const updatedSettings = {
      ...state.settings,
      [section]: {
        ...state.settings[section],
        ...data
      }
    };
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_SETTINGS, payload: updatedSettings });
  };

  // Update nested settings
  const updateNestedSettings = (section, subsection, data) => {
    const updatedSettings = {
      ...state.settings,
      [section]: {
        ...state.settings[section],
        [subsection]: {
          ...state.settings[section][subsection],
          ...data
        }
      }
    };
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_SETTINGS, payload: updatedSettings });
  };

  // Reset all settings to defaults
  const resetSettings = () => {
    dispatch({ type: SETTINGS_ACTIONS.RESET_SETTINGS });
  };

  // Export settings as JSON
  const exportSettings = () => {
    const exportData = {
      settings: state.settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moveease-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import settings from JSON file
  const importSettings = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          if (importData.settings) {
            dispatch({ type: SETTINGS_ACTIONS.IMPORT_SETTINGS, payload: importData.settings });
            resolve(importData);
          } else {
            reject(new Error('Invalid settings file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse settings file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read settings file'));
      };
      
      reader.readAsText(file);
    });
  };

  // Validate settings
  const validateSettings = () => {
    const errors = {};
    
    // Company validation
    if (!state.settings.company.name.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!state.settings.company.email.trim()) {
      errors.companyEmail = 'Company email is required';
    }
    
    // Add more validation rules as needed
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const value = {
    ...state,
    updateSettings,
    updateNestedSettings,
    resetSettings,
    exportSettings,
    importSettings,
    validateSettings,
    loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;
