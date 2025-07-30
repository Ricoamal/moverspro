// Advanced Customer Features - Enhanced Data Types and Models

export const CustomerTiers = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond'
};

export const CommunicationChannels = {
  EMAIL: 'email',
  PHONE: 'phone',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  IN_PERSON: 'in_person',
  WEBSITE: 'website',
  SOCIAL_MEDIA: 'social_media',
  REFERRAL: 'referral'
};

export const CommunicationTypes = {
  INQUIRY: 'inquiry',
  QUOTE_REQUEST: 'quote_request',
  BOOKING: 'booking',
  COMPLAINT: 'complaint',
  FEEDBACK: 'feedback',
  FOLLOW_UP: 'follow_up',
  MARKETING: 'marketing',
  SUPPORT: 'support',
  BILLING: 'billing',
  REMINDER: 'reminder'
};

export const CommunicationStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ESCALATED: 'escalated',
  CLOSED: 'closed'
};

export const ServiceCategories = {
  RESIDENTIAL_MOVE: 'residential_move',
  OFFICE_MOVE: 'office_move',
  INTERNATIONAL_MOVE: 'international_move',
  STORAGE: 'storage',
  PACKING: 'packing',
  UNPACKING: 'unpacking',
  ASSEMBLY: 'assembly',
  CLEANING: 'cleaning',
  INSURANCE: 'insurance',
  CONSULTATION: 'consultation'
};

export const ServiceStatus = {
  QUOTED: 'quoted',
  BOOKED: 'booked',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled'
};

export const CustomerSatisfactionLevels = {
  VERY_DISSATISFIED: 1,
  DISSATISFIED: 2,
  NEUTRAL: 3,
  SATISFIED: 4,
  VERY_SATISFIED: 5
};

export const LoyaltyProgramTiers = {
  STARTER: { name: 'Starter', minPoints: 0, benefits: ['Basic support', '5% discount on storage'] },
  BRONZE: { name: 'Bronze', minPoints: 100, benefits: ['Priority support', '10% discount on services', 'Free packing materials'] },
  SILVER: { name: 'Silver', minPoints: 500, benefits: ['Dedicated account manager', '15% discount', 'Free insurance up to KSh 100,000'] },
  GOLD: { name: 'Gold', minPoints: 1000, benefits: ['24/7 support', '20% discount', 'Free storage for 1 month', 'Priority scheduling'] },
  PLATINUM: { name: 'Platinum', minPoints: 2500, benefits: ['VIP treatment', '25% discount', 'Free comprehensive insurance', 'Concierge service'] }
};

// Enhanced Communication Schema
export const CommunicationSchema = {
  id: '',
  customerId: '',
  type: CommunicationTypes.INQUIRY,
  channel: CommunicationChannels.EMAIL,
  direction: 'inbound', // inbound, outbound
  subject: '',
  content: '',
  attachments: [],
  
  // Contact Information
  contactPerson: {
    name: '',
    email: '',
    phone: '',
    role: ''
  },
  
  // Staff Assignment
  assignedTo: '',
  assignedBy: '',
  assignedAt: null,
  
  // Status and Priority
  status: CommunicationStatus.PENDING,
  priority: 'medium', // low, medium, high, urgent
  tags: [],
  
  // Response Information
  responseRequired: true,
  responseDeadline: null,
  responseTime: null, // in minutes
  firstResponseTime: null,
  
  // Related Records
  relatedQuoteId: '',
  relatedMoveId: '',
  relatedServiceId: '',
  
  // Follow-up
  followUpRequired: false,
  followUpDate: null,
  followUpNotes: '',
  
  // Satisfaction
  satisfactionRating: null,
  satisfactionFeedback: '',
  
  // System Information
  createdAt: null,
  updatedAt: null,
  createdBy: '',
  updatedBy: '',
  
  // Analytics
  readAt: null,
  clickedLinks: [],
  bounced: false,
  delivered: true
};

