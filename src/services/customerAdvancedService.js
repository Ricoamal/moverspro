// Advanced Customer Service Layer
import { 
  CommunicationSchema, 
  ServiceHistorySchema, 
  CustomerAnalyticsSchema,
  CustomerInsightsSchema,
  CustomerJourneySchema,
  CustomerTiers,
  LoyaltyProgramTiers,
  CommunicationStatus,
  ServiceStatus
} from '../types/customerAdvanced.js';

class CustomerAdvancedService {
  constructor() {
    this.communications = this.loadCommunications();
    this.serviceHistory = this.loadServiceHistory();
    this.customerAnalytics = this.loadCustomerAnalytics();
    this.customerInsights = this.loadCustomerInsights();
    this.customerJourneys = this.loadCustomerJourneys();

    // Initialize with sample data if empty
    this.initializeSampleData();
  }

  // Load data from localStorage
  loadCommunications() {
    try {
      const stored = localStorage.getItem('moveease_communications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading communications:', error);
      return [];
    }
  }

  loadServiceHistory() {
    try {
      const stored = localStorage.getItem('moveease_service_history');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading service history:', error);
      return [];
    }
  }

  loadCustomerAnalytics() {
    try {
      const stored = localStorage.getItem('moveease_customer_analytics');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading customer analytics:', error);
      return [];
    }
  }

  loadCustomerInsights() {
    try {
      const stored = localStorage.getItem('moveease_customer_insights');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading customer insights:', error);
      return [];
    }
  }

  loadCustomerJourneys() {
    try {
      const stored = localStorage.getItem('moveease_customer_journeys');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading customer journeys:', error);
      return [];
    }
  }

  // Save data to localStorage
  saveCommunications() {
    try {
      localStorage.setItem('moveease_communications', JSON.stringify(this.communications));
      return true;
    } catch (error) {
      console.error('Error saving communications:', error);
      return false;
    }
  }

  saveServiceHistory() {
    try {
      localStorage.setItem('moveease_service_history', JSON.stringify(this.serviceHistory));
      return true;
    } catch (error) {
      console.error('Error saving service history:', error);
      return false;
    }
  }

  saveCustomerAnalytics() {
    try {
      localStorage.setItem('moveease_customer_analytics', JSON.stringify(this.customerAnalytics));
      return true;
    } catch (error) {
      console.error('Error saving customer analytics:', error);
      return false;
    }
  }

  saveCustomerInsights() {
    try {
      localStorage.setItem('moveease_customer_insights', JSON.stringify(this.customerInsights));
      return true;
    } catch (error) {
      console.error('Error saving customer insights:', error);
      return false;
    }
  }

  saveCustomerJourneys() {
    try {
      localStorage.setItem('moveease_customer_journeys', JSON.stringify(this.customerJourneys));
      return true;
    } catch (error) {
      console.error('Error saving customer journeys:', error);
      return false;
    }
  }

  // Generate unique IDs
  generateId(prefix = 'adv') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Communication Management
  async createCommunication(communicationData) {
    try {
      const communication = {
        ...CommunicationSchema,
        id: this.generateId('comm'),
        ...communicationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system' // TODO: Get from auth context
      };

      this.communications.push(communication);
      this.saveCommunications();

      // Update customer journey
      await this.updateCustomerJourney(communication.customerId, {
        type: 'communication',
        channel: communication.channel,
        description: communication.subject,
        timestamp: communication.createdAt,
        outcome: 'neutral'
      });

      return {
        success: true,
        data: communication,
        message: 'Communication created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create communication'
      };
    }
  }

