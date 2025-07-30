// Sample Customer Data for Testing
import { CustomerTypes, CustomerStatus, AddressTypes, CommunicationPreferences, ServiceTypes, MoveStatus } from '../types/customer.js';

export const sampleCustomers = [
  {
    id: 'cust_1703123456789_abc123def',
    customerNumber: 'CUST1001',
    type: CustomerTypes.INDIVIDUAL,
    status: CustomerStatus.ACTIVE,
    personalInfo: {
      title: 'Mr',
      firstName: 'John',
      lastName: 'Kamau',
      middleName: 'Mwangi',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      nationality: 'Kenyan',
      idNumber: '12345678',
      passportNumber: '',
      profilePhoto: null
    },
    contactInfo: {
      primaryPhone: '+254712345678',
      secondaryPhone: '+254722345678',
      email: 'john.kamau@email.com',
      alternateEmail: '',
      whatsappNumber: '+254712345678',
      preferredContactMethod: CommunicationPreferences.EMAIL,
      preferredContactTime: 'evening'
    },
    addresses: [
      {
        id: 'addr_1',
        type: AddressTypes.HOME,
        isPrimary: true,
        street: '123 Kiambu Road',
        apartment: 'Apt 4B',
        city: 'Nairobi',
        state: 'Nairobi County',
        postalCode: '00100',
        country: 'Kenya',
        coordinates: { latitude: -1.2921, longitude: 36.8219 },
        accessInstructions: 'Blue gate, ring bell twice',
        isActive: true
      }
    ],
    corporateInfo: {
      companyName: '',
      registrationNumber: '',
      taxNumber: '',
      industry: '',
      companySize: '',
      website: '',
      contactPerson: { name: '', title: '', phone: '', email: '' }
    },
    emergencyContacts: [
      {
        id: 'emerg_1',
        name: 'Mary Kamau',
        relationship: 'spouse',
        phone: '+254733456789',
        email: 'mary.kamau@email.com',
        address: '123 Kiambu Road, Nairobi'
      }
    ],
    preferences: {
      preferredServices: [ServiceTypes.RESIDENTIAL_MOVE, ServiceTypes.PACKING],
      specialRequirements: 'Handle fragile items with care',
      accessibilityNeeds: '',
      petInformation: 'One small dog',
      valuableItems: 'Antique furniture, electronics',
      packingPreferences: { selfPack: false, partialPack: true, fullPack: false },
      insurancePreferences: { basicCoverage: true, fullCoverage: false, customCoverage: false },
      communicationPreferences: { smsUpdates: true, emailUpdates: true, whatsappUpdates: false, callUpdates: false }
    },
    moveHistory: [
      {
        id: 'move_1',
        moveNumber: 'MV2024001',
        date: '2024-01-15T00:00:00.000Z',
        serviceType: ServiceTypes.RESIDENTIAL_MOVE,
        status: MoveStatus.COMPLETED,
        origin: { address: '456 Westlands Avenue, Nairobi', coordinates: { latitude: -1.2634, longitude: 36.8078 } },
        destination: { address: '123 Kiambu Road, Nairobi', coordinates: { latitude: -1.2921, longitude: 36.8219 } },
        items: ['3-bedroom furniture', 'Kitchen appliances', 'Personal belongings'],
        totalValue: 500000,
        finalCost: 45000,
        rating: 5,
        feedback: 'Excellent service! Very professional team.',
        assignedStaff: ['staff_001', 'staff_002'],
        completionDate: '2024-01-15T16:30:00.000Z'
      }
    ],
    financialInfo: {
      creditLimit: 100000,
      outstandingBalance: 0,
      totalSpent: 45000,
      averageOrderValue: 45000,
      paymentMethods: [
        {
          id: 'pm_1',
          type: 'mpesa',
          details: { phoneNumber: '+254712345678' },
          isDefault: true,
          isActive: true
        }
      ],
      billingAddress: 'addr_1'
    },
    segmentation: {
      tier: 'gold',
      loyaltyPoints: 450,
      lifetimeValue: 45000,
      riskScore: 'low',
      churnProbability: 'low',
      lastServiceDate: '2024-01-15T00:00:00.000Z',
      serviceFrequency: 'occasional'
    },
    communications: [
      {
        id: 'comm_1',
        type: 'email',
        direction: 'outbound',
        subject: 'Move Completion Confirmation',
        content: 'Thank you for choosing MoveEase Pro. Your move has been completed successfully.',
        timestamp: '2024-01-15T17:00:00.000Z',
        staffMember: 'Customer Service',
        status: 'delivered',
        relatedMove: 'move_1'
      }
    ],
    documents: [],
    notes: [
      {
        id: 'note_1',
        content: 'Customer prefers morning moves. Very satisfied with previous service.',
        type: 'general',
        createdBy: 'Sales Rep',
        createdAt: '2024-01-16T09:00:00.000Z',
        isPrivate: false
      }
    ],
    tags: ['satisfied-customer', 'repeat-customer', 'referral-source'],
    systemInfo: {
      createdAt: '2023-12-01T10:00:00.000Z',
      createdBy: 'system',
      updatedAt: '2024-01-16T09:00:00.000Z',
      updatedBy: 'system',
      lastLoginAt: null,
      source: 'referral',
      referredBy: null,
      assignedSalesRep: 'sales_001',
      assignedAccountManager: 'am_001'
    },
    privacy: {
      marketingConsent: true,
      dataProcessingConsent: true,
      thirdPartySharing: false,
      communicationConsent: { email: true, sms: true, phone: false, whatsapp: false }
    }
  },
  
  {
    id: 'cust_1703123456790_def456ghi',
    customerNumber: 'CUST1002',
    type: CustomerTypes.CORPORATE,
    status: CustomerStatus.ACTIVE,
    personalInfo: {
      title: 'Ms',
      firstName: 'Sarah',
      lastName: 'Wanjiku',
      middleName: '',
      dateOfBirth: '1990-07-22',
      gender: 'female',
      nationality: 'Kenyan',
      idNumber: '23456789',
      passportNumber: '',
      profilePhoto: null
    },
    contactInfo: {
      primaryPhone: '+254723456789',
      secondaryPhone: '',
      email: 'sarah.wanjiku@techcorp.co.ke',
      alternateEmail: 'swanjiku@gmail.com',
      whatsappNumber: '+254723456789',
      preferredContactMethod: CommunicationPreferences.EMAIL,
      preferredContactTime: 'anytime'
    },
    addresses: [
      {
        id: 'addr_2',
        type: AddressTypes.WORK,
        isPrimary: true,
        street: '789 Moi Avenue',
        apartment: '5th Floor, Suite 502',
        city: 'Nairobi',
        state: 'Nairobi County',
        postalCode: '00200',
        country: 'Kenya',
        coordinates: { latitude: -1.2841, longitude: 36.8155 },
        accessInstructions: 'Use main elevator, security clearance required',
        isActive: true
      }
    ],
    corporateInfo: {
      companyName: 'TechCorp Solutions Ltd',
      registrationNumber: 'PVT-123456/2020',
      taxNumber: 'A123456789P',
      industry: 'Information Technology',
      companySize: 'medium',
      website: 'https://techcorp.co.ke',
      contactPerson: {
        name: 'Sarah Wanjiku',
        title: 'Office Manager',
        phone: '+254723456789',
        email: 'sarah.wanjiku@techcorp.co.ke'
      }
    },
    emergencyContacts: [
      {
        id: 'emerg_2',
        name: 'David Wanjiku',
        relationship: 'sibling',
        phone: '+254734567890',
        email: 'david.wanjiku@email.com',
        address: 'Karen, Nairobi'
      }
    ],
    preferences: {
      preferredServices: [ServiceTypes.OFFICE_MOVE, ServiceTypes.PACKING, ServiceTypes.ASSEMBLY],
      specialRequirements: 'IT equipment requires special handling',
      accessibilityNeeds: '',
      petInformation: '',
      valuableItems: 'Servers, computers, office equipment',
      packingPreferences: { selfPack: false, partialPack: false, fullPack: true },
      insurancePreferences: { basicCoverage: false, fullCoverage: true, customCoverage: false },
      communicationPreferences: { smsUpdates: true, emailUpdates: true, whatsappUpdates: true, callUpdates: true }
    },
    moveHistory: [
      {
        id: 'move_2',
        moveNumber: 'MV2024002',
        date: '2024-02-01T00:00:00.000Z',
        serviceType: ServiceTypes.OFFICE_MOVE,
        status: MoveStatus.COMPLETED,
        origin: { address: '456 Kimathi Street, Nairobi', coordinates: { latitude: -1.2864, longitude: 36.8230 } },
        destination: { address: '789 Moi Avenue, Nairobi', coordinates: { latitude: -1.2841, longitude: 36.8155 } },
        items: ['Office furniture', 'IT equipment', 'Filing cabinets', 'Conference room setup'],
        totalValue: 2000000,
        finalCost: 120000,
        rating: 4,
        feedback: 'Good service, but could improve on time management.',
        assignedStaff: ['staff_003', 'staff_004', 'staff_005'],
        completionDate: '2024-02-02T18:00:00.000Z'
      }
    ],
    financialInfo: {
      creditLimit: 500000,
      outstandingBalance: 0,
      totalSpent: 120000,
      averageOrderValue: 120000,
      paymentMethods: [
        {
          id: 'pm_2',
          type: 'bank_transfer',
          details: { bankName: 'KCB Bank', accountNumber: '****1234' },
          isDefault: true,
          isActive: true
        }
      ],
      billingAddress: 'addr_2'
    },
    segmentation: {
      tier: 'platinum',
      loyaltyPoints: 1200,
      lifetimeValue: 120000,
      riskScore: 'low',
      churnProbability: 'low',
      lastServiceDate: '2024-02-02T00:00:00.000Z',
      serviceFrequency: 'regular'
    },
    communications: [
      {
        id: 'comm_2',
        type: 'email',
        direction: 'inbound',
        subject: 'Office Move Inquiry',
        content: 'We need to relocate our office. Can you provide a quote?',
        timestamp: '2024-01-20T14:30:00.000Z',
        staffMember: 'Sales Team',
        status: 'read',
        relatedMove: null
      }
    ],
    documents: [],
    notes: [
      {
        id: 'note_2',
        content: 'Corporate client with potential for regular business. Handle with priority.',
        type: 'important',
        createdBy: 'Account Manager',
        createdAt: '2024-01-21T10:00:00.000Z',
        isPrivate: false
      }
    ],
    tags: ['corporate-client', 'high-value', 'regular-business'],
    systemInfo: {
      createdAt: '2024-01-20T14:30:00.000Z',
      createdBy: 'system',
      updatedAt: '2024-02-03T09:00:00.000Z',
      updatedBy: 'system',
      lastLoginAt: null,
      source: 'online',
      referredBy: null,
      assignedSalesRep: 'sales_002',
      assignedAccountManager: 'am_002'
    },
    privacy: {
      marketingConsent: true,
      dataProcessingConsent: true,
      thirdPartySharing: false,
      communicationConsent: { email: true, sms: true, phone: true, whatsapp: true }
    }
  },

  {
    id: 'cust_1703123456791_ghi789jkl',
    customerNumber: 'CUST1003',
    type: CustomerTypes.INDIVIDUAL,
    status: CustomerStatus.PROSPECT,
    personalInfo: {
      title: 'Dr',
      firstName: 'Grace',
      lastName: 'Nyong\'o',
      middleName: 'Akinyi',
      dateOfBirth: '1982-11-08',
      gender: 'female',
      nationality: 'Kenyan',
      idNumber: '34567890',
      passportNumber: '',
      profilePhoto: null
    },
    contactInfo: {
      primaryPhone: '+254734567890',
      secondaryPhone: '',
      email: 'grace.nyongo@hospital.co.ke',
      alternateEmail: '',
      whatsappNumber: '+254734567890',
      preferredContactMethod: CommunicationPreferences.PHONE,
      preferredContactTime: 'afternoon'
    },
    addresses: [
      {
        id: 'addr_3',
        type: AddressTypes.HOME,
        isPrimary: true,
        street: '321 Lavington Green',
        apartment: '',
        city: 'Nairobi',
        state: 'Nairobi County',
        postalCode: '00100',
        country: 'Kenya',
        coordinates: { latitude: -1.2667, longitude: 36.7833 },
        accessInstructions: 'Gated community, call on arrival',
        isActive: true
      }
    ],
    corporateInfo: {
      companyName: '',
      registrationNumber: '',
      taxNumber: '',
      industry: '',
      companySize: '',
      website: '',
      contactPerson: { name: '', title: '', phone: '', email: '' }
    },
    emergencyContacts: [
      {
        id: 'emerg_3',
        name: 'Peter Nyong\'o',
        relationship: 'spouse',
        phone: '+254745678901',
        email: 'peter.nyongo@email.com',
        address: '321 Lavington Green, Nairobi'
      }
    ],
    preferences: {
      preferredServices: [ServiceTypes.RESIDENTIAL_MOVE],
      specialRequirements: 'Medical equipment requires careful handling',
      accessibilityNeeds: '',
      petInformation: '',
      valuableItems: 'Medical books, equipment',
      packingPreferences: { selfPack: true, partialPack: false, fullPack: false },
      insurancePreferences: { basicCoverage: true, fullCoverage: false, customCoverage: false },
      communicationPreferences: { smsUpdates: false, emailUpdates: true, whatsappUpdates: false, callUpdates: true }
    },
    moveHistory: [],
    financialInfo: {
      creditLimit: 0,
      outstandingBalance: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      paymentMethods: [],
      billingAddress: null
    },
    segmentation: {
      tier: 'bronze',
      loyaltyPoints: 0,
      lifetimeValue: 0,
      riskScore: 'low',
      churnProbability: 'medium',
      lastServiceDate: null,
      serviceFrequency: 'one-time'
    },
    communications: [
      {
        id: 'comm_3',
        type: 'phone',
        direction: 'inbound',
        subject: 'Moving Inquiry',
        content: 'Called to inquire about residential moving services. Interested in quote.',
        timestamp: '2024-02-10T11:15:00.000Z',
        staffMember: 'Customer Service',
        status: 'completed',
        relatedMove: null
      }
    ],
    documents: [],
    notes: [
      {
        id: 'note_3',
        content: 'Potential customer. Follow up needed for quote preparation.',
        type: 'follow_up',
        createdBy: 'Sales Rep',
        createdAt: '2024-02-10T11:30:00.000Z',
        isPrivate: false
      }
    ],
    tags: ['prospect', 'medical-professional', 'follow-up-needed'],
    systemInfo: {
      createdAt: '2024-02-10T11:15:00.000Z',
      createdBy: 'system',
      updatedAt: '2024-02-10T11:30:00.000Z',
      updatedBy: 'system',
      lastLoginAt: null,
      source: 'direct',
      referredBy: null,
      assignedSalesRep: 'sales_001',
      assignedAccountManager: ''
    },
    privacy: {
      marketingConsent: false,
      dataProcessingConsent: true,
      thirdPartySharing: false,
      communicationConsent: { email: true, sms: false, phone: true, whatsapp: false }
    }
  }
];

// Function to load sample data into localStorage
export const loadSampleCustomers = () => {
  try {
    const existingCustomers = localStorage.getItem('moveease_customers');
    if (!existingCustomers || JSON.parse(existingCustomers).length === 0) {
      localStorage.setItem('moveease_customers', JSON.stringify(sampleCustomers));
      console.log('Sample customer data loaded successfully');
      return true;
    }
    console.log('Customer data already exists');
    return false;
  } catch (error) {
    console.error('Error loading sample customers:', error);
    return false;
  }
};

export default sampleCustomers;