// Service History Schema
export const ServiceHistorySchema = {
  id: '',
  customerId: '',
  serviceNumber: '', // Auto-generated
  
  // Service Details
  category: ServiceCategories.RESIDENTIAL_MOVE,
  title: '',
  description: '',
  status: ServiceStatus.QUOTED,
  
  // Dates
  requestDate: null,
  quotedDate: null,
  scheduledDate: null,
  completedDate: null,
  
  // Location Information
  origin: {
    address: '',
    coordinates: { latitude: null, longitude: null },
    accessNotes: '',
    contactPerson: { name: '', phone: '' }
  },
  destination: {
    address: '',
    coordinates: { latitude: null, longitude: null },
    accessNotes: '',
    contactPerson: { name: '', phone: '' }
  },
  
  // Service Specifications
  items: [],
  specialRequirements: '',
  estimatedVolume: 0,
  estimatedWeight: 0,
  estimatedDuration: 0, // in hours
  
  // Pricing
  quotedAmount: 0,
  finalAmount: 0,
  currency: 'KSH',
  paymentStatus: 'pending', // pending, partial, paid, overdue
  paymentMethod: '',
  
  // Staff Assignment
  assignedStaff: [],
  teamLead: '',
  
  // Equipment and Resources
  vehiclesUsed: [],
  equipmentUsed: [],
  packingMaterials: [],
  
  // Quality and Feedback
  qualityScore: null,
  customerRating: null,
  customerFeedback: '',
  internalNotes: '',
  
  // Issues and Resolutions
  issues: [
    {
      id: '',
      description: '',
      severity: 'low', // low, medium, high, critical
      reportedAt: null,
      resolvedAt: null,
      resolution: '',
      reportedBy: ''
    }
  ],
  
  // Insurance and Claims
  insuranceCoverage: {
    enabled: false,
    provider: '',
    policyNumber: '',
    coverageAmount: 0,
    premium: 0
  },
  claims: [],
  
  // Photos and Documentation
  beforePhotos: [],
  afterPhotos: [],
  documents: [],
  
  // System Information
  createdAt: null,
  updatedAt: null,
  createdBy: '',
  updatedBy: ''
};

// Customer Analytics Schema
export const CustomerAnalyticsSchema = {
  customerId: '',
  
  // Basic Metrics
  totalServices: 0,
  totalSpent: 0,
  averageOrderValue: 0,
  lifetimeValue: 0,
  
  // Service Patterns
  preferredServices: [],
  seasonalPatterns: {},
  frequencyPattern: 'one-time', // one-time, occasional, regular, frequent
  
  // Communication Metrics
  totalCommunications: 0,
  averageResponseTime: 0, // in minutes
  preferredChannel: CommunicationChannels.EMAIL,
  communicationFrequency: 0, // per month
  
  // Satisfaction Metrics
  averageRating: 0,
  npsScore: null, // Net Promoter Score
  satisfactionTrend: 'stable', // improving, stable, declining
  complaintCount: 0,
  complimentCount: 0,
  
  // Loyalty Metrics
  loyaltyPoints: 0,
  loyaltyTier: CustomerTiers.BRONZE,
  referralCount: 0,
  referralValue: 0,
  
  // Risk Metrics
  riskScore: 'low', // low, medium, high
  churnProbability: 0, // 0-1
  paymentRisk: 'low', // low, medium, high
  
  // Engagement Metrics
  lastServiceDate: null,
  daysSinceLastService: 0,
  engagementScore: 0, // 0-100
  
  // Predictive Analytics
  nextServicePrediction: {
    probability: 0,
    estimatedDate: null,
    estimatedValue: 0,
    recommendedServices: []
  },
  
  // Segmentation
  segment: 'new', // new, active, at-risk, dormant, lost
  segmentScore: 0,
  
  // Financial Metrics
  creditLimit: 0,
  outstandingBalance: 0,
  paymentHistory: {
    onTimePayments: 0,
    latePayments: 0,
    averagePaymentDelay: 0 // in days
  },
  
  // Last Updated
  lastCalculated: null,
  calculatedBy: 'system'
};

