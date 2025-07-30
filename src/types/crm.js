// Customer Relationship Management (CRM) - Data Types and Models

export const LeadSources = {
  WEBSITE: 'website',
  REFERRAL: 'referral',
  SOCIAL_MEDIA: 'social_media',
  GOOGLE_ADS: 'google_ads',
  FACEBOOK_ADS: 'facebook_ads',
  COLD_CALL: 'cold_call',
  EMAIL_CAMPAIGN: 'email_campaign',
  TRADE_SHOW: 'trade_show',
  PARTNER: 'partner',
  WALK_IN: 'walk_in',
  PHONE_INQUIRY: 'phone_inquiry',
  REPEAT_CUSTOMER: 'repeat_customer'
};

export const LeadStatus = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  PROPOSAL_SENT: 'proposal_sent',
  NEGOTIATION: 'negotiation',
  CONVERTED: 'converted',
  LOST: 'lost',
  NURTURING: 'nurturing'
};

export const OpportunityStages = {
  PROSPECTING: 'prospecting',
  QUALIFICATION: 'qualification',
  NEEDS_ANALYSIS: 'needs_analysis',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost'
};

export const PipelineStages = {
  LEAD: 'lead',
  QUALIFIED_LEAD: 'qualified_lead',
  OPPORTUNITY: 'opportunity',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost'
};

export const ActivityTypes = {
  CALL: 'call',
  EMAIL: 'email',
  MEETING: 'meeting',
  TASK: 'task',
  NOTE: 'note',
  QUOTE: 'quote',
  PROPOSAL: 'proposal',
  FOLLOW_UP: 'follow_up',
  DEMO: 'demo',
  SITE_VISIT: 'site_visit'
};

export const CampaignTypes = {
  EMAIL: 'email',
  SMS: 'sms',
  SOCIAL_MEDIA: 'social_media',
  GOOGLE_ADS: 'google_ads',
  FACEBOOK_ADS: 'facebook_ads',
  REFERRAL: 'referral',
  EVENT: 'event',
  CONTENT: 'content',
  WEBINAR: 'webinar',
  DIRECT_MAIL: 'direct_mail'
};

export const CampaignStatus = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Lead Schema
export const LeadSchema = {
  id: '',
  leadNumber: '', // Auto-generated
  
  // Basic Information
  firstName: '',
  lastName: '',
  company: '',
  title: '',
  email: '',
  phone: '',
  website: '',
  
  // Address
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Kenya'
  },
  
  // Lead Details
  source: LeadSources.WEBSITE,
  status: LeadStatus.NEW,
  rating: 'cold', // cold, warm, hot
  score: 0, // 0-100
  
  // Assignment
  assignedTo: '',
  assignedBy: '',
  assignedAt: null,
  
  // Service Interest
  interestedServices: [],
  estimatedValue: 0,
  estimatedCloseDate: null,
  
  // Qualification
  budget: 0,
  timeline: '', // immediate, 1_month, 3_months, 6_months, 1_year
  decisionMaker: false,
  painPoints: [],
  
  // Communication Preferences
  preferredContactMethod: 'email',
  bestTimeToContact: '',
  timezone: 'Africa/Nairobi',
  
  // Tracking
  firstContactDate: null,
  lastContactDate: null,
  nextFollowUpDate: null,
  contactAttempts: 0,
  
  // Conversion
  convertedAt: null,
  convertedTo: '', // customer_id
  conversionValue: 0,
  
  // Campaign
  campaignId: '',
  campaignSource: '',
  
  // Notes and Tags
  notes: '',
  tags: [],
  
  // System Information
  createdAt: null,
  updatedAt: null,
  createdBy: '',
  updatedBy: ''
};

// Opportunity Schema
export const OpportunitySchema = {
  id: '',
  opportunityNumber: '', // Auto-generated
  name: '',
  
  // Associated Records
  leadId: '',
  customerId: '',
  accountId: '',
  
  // Opportunity Details
  stage: OpportunityStages.PROSPECTING,
  probability: 0, // 0-100
  amount: 0,
  currency: 'KSH',
  
  // Dates
  expectedCloseDate: null,
  actualCloseDate: null,
  createdDate: null,
  
  // Service Details
  serviceType: '',
  serviceDescription: '',
  requirements: '',
  
  // Competition
  competitors: [],
  competitiveAdvantage: '',
  
  // Decision Process
  decisionMakers: [
    {
      name: '',
      title: '',
      influence: 'high', // high, medium, low
      supportLevel: 'champion' // champion, supporter, neutral, detractor
    }
  ],
  decisionCriteria: [],
  decisionTimeline: '',
  
  // Proposal
  proposalSent: false,
  proposalDate: null,
  proposalValue: 0,
  proposalValidUntil: null,
  
  // Assignment
  ownerId: '',
  teamMembers: [],
  
  // Tracking
  activities: [],
  nextSteps: '',
  
  // Closure
  winReason: '',
  lossReason: '',
  
  // System Information
  createdAt: null,
  updatedAt: null,
  createdBy: '',
  updatedBy: ''
};

