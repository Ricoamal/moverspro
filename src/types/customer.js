// Customer Management System - Data Types and Models

export const CustomerTypes = {
  INDIVIDUAL: 'individual',
  CORPORATE: 'corporate',
  VIP: 'vip'
};

export const CustomerStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PROSPECT: 'prospect'
};

export const ContactTypes = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  EMERGENCY: 'emergency',
  WORK: 'work'
};

export const AddressTypes = {
  HOME: 'home',
  WORK: 'work',
  BILLING: 'billing',
  DELIVERY: 'delivery'
};

export const CommunicationPreferences = {
  EMAIL: 'email',
  SMS: 'sms',
  PHONE: 'phone',
  WHATSAPP: 'whatsapp',
  IN_APP: 'in_app'
};

export const ServiceTypes = {
  RESIDENTIAL_MOVE: 'residential_move',
  OFFICE_MOVE: 'office_move',
  PACKING: 'packing',
  STORAGE: 'storage',
  CLEANING: 'cleaning',
  ASSEMBLY: 'assembly'
};

export const MoveStatus = {
  INQUIRY: 'inquiry',
  QUOTED: 'quoted',
  BOOKED: 'booked',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Customer Data Structure
export const CustomerSchema = {
  // Basic Information
  id: '',
  customerNumber: '', // Auto-generated unique identifier
  type: CustomerTypes.INDIVIDUAL,
  status: CustomerStatus.ACTIVE,
  
  // Personal Information
  personalInfo: {
    title: '', // Mr, Mrs, Ms, Dr, etc.
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: null,
    gender: '', // male, female, other
    nationality: '',
    idNumber: '',
    passportNumber: '',
    profilePhoto: null
  },
  
  // Contact Information
  contactInfo: {
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    alternateEmail: '',
    whatsappNumber: '',
    preferredContactMethod: CommunicationPreferences.EMAIL,
    preferredContactTime: 'anytime' // morning, afternoon, evening, anytime
  },
  
  // Addresses
  addresses: [
    {
      id: '',
      type: AddressTypes.HOME,
      isPrimary: true,
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Kenya',
      coordinates: {
        latitude: null,
        longitude: null
      },
      accessInstructions: '',
      isActive: true
    }
  ],
  
  // Corporate Information (for corporate customers)
  corporateInfo: {
    companyName: '',
    registrationNumber: '',
    taxNumber: '',
    industry: '',
    companySize: '', // small, medium, large, enterprise
    website: '',
    contactPerson: {
      name: '',
      title: '',
      phone: '',
      email: ''
    }
  },
  
  // Emergency Contacts
  emergencyContacts: [
    {
      id: '',
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: ''
    }
  ],
  
  // Service Preferences
  preferences: {
    preferredServices: [],
    specialRequirements: '',
    accessibilityNeeds: '',
    petInformation: '',
    valuableItems: '',
    packingPreferences: {
      selfPack: false,
      partialPack: false,
      fullPack: false
    },
    insurancePreferences: {
      basicCoverage: true,
      fullCoverage: false,
      customCoverage: false
    },
    communicationPreferences: {
      smsUpdates: true,
      emailUpdates: true,
      whatsappUpdates: false,
      callUpdates: false
    }
  },
  
  // Move History
  moveHistory: [
    {
      id: '',
      moveNumber: '',
      date: null,
      serviceType: ServiceTypes.RESIDENTIAL_MOVE,
      status: MoveStatus.COMPLETED,
      origin: {
        address: '',
        coordinates: { latitude: null, longitude: null }
      },
      destination: {
        address: '',
        coordinates: { latitude: null, longitude: null }
      },
      items: [],
      totalValue: 0,
      finalCost: 0,
      rating: null,
      feedback: '',
      assignedStaff: [],
      completionDate: null
    }
  ],
  
  // Financial Information
  financialInfo: {
    creditLimit: 0,
    outstandingBalance: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    paymentMethods: [
      {
        id: '',
        type: 'mpesa', // mpesa, card, bank_transfer, cash
        details: {
          phoneNumber: '', // for M-Pesa
          cardLast4: '', // for cards
          bankName: '', // for bank transfers
          accountNumber: '' // masked
        },
        isDefault: false,
        isActive: true
      }
    ],
    billingAddress: null // reference to address ID
  },
  
  // Customer Segmentation
  segmentation: {
    tier: 'standard', // bronze, silver, gold, platinum
    loyaltyPoints: 0,
    lifetimeValue: 0,
    riskScore: 'low', // low, medium, high
    churnProbability: 'low', // low, medium, high
    lastServiceDate: null,
    serviceFrequency: 'occasional' // frequent, regular, occasional, one-time
  },
  
  // Communication History
  communications: [
    {
      id: '',
      type: 'email', // email, sms, call, meeting, chat
      direction: 'outbound', // inbound, outbound
      subject: '',
      content: '',
      timestamp: null,
      staffMember: '',
      status: 'sent', // sent, delivered, read, failed
      relatedMove: null // move ID if related to specific move
    }
  ],
  
  // Documents
  documents: [
    {
      id: '',
      name: '',
      type: 'contract', // contract, id_copy, insurance, inventory, photo
      url: '',
      uploadDate: null,
      uploadedBy: '',
      relatedMove: null,
      isActive: true
    }
  ],
  
  // Notes and Tags
  notes: [
    {
      id: '',
      content: '',
      type: 'general', // general, important, warning, follow_up
      createdBy: '',
      createdAt: null,
      isPrivate: false
    }
  ],
  
  tags: [], // Array of strings for easy categorization
  
  // System Information
  systemInfo: {
    createdAt: null,
    createdBy: '',
    updatedAt: null,
    updatedBy: '',
    lastLoginAt: null,
    source: 'direct', // direct, referral, online, social_media, advertisement
    referredBy: null, // customer ID if referred
    assignedSalesRep: '',
    assignedAccountManager: ''
  },
  
  // Privacy and Consent
  privacy: {
    marketingConsent: false,
    dataProcessingConsent: true,
    thirdPartySharing: false,
    communicationConsent: {
      email: true,
      sms: true,
      phone: false,
      whatsapp: false
    }
  }
};

// Customer Search and Filter Options
export const CustomerFilters = {
  status: Object.values(CustomerStatus),
  type: Object.values(CustomerTypes),
  tier: ['bronze', 'silver', 'gold', 'platinum'],
  serviceFrequency: ['frequent', 'regular', 'occasional', 'one-time'],
  riskScore: ['low', 'medium', 'high'],
  source: ['direct', 'referral', 'online', 'social_media', 'advertisement']
};

// Customer Validation Rules
export const CustomerValidation = {
  required: ['firstName', 'lastName', 'primaryPhone', 'email'],
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+254|0)[17]\d{8}$/, // Kenyan phone number format
  idNumber: /^\d{8}$/, // Kenyan ID number format
  postalCode: /^\d{5}$/ // Kenyan postal code format
};

export default {
  CustomerTypes,
  CustomerStatus,
  ContactTypes,
  AddressTypes,
  CommunicationPreferences,
  ServiceTypes,
  MoveStatus,
  CustomerSchema,
  CustomerFilters,
  CustomerValidation
};