  // Get communications for a customer
  getCustomerCommunications(customerId, options = {}) {
    try {
      let communications = this.communications.filter(comm => comm.customerId === customerId);

      // Apply filters
      if (options.type) {
        communications = communications.filter(comm => comm.type === options.type);
      }

      if (options.status) {
        communications = communications.filter(comm => comm.status === options.status);
      }

      if (options.channel) {
        communications = communications.filter(comm => comm.channel === options.channel);
      }

      // Sort by date (newest first)
      communications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        data: communications
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update communication status
  async updateCommunicationStatus(communicationId, status, notes = '') {
    try {
      const commIndex = this.communications.findIndex(comm => comm.id === communicationId);
      if (commIndex === -1) {
        throw new Error('Communication not found');
      }

      this.communications[commIndex] = {
        ...this.communications[commIndex],
        status,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system'
      };

      if (notes) {
        this.communications[commIndex].content += `\n\nUpdate: ${notes}`;
      }

      this.saveCommunications();

      return {
        success: true,
        message: 'Communication status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Service History Management
  async createServiceRecord(serviceData) {
    try {
      const service = {
        ...ServiceHistorySchema,
        id: this.generateId('service'),
        serviceNumber: this.generateServiceNumber(),
        ...serviceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      };

      this.serviceHistory.push(service);
      this.saveServiceHistory();

      // Update customer analytics
      await this.updateCustomerAnalytics(service.customerId);

      // Update customer journey
      await this.updateCustomerJourney(service.customerId, {
        type: 'service',
        channel: 'in_person',
        description: `${service.category} - ${service.title}`,
        timestamp: service.createdAt,
        outcome: 'positive'
      });

      return {
        success: true,
        data: service,
        message: 'Service record created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create service record'
      };
    }
  }

  // Generate service number
  generateServiceNumber() {
    const year = new Date().getFullYear();
    const count = this.serviceHistory.filter(s => 
      new Date(s.createdAt).getFullYear() === year
    ).length + 1;
    return `SRV${year}${count.toString().padStart(4, '0')}`;
  }

  // Get customer service history
  getCustomerServiceHistory(customerId) {
    try {
      const services = this.serviceHistory
        .filter(service => service.customerId === customerId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        data: services
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Customer Analytics
  async calculateCustomerAnalytics(customerId) {
    try {
      const services = this.serviceHistory.filter(s => s.customerId === customerId);
      const communications = this.communications.filter(c => c.customerId === customerId);

      // Basic metrics
      const totalServices = services.length;
      const totalSpent = services.reduce((sum, s) => sum + (s.finalAmount || s.quotedAmount || 0), 0);
      const averageOrderValue = totalServices > 0 ? totalSpent / totalServices : 0;

      // Service patterns
      const serviceCategories = {};
      services.forEach(service => {
        serviceCategories[service.category] = (serviceCategories[service.category] || 0) + 1;
      });
      const preferredServices = Object.entries(serviceCategories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category);

      // Communication metrics
      const totalCommunications = communications.length;
      const responseTimesInMinutes = communications
        .filter(c => c.responseTime)
        .map(c => c.responseTime);
      const averageResponseTime = responseTimesInMinutes.length > 0 
        ? responseTimesInMinutes.reduce((sum, time) => sum + time, 0) / responseTimesInMinutes.length 
        : 0;

      // Satisfaction metrics
      const ratings = services.filter(s => s.customerRating).map(s => s.customerRating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;

      // Loyalty metrics
      const loyaltyPoints = Math.floor(totalSpent / 1000); // 1 point per KSh 1000 spent
      const loyaltyTier = this.calculateLoyaltyTier(loyaltyPoints);

      // Risk assessment
      const daysSinceLastService = services.length > 0 
        ? Math.floor((new Date() - new Date(services[0].completedDate || services[0].createdAt)) / (1000 * 60 * 60 * 24))
        : 0;
      
      const riskScore = this.calculateRiskScore({
        daysSinceLastService,
        averageRating,
        totalServices,
        communicationFrequency: totalCommunications
      });

      const analytics = {
        ...CustomerAnalyticsSchema,
        customerId,
        totalServices,
        totalSpent,
        averageOrderValue,
        lifetimeValue: totalSpent, // Simplified calculation
        preferredServices,
        totalCommunications,
        averageResponseTime,
        averageRating,
        loyaltyPoints,
        loyaltyTier,
        daysSinceLastService,
        riskScore,
        lastCalculated: new Date().toISOString()
      };

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate loyalty tier
  calculateLoyaltyTier(points) {
    if (points >= 2500) return CustomerTiers.PLATINUM;
    if (points >= 1000) return CustomerTiers.GOLD;
    if (points >= 500) return CustomerTiers.SILVER;
    if (points >= 100) return CustomerTiers.BRONZE;
    return 'starter';
  }

  // Calculate risk score
  calculateRiskScore({ daysSinceLastService, averageRating, totalServices, communicationFrequency }) {
    let score = 0;

    // Days since last service (higher = more risk)
    if (daysSinceLastService > 365) score += 3;
    else if (daysSinceLastService > 180) score += 2;
    else if (daysSinceLastService > 90) score += 1;

    // Average rating (lower = more risk)
    if (averageRating < 3) score += 3;
    else if (averageRating < 4) score += 1;

    // Service frequency (lower = more risk for existing customers)
    if (totalServices > 0 && totalServices < 2) score += 1;

    // Communication frequency (too high might indicate issues)
    if (communicationFrequency > 10) score += 1;

    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  // Update customer analytics
  async updateCustomerAnalytics(customerId) {
    try {
      const result = await this.calculateCustomerAnalytics(customerId);
      if (!result.success) {
        throw new Error(result.error);
      }

      const existingIndex = this.customerAnalytics.findIndex(a => a.customerId === customerId);
      if (existingIndex >= 0) {
        this.customerAnalytics[existingIndex] = result.data;
      } else {
        this.customerAnalytics.push(result.data);
      }

      this.saveCustomerAnalytics();

      // Generate insights based on analytics
      await this.generateCustomerInsights(customerId, result.data);

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate customer insights
  async generateCustomerInsights(customerId, analytics) {
    try {
      const insights = [];
      const recommendations = [];
      const alerts = [];
      const opportunities = [];

      // High-value customer insight
      if (analytics.lifetimeValue > 100000) {
        insights.push({
          id: this.generateId('insight'),
          type: 'financial',
          category: 'high_value',
          title: 'High-Value Customer',
          description: `This customer has spent KSh ${analytics.lifetimeValue.toLocaleString()} and should receive VIP treatment.`,
          confidence: 0.9,
          impact: 'high',
          actionable: true,
          recommendations: ['Assign dedicated account manager', 'Offer premium services', 'Priority scheduling'],
          createdAt: new Date().toISOString()
        });
      }

      // Churn risk insight
      if (analytics.riskScore === 'high') {
        insights.push({
          id: this.generateId('insight'),
          type: 'risk',
          category: 'churn_risk',
          title: 'Churn Risk Detected',
          description: `Customer shows signs of potential churn based on service patterns and engagement.`,
          confidence: 0.7,
          impact: 'high',
          actionable: true,
          recommendations: ['Schedule follow-up call', 'Offer special discount', 'Request feedback'],
          createdAt: new Date().toISOString()
        });

        alerts.push({
          id: this.generateId('alert'),
          type: 'churn_risk',
          severity: 'high',
          message: `Customer ${customerId} is at high risk of churning`,
          triggeredAt: new Date().toISOString(),
          acknowledged: false
        });
      }

      // Upsell opportunity
      if (analytics.averageOrderValue > 0 && analytics.totalServices >= 2) {
        const potentialUpsellValue = analytics.averageOrderValue * 1.5;
        opportunities.push({
          id: this.generateId('opportunity'),
          type: 'upsell',
          title: 'Premium Service Upsell',
          description: 'Customer has history of multiple services and may be interested in premium offerings',
          estimatedValue: potentialUpsellValue,
          probability: 0.6,
          timeframe: '90_days',
          status: 'identified'
        });
      }

      // Loyalty program recommendation
      if (analytics.loyaltyPoints > 0 && analytics.loyaltyTier !== CustomerTiers.PLATINUM) {
        recommendations.push({
          id: this.generateId('recommendation'),
          type: 'retention',
          title: 'Loyalty Program Engagement',
          description: `Customer has ${analytics.loyaltyPoints} loyalty points. Promote tier benefits and next tier requirements.`,
          priority: 'medium',
          estimatedImpact: 'Increased customer retention and repeat business',
          effort: 'low',
          status: 'pending'
        });
      }

      const customerInsights = {
        ...CustomerInsightsSchema,
        customerId,
        insights,
        recommendations,
        alerts,
        opportunities,
        lastUpdated: new Date().toISOString()
      };

      const existingIndex = this.customerInsights.findIndex(i => i.customerId === customerId);
      if (existingIndex >= 0) {
        this.customerInsights[existingIndex] = customerInsights;
      } else {
        this.customerInsights.push(customerInsights);
      }

      this.saveCustomerInsights();

      return {
        success: true,
        data: customerInsights
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update customer journey
  async updateCustomerJourney(customerId, touchpoint) {
    try {
      let journeyIndex = this.customerJourneys.findIndex(j => j.customerId === customerId);
      
      if (journeyIndex === -1) {
        // Create new journey
        const newJourney = {
          ...CustomerJourneySchema,
          customerId,
          currentStage: 'awareness',
          touchpoints: [touchpoint],
          totalTouchpoints: 1,
          lastUpdated: new Date().toISOString()
        };
        this.customerJourneys.push(newJourney);
      } else {
        // Update existing journey
        this.customerJourneys[journeyIndex].touchpoints.push(touchpoint);
        this.customerJourneys[journeyIndex].totalTouchpoints += 1;
        this.customerJourneys[journeyIndex].lastUpdated = new Date().toISOString();
      }

      this.saveCustomerJourneys();

      return {
        success: true,
        message: 'Customer journey updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get customer insights
  getCustomerInsights(customerId) {
    try {
      const insights = this.customerInsights.find(i => i.customerId === customerId);
      return {
        success: true,
        data: insights || null
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get customer analytics
  getCustomerAnalytics(customerId) {
    try {
      const analytics = this.customerAnalytics.find(a => a.customerId === customerId);
      return {
        success: true,
        data: analytics || null
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get customer journey
  getCustomerJourney(customerId) {
    try {
      const journey = this.customerJourneys.find(j => j.customerId === customerId);
      return {
        success: true,
        data: journey || null
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all customer insights summary
  getAllCustomerInsights() {
    try {
      const summary = {
        totalCustomers: this.customerInsights.length,
        highRiskCustomers: this.customerInsights.filter(i => 
          i.alerts.some(alert => alert.type === 'churn_risk' && alert.severity === 'high')
        ).length,
        totalOpportunities: this.customerInsights.reduce((sum, i) => sum + i.opportunities.length, 0),
        totalOpportunityValue: this.customerInsights.reduce((sum, i) => 
          sum + i.opportunities.reduce((opSum, op) => opSum + op.estimatedValue, 0), 0
        ),
        pendingRecommendations: this.customerInsights.reduce((sum, i) => 
          sum + i.recommendations.filter(r => r.status === 'pending').length, 0
        )
      };

      return {
        success: true,
        data: {
          summary,
          insights: this.customerInsights
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Export customer data
  exportCustomerData(customerId, format = 'json') {
    try {
      const analytics = this.customerAnalytics.find(a => a.customerId === customerId);
      const insights = this.customerInsights.find(i => i.customerId === customerId);
      const journey = this.customerJourneys.find(j => j.customerId === customerId);
      const communications = this.communications.filter(c => c.customerId === customerId);
      const services = this.serviceHistory.filter(s => s.customerId === customerId);

      const data = {
        customerId,
        analytics,
        insights,
        journey,
        communications,
        services,
        exportedAt: new Date().toISOString()
      };

      if (format === 'csv') {
        // Simplified CSV export for analytics
        const csvData = [
          ['Metric', 'Value'],
          ['Total Services', analytics?.totalServices || 0],
          ['Total Spent', analytics?.totalSpent || 0],
          ['Average Order Value', analytics?.averageOrderValue || 0],
          ['Loyalty Points', analytics?.loyaltyPoints || 0],
          ['Loyalty Tier', analytics?.loyaltyTier || 'N/A'],
          ['Risk Score', analytics?.riskScore || 'N/A'],
          ['Average Rating', analytics?.averageRating || 0],
          ['Total Communications', analytics?.totalCommunications || 0]
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');

        return {
          success: true,
          data: csvContent,
          filename: `customer_${customerId}_analytics_${new Date().toISOString().split('T')[0]}.csv`
        };
      }

      return {
        success: true,
        data: JSON.stringify(data, null, 2),
        filename: `customer_${customerId}_complete_${new Date().toISOString().split('T')[0]}.json`
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
    // Only initialize if no data exists
    if (this.communications.length === 0 && this.serviceHistory.length === 0) {
      this.createSampleData();
    }
  }

  createSampleData() {
    // Sample customer IDs (these should match existing customers)
    const sampleCustomerIds = ['cust_001', 'cust_002', 'cust_003'];

    // Sample communications
    const sampleCommunications = [
      {
        id: this.generateId('comm'),
        customerId: 'cust_001',
        type: 'inquiry',
        channel: 'email',
        direction: 'inbound',
        subject: 'Moving Quote Request',
        content: 'Hi, I need a quote for moving from Nairobi to Mombasa. 3-bedroom house.',
        contactPerson: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+254712345678',
          role: 'Primary Contact'
        },
        status: 'completed',
        priority: 'medium',
        responseRequired: true,
        responseTime: 120, // 2 hours
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'system'
      },
      {
        id: this.generateId('comm'),
        customerId: 'cust_001',
        type: 'follow_up',
        channel: 'phone',
        direction: 'outbound',
        subject: 'Quote Follow-up Call',
        content: 'Called to discuss the moving quote and answer questions about our services.',
        contactPerson: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+254712345678',
          role: 'Primary Contact'
        },
        status: 'completed',
        priority: 'medium',
        responseRequired: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'system'
      }
    ];

    // Sample service history
    const sampleServices = [
      {
        id: this.generateId('service'),
        customerId: 'cust_001',
        serviceNumber: 'SRV20240001',
        category: 'residential_move',
        title: 'Nairobi to Mombasa Residential Move',
        description: 'Complete household move including packing, transportation, and unpacking services.',
        status: 'completed',
        requestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        quotedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        completedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        origin: {
          address: 'Westlands, Nairobi',
          coordinates: { latitude: -1.2676, longitude: 36.8108 },
          contactPerson: { name: 'John Doe', phone: '+254712345678' }
        },
        destination: {
          address: 'Nyali, Mombasa',
          coordinates: { latitude: -4.0435, longitude: 39.7348 },
          contactPerson: { name: 'John Doe', phone: '+254712345678' }
        },
        quotedAmount: 85000,
        finalAmount: 85000,
        currency: 'KSH',
        paymentStatus: 'paid',
        paymentMethod: 'mpesa',
        estimatedDuration: 8,
        customerRating: 5,
        customerFeedback: 'Excellent service! Very professional team.',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'system'
      },
      {
        id: this.generateId('service'),
        customerId: 'cust_002',
        serviceNumber: 'SRV20240002',
        category: 'office_move',
        title: 'Office Relocation - CBD to Westlands',
        description: 'Corporate office move including IT equipment and furniture.',
        status: 'completed',
        requestDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        quotedDate: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        completedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        origin: {
          address: 'CBD, Nairobi',
          coordinates: { latitude: -1.2921, longitude: 36.8219 },
          contactPerson: { name: 'Jane Smith', phone: '+254723456789' }
        },
        destination: {
          address: 'Westlands, Nairobi',
          coordinates: { latitude: -1.2676, longitude: 36.8108 },
          contactPerson: { name: 'Jane Smith', phone: '+254723456789' }
        },
        quotedAmount: 120000,
        finalAmount: 115000,
        currency: 'KSH',
        paymentStatus: 'paid',
        paymentMethod: 'bank_transfer',
        estimatedDuration: 12,
        customerRating: 4,
        customerFeedback: 'Good service, minor delays but overall satisfied.',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'system'
      }
    ];

    // Save sample data
    this.communications = sampleCommunications;
    this.serviceHistory = sampleServices;

    this.saveCommunications();
    this.saveServiceHistory();

    // Generate analytics for sample customers
    sampleCustomerIds.forEach(customerId => {
      this.updateCustomerAnalytics(customerId);
    });
  }
}

// Create singleton instance
const customerAdvancedService = new CustomerAdvancedService();

export default customerAdvancedService;