// Activity Schema
export const ActivitySchema = {
  id: '',
  type: ActivityTypes.CALL,
  subject: '',
  description: '',
  
  // Associated Records
  leadId: '',
  opportunityId: '',
  customerId: '',
  
  // Scheduling
  scheduledDate: null,
  dueDate: null,
  completedDate: null,
  duration: 0, // in minutes
  
  // Status
  status: 'scheduled', // scheduled, in_progress, completed, cancelled
  priority: 'medium', // low, medium, high, urgent
  
  // Participants
  assignedTo: '',
  participants: [],
  
  // Location/Method
  location: '',
  meetingType: 'in_person', // in_person, phone, video, email
  
  // Outcome
  outcome: '',
  nextAction: '',
  followUpRequired: false,
  followUpDate: null,
  
  // System Information
  createdAt: null,
  updatedAt: null,
  createdBy: '',
  updatedBy: ''
};

// Campaign Schema
export const CampaignSchema = {
  id: '',
  name: '',
  description: '',
  type: CampaignTypes.EMAIL,
  status: CampaignStatus.DRAFT,
  
  // Dates
  startDate: null,
  endDate: null,
  
  // Budget
  budget: 0,
  actualCost: 0,
  currency: 'KSH',
  
  // Targeting
  targetAudience: '',
  targetCriteria: {
    demographics: {},
    geography: [],
    interests: [],
    behavior: {}
  },
  
  // Content
  subject: '',
  content: '',
  callToAction: '',
  landingPage: '',
  
  // Metrics
  metrics: {
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    responded: 0,
    converted: 0,
    unsubscribed: 0,
    bounced: 0
  },
  
  // Performance
  roi: 0,
  costPerLead: 0,
  conversionRate: 0,
  
  // Leads Generated
  leadsGenerated: [],
  
  // System Information
  createdAt: null,
  updatedAt: null,
  createdBy: '',
  updatedBy: ''
};

// Sales Pipeline Schema
export const SalesPipelineSchema = {
  id: '',
  name: '',
  description: '',
  
  // Stages
  stages: [
    {
      id: '',
      name: '',
      probability: 0,
      duration: 0, // average days in stage
      requirements: [],
      actions: []
    }
  ],
  
  // Metrics
  totalValue: 0,
  totalOpportunities: 0,
  conversionRate: 0,
  averageDealSize: 0,
  averageSalesCycle: 0,
  
  // Performance by Stage
  stageMetrics: {},
  
  // System Information
  createdAt: null,
  updatedAt: null,
  createdBy: '',
  updatedBy: ''
};

// Customer Lifecycle Schema
export const CustomerLifecycleSchema = {
  customerId: '',
  
  // Lifecycle Stages
  currentStage: 'prospect', // prospect, lead, opportunity, customer, advocate, churned
  stageHistory: [
    {
      stage: '',
      enteredAt: null,
      exitedAt: null,
      duration: 0, // in days
      triggers: []
    }
  ],
  
  // Lifecycle Metrics
  acquisitionCost: 0,
  timeToConversion: 0, // days from first contact to customer
  lifetimeValue: 0,
  churnRisk: 'low', // low, medium, high
  
  // Automation Rules
  automationRules: [
    {
      id: '',
      trigger: '',
      condition: '',
      action: '',
      isActive: true
    }
  ],
  
  // Touchpoints
  touchpoints: [],
  
  // System Information
  lastUpdated: null,
  updatedBy: ''
};

// CRM Dashboard Schema
export const CRMDashboardSchema = {
  // Lead Metrics
  leadMetrics: {
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    averageLeadScore: 0,
    leadsBySource: {},
    leadsByStatus: {}
  },
  
  // Opportunity Metrics
  opportunityMetrics: {
    totalOpportunities: 0,
    totalValue: 0,
    averageDealSize: 0,
    winRate: 0,
    averageSalesCycle: 0,
    opportunitiesByStage: {},
    forecastedRevenue: 0
  },
  
  // Activity Metrics
  activityMetrics: {
    totalActivities: 0,
    completedActivities: 0,
    overdueActivities: 0,
    upcomingActivities: 0,
    activitiesByType: {}
  },
  
  // Campaign Metrics
  campaignMetrics: {
    activeCampaigns: 0,
    totalLeadsGenerated: 0,
    totalCampaignCost: 0,
    averageROI: 0,
    bestPerformingCampaign: ''
  },
  
  // Performance Metrics
  performanceMetrics: {
    monthlyRevenue: 0,
    quarterlyRevenue: 0,
    yearlyRevenue: 0,
    revenueGrowth: 0,
    customerAcquisitionCost: 0,
    customerLifetimeValue: 0
  },
  
  // Last Updated
  lastUpdated: null
};

// CRM Validation Rules
export const CRMValidation = {
  lead: {
    firstName: { minLength: 2, maxLength: 50 },
    lastName: { minLength: 2, maxLength: 50 },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { minLength: 10, maxLength: 15 },
    score: { min: 0, max: 100 },
    estimatedValue: { min: 0, max: 10000000 }
  },
  opportunity: {
    name: { minLength: 5, maxLength: 200 },
    amount: { min: 0, max: 10000000 },
    probability: { min: 0, max: 100 }
  },
  activity: {
    subject: { minLength: 5, maxLength: 200 },
    duration: { min: 0, max: 1440 } // max 24 hours
  },
  campaign: {
    name: { minLength: 5, maxLength: 100 },
    budget: { min: 0, max: 10000000 }
  }
};

export default {
  LeadSources,
  LeadStatus,
  OpportunityStages,
  PipelineStages,
  ActivityTypes,
  CampaignTypes,
  CampaignStatus,
  LeadSchema,
  OpportunitySchema,
  ActivitySchema,
  CampaignSchema,
  SalesPipelineSchema,
  CustomerLifecycleSchema,
  CRMDashboardSchema,
  CRMValidation
};