// Customer Insights Schema
export const CustomerInsightsSchema = {
  customerId: '',
  
  // Behavioral Insights
  insights: [
    {
      id: '',
      type: 'behavioral', // behavioral, financial, satisfaction, risk
      category: 'service_preference',
      title: '',
      description: '',
      confidence: 0, // 0-1
      impact: 'medium', // low, medium, high
      actionable: true,
      recommendations: [],
      createdAt: null
    }
  ],
  
  // Recommendations
  recommendations: [
    {
      id: '',
      type: 'service', // service, communication, pricing, retention
      title: '',
      description: '',
      priority: 'medium', // low, medium, high
      estimatedImpact: '',
      estimatedRevenue: 0,
      effort: 'low', // low, medium, high
      deadline: null,
      status: 'pending' // pending, in_progress, completed, dismissed
    }
  ],
  
  // Alerts
  alerts: [
    {
      id: '',
      type: 'churn_risk', // churn_risk, payment_risk, satisfaction_drop, opportunity
      severity: 'medium', // low, medium, high, critical
      message: '',
      triggeredAt: null,
      acknowledged: false,
      acknowledgedBy: '',
      acknowledgedAt: null
    }
  ],
  
  // Opportunities
  opportunities: [
    {
      id: '',
      type: 'upsell', // upsell, cross_sell, retention, referral
      title: '',
      description: '',
      estimatedValue: 0,
      probability: 0, // 0-1
      timeframe: '30_days', // 30_days, 90_days, 6_months, 1_year
      status: 'identified' // identified, pursuing, won, lost
    }
  ],
  
  // Last Updated
  lastUpdated: null,
  updatedBy: 'system'
};

// Customer Journey Schema
export const CustomerJourneySchema = {
  customerId: '',
  
  // Journey Stages
  currentStage: 'awareness', // awareness, consideration, decision, onboarding, active, retention, advocacy
  stageHistory: [
    {
      stage: '',
      enteredAt: null,
      exitedAt: null,
      duration: 0, // in days
      touchpoints: []
    }
  ],
  
  // Touchpoints
  touchpoints: [
    {
      id: '',
      type: 'communication', // communication, service, payment, support
      channel: CommunicationChannels.EMAIL,
      description: '',
      timestamp: null,
      outcome: '', // positive, neutral, negative
      notes: ''
    }
  ],
  
  // Milestones
  milestones: [
    {
      id: '',
      name: 'first_service',
      description: 'Customer completed their first service',
      achievedAt: null,
      value: 0
    }
  ],
  
  // Journey Metrics
  totalTouchpoints: 0,
  averageTimeBetweenTouchpoints: 0, // in days
  conversionRate: 0, // from inquiry to service
  
  // Last Updated
  lastUpdated: null
};

// Customer Validation Rules
export const CustomerAdvancedValidation = {
  communication: {
    subject: { minLength: 5, maxLength: 200 },
    content: { minLength: 10, maxLength: 5000 },
    responseTime: { max: 10080 } // 7 days in minutes
  },
  service: {
    quotedAmount: { min: 0, max: 10000000 },
    estimatedDuration: { min: 1, max: 720 }, // 1 hour to 30 days
    rating: { min: 1, max: 5 }
  },
  analytics: {
    loyaltyPoints: { min: 0, max: 100000 },
    riskScore: ['low', 'medium', 'high'],
    churnProbability: { min: 0, max: 1 }
  }
};

export default {
  CustomerTiers,
  CommunicationChannels,
  CommunicationTypes,
  CommunicationStatus,
  ServiceCategories,
  ServiceStatus,
  CustomerSatisfactionLevels,
  LoyaltyProgramTiers,
  CommunicationSchema,
  ServiceHistorySchema,
  CustomerAnalyticsSchema,
  CustomerInsightsSchema,
  CustomerJourneySchema,
  CustomerAdvancedValidation
};
