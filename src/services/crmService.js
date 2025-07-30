// Customer Relationship Management (CRM) Service Layer
import { 
  LeadSchema, 
  OpportunitySchema, 
  ActivitySchema,
  CampaignSchema,
  CustomerLifecycleSchema,
  LeadStatus,
  OpportunityStages,
  LeadSources
} from '../types/crm.js';

class CRMService {
  constructor() {
    this.leads = this.loadLeads();
    this.opportunities = this.loadOpportunities();
    this.activities = this.loadActivities();
    this.campaigns = this.loadCampaigns();
    this.customerLifecycles = this.loadCustomerLifecycles();
    this.salesPipelines = this.loadSalesPipelines();
    
    // Initialize with sample data if empty
    this.initializeSampleData();
  }

  // Load data from localStorage
  loadLeads() {
    try {
      const stored = localStorage.getItem('moveease_crm_leads');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading leads:', error);
      return [];
    }
  }

  loadOpportunities() {
    try {
      const stored = localStorage.getItem('moveease_crm_opportunities');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading opportunities:', error);
      return [];
    }
  }

  loadActivities() {
    try {
      const stored = localStorage.getItem('moveease_crm_activities');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  }

  loadCampaigns() {
    try {
      const stored = localStorage.getItem('moveease_crm_campaigns');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading campaigns:', error);
      return [];
    }
  }

  loadCustomerLifecycles() {
    try {
      const stored = localStorage.getItem('moveease_crm_lifecycles');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading customer lifecycles:', error);
      return [];
    }
  }

  loadSalesPipelines() {
    try {
      const stored = localStorage.getItem('moveease_crm_pipelines');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading sales pipelines:', error);
      return [];
    }
  }

  // Save data to localStorage
  saveLeads() {
    try {
      localStorage.setItem('moveease_crm_leads', JSON.stringify(this.leads));
      return true;
    } catch (error) {
      console.error('Error saving leads:', error);
      return false;
    }
  }

  saveOpportunities() {
    try {
      localStorage.setItem('moveease_crm_opportunities', JSON.stringify(this.opportunities));
      return true;
    } catch (error) {
      console.error('Error saving opportunities:', error);
      return false;
    }
  }

  saveActivities() {
    try {
      localStorage.setItem('moveease_crm_activities', JSON.stringify(this.activities));
      return true;
    } catch (error) {
      console.error('Error saving activities:', error);
      return false;
    }
  }

  saveCampaigns() {
    try {
      localStorage.setItem('moveease_crm_campaigns', JSON.stringify(this.campaigns));
      return true;
    } catch (error) {
      console.error('Error saving campaigns:', error);
      return false;
    }
  }

  saveCustomerLifecycles() {
    try {
      localStorage.setItem('moveease_crm_lifecycles', JSON.stringify(this.customerLifecycles));
      return true;
    } catch (error) {
      console.error('Error saving customer lifecycles:', error);
      return false;
    }
  }

  saveSalesPipelines() {
    try {
      localStorage.setItem('moveease_crm_pipelines', JSON.stringify(this.salesPipelines));
      return true;
    } catch (error) {
      console.error('Error saving sales pipelines:', error);
      return false;
    }
  }

  // Generate unique IDs
  generateId(prefix = 'crm') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate lead number
  generateLeadNumber() {
    const year = new Date().getFullYear();
    const count = this.leads.filter(l => 
      new Date(l.createdAt).getFullYear() === year
    ).length + 1;
    return `LEAD${year}${count.toString().padStart(4, '0')}`;
  }

  // Generate opportunity number
  generateOpportunityNumber() {
    const year = new Date().getFullYear();
    const count = this.opportunities.filter(o => 
      new Date(o.createdAt).getFullYear() === year
    ).length + 1;
    return `OPP${year}${count.toString().padStart(4, '0')}`;
  }

  // Lead Management
  async createLead(leadData) {
    try {
      const lead = {
        ...LeadSchema,
        id: this.generateId('lead'),
        leadNumber: this.generateLeadNumber(),
        ...leadData,
        score: this.calculateLeadScore(leadData),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system' // TODO: Get from auth context
      };

      this.leads.push(lead);
      this.saveLeads();

      // Create initial activity
      await this.createActivity({
        type: 'note',
        subject: 'Lead Created',
        description: `New lead created from ${lead.source}`,
        leadId: lead.id,
        status: 'completed',
        completedDate: new Date().toISOString()
      });

      return {
        success: true,
        data: lead,
        message: 'Lead created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create lead'
      };
    }
  }

  // Calculate lead score
  calculateLeadScore(leadData) {
    let score = 0;

    // Source scoring
    const sourceScores = {
      [LeadSources.REFERRAL]: 25,
      [LeadSources.REPEAT_CUSTOMER]: 30,
      [LeadSources.WEBSITE]: 20,
      [LeadSources.GOOGLE_ADS]: 15,
      [LeadSources.SOCIAL_MEDIA]: 10,
      [LeadSources.COLD_CALL]: 5
    };
    score += sourceScores[leadData.source] || 10;

    // Budget scoring
    if (leadData.budget > 100000) score += 25;
    else if (leadData.budget > 50000) score += 15;
    else if (leadData.budget > 20000) score += 10;

    // Timeline scoring
    const timelineScores = {
      'immediate': 25,
      '1_month': 20,
      '3_months': 15,
      '6_months': 10,
      '1_year': 5
    };
    score += timelineScores[leadData.timeline] || 0;

    // Decision maker bonus
    if (leadData.decisionMaker) score += 20;

    // Company size (if provided)
    if (leadData.company) score += 10;

    return Math.min(100, score);
  }

  // Get leads with filtering and pagination
  getLeads(options = {}) {
    try {
      let filteredLeads = [...this.leads];

      // Apply filters
      if (options.status) {
        filteredLeads = filteredLeads.filter(lead => lead.status === options.status);
      }

      if (options.source) {
        filteredLeads = filteredLeads.filter(lead => lead.source === options.source);
      }

      if (options.assignedTo) {
        filteredLeads = filteredLeads.filter(lead => lead.assignedTo === options.assignedTo);
      }

      if (options.rating) {
        filteredLeads = filteredLeads.filter(lead => lead.rating === options.rating);
      }

      if (options.search) {
        const searchTerm = options.search.toLowerCase();
        filteredLeads = filteredLeads.filter(lead => 
          lead.firstName.toLowerCase().includes(searchTerm) ||
          lead.lastName.toLowerCase().includes(searchTerm) ||
          lead.email.toLowerCase().includes(searchTerm) ||
          lead.company.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      const sortBy = options.sortBy || 'createdAt';
      const sortOrder = options.sortOrder || 'desc';
      
      filteredLeads.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const page = options.page || 1;
      const limit = options.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedLeads,
        pagination: {
          page,
          limit,
          total: filteredLeads.length,
          totalPages: Math.ceil(filteredLeads.length / limit),
          hasNext: endIndex < filteredLeads.length,
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

  // Update lead
  async updateLead(leadId, updateData) {
    try {
      const leadIndex = this.leads.findIndex(lead => lead.id === leadId);
      if (leadIndex === -1) {
        throw new Error('Lead not found');
      }

      const updatedLead = {
        ...this.leads[leadIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system'
      };

      // Recalculate score if relevant fields changed
      if (updateData.source || updateData.budget || updateData.timeline || updateData.decisionMaker) {
        updatedLead.score = this.calculateLeadScore(updatedLead);
      }

      this.leads[leadIndex] = updatedLead;
      this.saveLeads();

      return {
        success: true,
        data: updatedLead,
        message: 'Lead updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update lead'
      };
    }
  }

  // Convert lead to opportunity
  async convertLeadToOpportunity(leadId, opportunityData) {
    try {
      const lead = this.leads.find(l => l.id === leadId);
      if (!lead) {
        throw new Error('Lead not found');
      }

      // Create opportunity
      const opportunity = {
        ...OpportunitySchema,
        id: this.generateId('opportunity'),
        opportunityNumber: this.generateOpportunityNumber(),
        name: opportunityData.name || `${lead.firstName} ${lead.lastName} - ${opportunityData.serviceType}`,
        leadId: lead.id,
        stage: OpportunityStages.QUALIFICATION,
        probability: 25,
        amount: opportunityData.amount || lead.estimatedValue || 0,
        expectedCloseDate: opportunityData.expectedCloseDate || lead.estimatedCloseDate,
        serviceType: opportunityData.serviceType || '',
        serviceDescription: opportunityData.serviceDescription || '',
        ownerId: lead.assignedTo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      };

      this.opportunities.push(opportunity);
      this.saveOpportunities();

      // Update lead status
      await this.updateLead(leadId, {
        status: LeadStatus.CONVERTED,
        convertedAt: new Date().toISOString(),
        conversionValue: opportunity.amount
      });

      // Create conversion activity
      await this.createActivity({
        type: 'note',
        subject: 'Lead Converted to Opportunity',
        description: `Lead successfully converted to opportunity: ${opportunity.name}`,
        leadId: lead.id,
        opportunityId: opportunity.id,
        status: 'completed',
        completedDate: new Date().toISOString()
      });

      return {
        success: true,
        data: opportunity,
        message: 'Lead converted to opportunity successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to convert lead to opportunity'
      };
    }
  }

  // Opportunity Management
  async createOpportunity(opportunityData) {
    try {
      const opportunity = {
        ...OpportunitySchema,
        id: this.generateId('opportunity'),
        opportunityNumber: this.generateOpportunityNumber(),
        ...opportunityData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      };

      this.opportunities.push(opportunity);
      this.saveOpportunities();

      return {
        success: true,
        data: opportunity,
        message: 'Opportunity created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create opportunity'
      };
    }
  }

  // Get opportunities
  getOpportunities(options = {}) {
    try {
      let filteredOpportunities = [...this.opportunities];

      // Apply filters
      if (options.stage) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.stage === options.stage);
      }

      if (options.ownerId) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.ownerId === options.ownerId);
      }

      // Apply sorting
      filteredOpportunities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        data: filteredOpportunities
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Activity Management
  async createActivity(activityData) {
    try {
      const activity = {
        ...ActivitySchema,
        id: this.generateId('activity'),
        ...activityData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      };

      this.activities.push(activity);
      this.saveActivities();

      return {
        success: true,
        data: activity,
        message: 'Activity created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create activity'
      };
    }
  }

  // Get activities
  getActivities(options = {}) {
    try {
      let filteredActivities = [...this.activities];

      if (options.leadId) {
        filteredActivities = filteredActivities.filter(activity => activity.leadId === options.leadId);
      }

      if (options.opportunityId) {
        filteredActivities = filteredActivities.filter(activity => activity.opportunityId === options.opportunityId);
      }

      if (options.assignedTo) {
        filteredActivities = filteredActivities.filter(activity => activity.assignedTo === options.assignedTo);
      }

      // Sort by date
      filteredActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        data: filteredActivities
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get CRM dashboard data
  getCRMDashboard() {
    try {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const thisYear = new Date(now.getFullYear(), 0, 1);

      // Lead metrics
      const totalLeads = this.leads.length;
      const newLeads = this.leads.filter(l => new Date(l.createdAt) >= thisMonth).length;
      const qualifiedLeads = this.leads.filter(l => l.status === LeadStatus.QUALIFIED).length;
      const convertedLeads = this.leads.filter(l => l.status === LeadStatus.CONVERTED).length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Opportunity metrics
      const totalOpportunities = this.opportunities.length;
      const totalValue = this.opportunities.reduce((sum, opp) => sum + opp.amount, 0);
      const averageDealSize = totalOpportunities > 0 ? totalValue / totalOpportunities : 0;
      const wonOpportunities = this.opportunities.filter(opp => opp.stage === OpportunityStages.CLOSED_WON);
      const winRate = totalOpportunities > 0 ? (wonOpportunities.length / totalOpportunities) * 100 : 0;

      // Activity metrics
      const totalActivities = this.activities.length;
      const completedActivities = this.activities.filter(a => a.status === 'completed').length;
      const overdueActivities = this.activities.filter(a => 
        a.dueDate && new Date(a.dueDate) < now && a.status !== 'completed'
      ).length;

      return {
        success: true,
        data: {
          leadMetrics: {
            totalLeads,
            newLeads,
            qualifiedLeads,
            convertedLeads,
            conversionRate: Math.round(conversionRate * 100) / 100
          },
          opportunityMetrics: {
            totalOpportunities,
            totalValue,
            averageDealSize: Math.round(averageDealSize),
            winRate: Math.round(winRate * 100) / 100
          },
          activityMetrics: {
            totalActivities,
            completedActivities,
            overdueActivities
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Initialize sample data
  initializeSampleData() {
    if (this.leads.length === 0 && this.opportunities.length === 0) {
      this.createSampleData();
    }
  }

  createSampleData() {
    // Sample leads
    const sampleLeads = [
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        company: 'Tech Solutions Ltd',
        title: 'Operations Manager',
        email: 'michael.johnson@techsolutions.co.ke',
        phone: '+254701234567',
        source: LeadSources.WEBSITE,
        status: LeadStatus.QUALIFIED,
        rating: 'hot',
        budget: 150000,
        timeline: '1_month',
        decisionMaker: true,
        interestedServices: ['office_move', 'storage'],
        estimatedValue: 150000,
        painPoints: ['Current office too small', 'Need professional moving service'],
        preferredContactMethod: 'email',
        notes: 'Expanding business, needs to move office by end of month',
        tags: ['high-priority', 'office-move'],
        assignedTo: 'sales_rep_1'
      },
      {
        firstName: 'Sarah',
        lastName: 'Williams',
        company: '',
        title: '',
        email: 'sarah.williams@gmail.com',
        phone: '+254712345678',
        source: LeadSources.REFERRAL,
        status: LeadStatus.CONTACTED,
        rating: 'warm',
        budget: 80000,
        timeline: '3_months',
        decisionMaker: true,
        interestedServices: ['residential_move'],
        estimatedValue: 80000,
        painPoints: ['Moving to new city', 'Need reliable service'],
        preferredContactMethod: 'phone',
        notes: 'Referred by John Doe, planning to move to Mombasa',
        tags: ['referral', 'residential'],
        assignedTo: 'sales_rep_2'
      },
      {
        firstName: 'David',
        lastName: 'Kimani',
        company: 'Kimani Enterprises',
        title: 'CEO',
        email: 'david@kimanienterprises.co.ke',
        phone: '+254723456789',
        source: LeadSources.GOOGLE_ADS,
        status: LeadStatus.NEW,
        rating: 'cold',
        budget: 200000,
        timeline: '6_months',
        decisionMaker: true,
        interestedServices: ['office_move', 'international_move'],
        estimatedValue: 200000,
        painPoints: ['Expanding internationally', 'Need comprehensive service'],
        preferredContactMethod: 'email',
        notes: 'Interested in international moving services',
        tags: ['international', 'high-value'],
        assignedTo: 'sales_rep_1'
      }
    ];

    // Create sample leads
    sampleLeads.forEach(leadData => {
      const lead = {
        ...LeadSchema,
        id: this.generateId('lead'),
        leadNumber: this.generateLeadNumber(),
        ...leadData,
        score: this.calculateLeadScore(leadData),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      };
      this.leads.push(lead);
    });

    // Sample opportunities
    const sampleOpportunities = [
      {
        name: 'Tech Solutions Office Move',
        leadId: this.leads[0]?.id,
        stage: OpportunityStages.PROPOSAL,
        probability: 75,
        amount: 150000,
        expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        serviceType: 'office_move',
        serviceDescription: 'Complete office relocation including IT equipment',
        ownerId: 'sales_rep_1',
        proposalSent: true,
        proposalDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        proposalValue: 150000
      },
      {
        name: 'Williams Residential Move',
        leadId: this.leads[1]?.id,
        stage: OpportunityStages.QUALIFICATION,
        probability: 50,
        amount: 80000,
        expectedCloseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        serviceType: 'residential_move',
        serviceDescription: '3-bedroom house move from Nairobi to Mombasa',
        ownerId: 'sales_rep_2'
      }
    ];

    // Create sample opportunities
    sampleOpportunities.forEach(oppData => {
      const opportunity = {
        ...OpportunitySchema,
        id: this.generateId('opportunity'),
        opportunityNumber: this.generateOpportunityNumber(),
        ...oppData,
        createdAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      };
      this.opportunities.push(opportunity);
    });

    // Sample activities
    const sampleActivities = [
      {
        type: 'call',
        subject: 'Initial qualification call',
        description: 'Discussed moving requirements and timeline',
        leadId: this.leads[0]?.id,
        status: 'completed',
        completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 30,
        assignedTo: 'sales_rep_1',
        outcome: 'Qualified lead, ready for proposal'
      },
      {
        type: 'email',
        subject: 'Follow-up email with proposal',
        description: 'Sent detailed proposal for office move',
        leadId: this.leads[0]?.id,
        opportunityId: this.opportunities[0]?.id,
        status: 'completed',
        completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'sales_rep_1',
        outcome: 'Proposal sent, awaiting response'
      },
      {
        type: 'call',
        subject: 'Referral follow-up call',
        description: 'Called to introduce services and schedule site visit',
        leadId: this.leads[1]?.id,
        status: 'completed',
        completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 20,
        assignedTo: 'sales_rep_2',
        outcome: 'Interested, scheduled site visit'
      }
    ];

    // Create sample activities
    sampleActivities.forEach(activityData => {
      const activity = {
        ...ActivitySchema,
        id: this.generateId('activity'),
        ...activityData,
        createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      };
      this.activities.push(activity);
    });

    // Save all sample data
    this.saveLeads();
    this.saveOpportunities();
    this.saveActivities();
  }
}

// Create singleton instance
const crmService = new CRMService();

export default crmService;
