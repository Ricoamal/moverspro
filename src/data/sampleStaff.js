// Sample Staff Data for Testing
import { StaffRoles, StaffStatus, EmploymentType, Departments, ShiftTypes, PaymentMethods, PayrollFrequency } from '../types/staff.js';

export const sampleStaff = [
  {
    id: 'staff_1703123456789_abc123def',
    employeeNumber: 'EMP1001',
    status: StaffStatus.ACTIVE,
    personalInfo: {
      title: 'Mr',
      firstName: 'James',
      lastName: 'Mwangi',
      middleName: 'Kariuki',
      dateOfBirth: '1988-05-20',
      gender: 'male',
      nationality: 'Kenyan',
      idNumber: '28765432',
      passportNumber: '',
      profilePhoto: null,
      maritalStatus: 'married',
      religion: 'Christian',
      nextOfKin: {
        name: 'Grace Mwangi',
        relationship: 'spouse',
        phone: '+254722123456',
        email: 'grace.mwangi@email.com',
        address: '456 Thika Road, Nairobi'
      }
    },
    contactInfo: {
      primaryPhone: '+254712123456',
      secondaryPhone: '+254722123456',
      email: 'james.mwangi@moveease.co.ke',
      alternateEmail: 'jmwangi@gmail.com',
      whatsappNumber: '+254712123456',
      address: {
        street: '456 Thika Road',
        apartment: 'House 12B',
        city: 'Nairobi',
        state: 'Nairobi County',
        postalCode: '00100',
        country: 'Kenya',
        coordinates: { latitude: -1.2921, longitude: 36.8219 }
      }
    },
    employmentInfo: {
      role: StaffRoles.MANAGER,
      department: Departments.OPERATIONS,
      employmentType: EmploymentType.FULL_TIME,
      hireDate: '2022-01-15T00:00:00.000Z',
      probationEndDate: '2022-04-15T00:00:00.000Z',
      contractEndDate: null,
      reportingManager: '',
      workLocation: 'Head Office - Nairobi',
      jobDescription: 'Oversee daily operations, manage moving teams, ensure quality service delivery',
      responsibilities: [
        'Manage operations team',
        'Coordinate moves and logistics',
        'Ensure customer satisfaction',
        'Monitor team performance',
        'Handle escalations'
      ],
      skills: ['Team Management', 'Logistics', 'Customer Service', 'Problem Solving'],
      certifications: ['Operations Management Certificate', 'First Aid Certificate']
    },
    payrollInfo: {
      basicSalary: 85000,
      currency: 'KSH',
      payrollFrequency: PayrollFrequency.MONTHLY,
      paymentMethod: PaymentMethods.MPESA,
      mpesaNumber: '+254712123456',
      bankDetails: {
        bankName: 'Equity Bank',
        accountNumber: '1234567890',
        branchCode: '068',
        swiftCode: 'EQBLKENA'
      },
      taxNumber: 'A123456789P',
      nhifNumber: 'NH123456',
      nssfNumber: 'NS123456',
      allowances: [
        {
          id: 'allow_1',
          name: 'Transport Allowance',
          amount: 15000,
          frequency: 'monthly',
          taxable: true
        },
        {
          id: 'allow_2',
          name: 'Housing Allowance',
          amount: 25000,
          frequency: 'monthly',
          taxable: true
        }
      ],
      deductions: [
        {
          id: 'ded_1',
          name: 'Staff Loan',
          amount: 5000,
          frequency: 'monthly',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-12-31T00:00:00.000Z',
          balance: 35000
        }
      ]
    },
    scheduleInfo: {
      shiftType: ShiftTypes.FULL_DAY,
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '08:00',
      endTime: '17:00',
      breakDuration: 60,
      overtimeRate: 1.5,
      weeklyHours: 40,
      flexibleSchedule: false
    },
    performanceInfo: {
      currentRating: 4.2,
      lastReviewDate: '2024-01-15T00:00:00.000Z',
      nextReviewDate: '2024-07-15T00:00:00.000Z',
      goals: [
        {
          id: 'goal_1',
          title: 'Improve Customer Satisfaction',
          description: 'Achieve 95% customer satisfaction rating',
          targetDate: '2024-06-30T00:00:00.000Z',
          status: 'in_progress',
          progress: 75
        }
      ],
      achievements: [
        {
          id: 'ach_1',
          title: 'Employee of the Month',
          description: 'Outstanding performance in January 2024',
          date: '2024-01-31T00:00:00.000Z',
          category: 'recognition'
        }
      ],
      disciplinaryActions: []
    },
    attendanceInfo: {
      totalWorkingDays: 22,
      daysPresent: 21,
      daysAbsent: 1,
      lateArrivals: 2,
      earlyDepartures: 0,
      overtimeHours: 8,
      attendanceRate: 95.5,
      punctualityRate: 90.9
    },
    leaveInfo: {
      annualLeaveEntitlement: 21,
      annualLeaveUsed: 5,
      annualLeaveBalance: 16,
      sickLeaveUsed: 2,
      otherLeaveUsed: 0,
      leaveHistory: [
        {
          id: 'leave_1',
          type: 'annual',
          startDate: '2024-01-20T00:00:00.000Z',
          endDate: '2024-01-24T00:00:00.000Z',
          days: 5,
          reason: 'Family vacation',
          status: 'approved',
          approvedBy: 'HR Manager',
          appliedDate: '2024-01-10T00:00:00.000Z',
          approvalDate: '2024-01-12T00:00:00.000Z'
        }
      ]
    },
    trainingInfo: {
      completedTrainings: [
        {
          id: 'train_1',
          name: 'Customer Service Excellence',
          provider: 'Kenya Institute of Management',
          completionDate: '2023-06-15T00:00:00.000Z',
          certificateUrl: '',
          expiryDate: null,
          score: 85
        }
      ],
      ongoingTrainings: [],
      requiredTrainings: [
        {
          id: 'req_train_1',
          name: 'Safety Training Update',
          dueDate: '2024-06-30T00:00:00.000Z',
          priority: 'high'
        }
      ]
    },
    documents: [],
    accessControl: {
      permissions: ['manage_department_staff', 'approve_leave', 'access_department_reports', 'access_all_customers', 'view_payroll_reports'],
      canAccessCustomers: true,
      canAccessFinance: false,
      canAccessReports: true,
      canManageStaff: true,
      canProcessPayroll: false,
      lastLoginAt: '2024-02-15T08:30:00.000Z',
      loginAttempts: 0,
      accountLocked: false,
      passwordLastChanged: '2024-01-01T00:00:00.000Z',
      twoFactorEnabled: false
    },
    emergencyInfo: {
      medicalConditions: '',
      allergies: '',
      medications: '',
      bloodType: 'O+',
      emergencyContact: {
        name: 'Grace Mwangi',
        relationship: 'spouse',
        phone: '+254722123456',
        email: 'grace.mwangi@email.com',
        address: '456 Thika Road, Nairobi'
      },
      hospitalPreference: 'Nairobi Hospital',
      insuranceProvider: 'AAR Insurance',
      insuranceNumber: 'AAR123456'
    },
    systemInfo: {
      createdAt: '2022-01-15T00:00:00.000Z',
      createdBy: 'HR System',
      updatedAt: '2024-02-15T00:00:00.000Z',
      updatedBy: 'HR System',
      onboardingCompleted: true,
      onboardingDate: '2022-01-20T00:00:00.000Z',
      offboardingDate: null,
      offboardingReason: '',
      notes: [
        {
          id: 'note_1',
          content: 'Excellent team player with strong leadership skills',
          type: 'general',
          createdBy: 'HR Manager',
          createdAt: '2024-01-15T00:00:00.000Z',
          isPrivate: true
        }
      ]
    }
  },

  {
    id: 'staff_1703123456790_def456ghi',
    employeeNumber: 'EMP1002',
    status: StaffStatus.ACTIVE,
    personalInfo: {
      title: 'Ms',
      firstName: 'Mary',
      lastName: 'Wanjiku',
      middleName: 'Njeri',
      dateOfBirth: '1992-08-12',
      gender: 'female',
      nationality: 'Kenyan',
      idNumber: '32165498',
      passportNumber: '',
      profilePhoto: null,
      maritalStatus: 'single',
      religion: 'Christian',
      nextOfKin: {
        name: 'Peter Wanjiku',
        relationship: 'father',
        phone: '+254733456789',
        email: 'peter.wanjiku@email.com',
        address: 'Kiambu, Kenya'
      }
    },
    contactInfo: {
      primaryPhone: '+254723456789',
      secondaryPhone: '+254733456789',
      email: 'mary.wanjiku@moveease.co.ke',
      alternateEmail: 'mwanjiku@gmail.com',
      whatsappNumber: '+254723456789',
      address: {
        street: '789 Ngong Road',
        apartment: 'Apt 5C',
        city: 'Nairobi',
        state: 'Nairobi County',
        postalCode: '00100',
        country: 'Kenya',
        coordinates: { latitude: -1.3032, longitude: 36.7073 }
      }
    },
    employmentInfo: {
      role: StaffRoles.CUSTOMER_SERVICE,
      department: Departments.CUSTOMER_SERVICE,
      employmentType: EmploymentType.FULL_TIME,
      hireDate: '2023-03-01T00:00:00.000Z',
      probationEndDate: '2023-06-01T00:00:00.000Z',
      contractEndDate: null,
      reportingManager: 'staff_1703123456789_abc123def',
      workLocation: 'Head Office - Nairobi',
      jobDescription: 'Handle customer inquiries, process bookings, provide excellent customer service',
      responsibilities: [
        'Answer customer calls and emails',
        'Process move bookings',
        'Handle customer complaints',
        'Maintain customer records',
        'Follow up on service delivery'
      ],
      skills: ['Customer Service', 'Communication', 'Problem Solving', 'Computer Skills'],
      certifications: ['Customer Service Certificate']
    },
    payrollInfo: {
      basicSalary: 45000,
      currency: 'KSH',
      payrollFrequency: PayrollFrequency.MONTHLY,
      paymentMethod: PaymentMethods.MPESA,
      mpesaNumber: '+254723456789',
      bankDetails: {
        bankName: 'KCB Bank',
        accountNumber: '9876543210',
        branchCode: '001',
        swiftCode: 'KCBLKENX'
      },
      taxNumber: 'A987654321P',
      nhifNumber: 'NH987654',
      nssfNumber: 'NS987654',
      allowances: [
        {
          id: 'allow_3',
          name: 'Transport Allowance',
          amount: 8000,
          frequency: 'monthly',
          taxable: true
        },
        {
          id: 'allow_4',
          name: 'Communication Allowance',
          amount: 3000,
          frequency: 'monthly',
          taxable: true
        }
      ],
      deductions: []
    },
    scheduleInfo: {
      shiftType: ShiftTypes.FULL_DAY,
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '08:00',
      endTime: '17:00',
      breakDuration: 60,
      overtimeRate: 1.5,
      weeklyHours: 40,
      flexibleSchedule: false
    },
    performanceInfo: {
      currentRating: 4.0,
      lastReviewDate: '2023-09-01T00:00:00.000Z',
      nextReviewDate: '2024-03-01T00:00:00.000Z',
      goals: [
        {
          id: 'goal_2',
          title: 'Reduce Response Time',
          description: 'Respond to customer inquiries within 2 hours',
          targetDate: '2024-05-31T00:00:00.000Z',
          status: 'in_progress',
          progress: 60
        }
      ],
      achievements: [],
      disciplinaryActions: []
    },
    attendanceInfo: {
      totalWorkingDays: 22,
      daysPresent: 22,
      daysAbsent: 0,
      lateArrivals: 1,
      earlyDepartures: 0,
      overtimeHours: 4,
      attendanceRate: 100,
      punctualityRate: 95.5
    },
    leaveInfo: {
      annualLeaveEntitlement: 21,
      annualLeaveUsed: 3,
      annualLeaveBalance: 18,
      sickLeaveUsed: 0,
      otherLeaveUsed: 0,
      leaveHistory: []
    },
    trainingInfo: {
      completedTrainings: [
        {
          id: 'train_2',
          name: 'Customer Service Basics',
          provider: 'MoveEase Training Center',
          completionDate: '2023-03-15T00:00:00.000Z',
          certificateUrl: '',
          expiryDate: null,
          score: 92
        }
      ],
      ongoingTrainings: [
        {
          id: 'ongoing_1',
          name: 'Advanced Communication Skills',
          provider: 'Kenya Institute of Management',
          startDate: '2024-02-01T00:00:00.000Z',
          expectedCompletionDate: '2024-04-30T00:00:00.000Z',
          progress: 40
        }
      ],
      requiredTrainings: []
    },
    documents: [],
    accessControl: {
      permissions: ['access_all_customers', 'manage_communications', 'view_service_reports'],
      canAccessCustomers: true,
      canAccessFinance: false,
      canAccessReports: false,
      canManageStaff: false,
      canProcessPayroll: false,
      lastLoginAt: '2024-02-15T09:15:00.000Z',
      loginAttempts: 0,
      accountLocked: false,
      passwordLastChanged: '2023-12-01T00:00:00.000Z',
      twoFactorEnabled: false
    },
    emergencyInfo: {
      medicalConditions: '',
      allergies: 'Peanuts',
      medications: '',
      bloodType: 'A+',
      emergencyContact: {
        name: 'Peter Wanjiku',
        relationship: 'father',
        phone: '+254733456789',
        email: 'peter.wanjiku@email.com',
        address: 'Kiambu, Kenya'
      },
      hospitalPreference: 'Kenyatta National Hospital',
      insuranceProvider: 'NHIF',
      insuranceNumber: 'NHIF987654'
    },
    systemInfo: {
      createdAt: '2023-03-01T00:00:00.000Z',
      createdBy: 'HR System',
      updatedAt: '2024-02-15T00:00:00.000Z',
      updatedBy: 'HR System',
      onboardingCompleted: true,
      onboardingDate: '2023-03-05T00:00:00.000Z',
      offboardingDate: null,
      offboardingReason: '',
      notes: []
    }
  },

  {
    id: 'staff_1703123456791_ghi789jkl',
    employeeNumber: 'EMP1003',
    status: StaffStatus.ACTIVE,
    personalInfo: {
      title: 'Mr',
      firstName: 'David',
      lastName: 'Otieno',
      middleName: 'Ochieng',
      dateOfBirth: '1985-11-30',
      gender: 'male',
      nationality: 'Kenyan',
      idNumber: '25987654',
      passportNumber: '',
      profilePhoto: null,
      maritalStatus: 'married',
      religion: 'Christian',
      nextOfKin: {
        name: 'Susan Otieno',
        relationship: 'spouse',
        phone: '+254744567890',
        email: 'susan.otieno@email.com',
        address: 'Kisumu, Kenya'
      }
    },
    contactInfo: {
      primaryPhone: '+254734567890',
      secondaryPhone: '+254744567890',
      email: 'david.otieno@moveease.co.ke',
      alternateEmail: 'dotieno@gmail.com',
      whatsappNumber: '+254734567890',
      address: {
        street: '321 Mombasa Road',
        apartment: 'House 8A',
        city: 'Nairobi',
        state: 'Nairobi County',
        postalCode: '00100',
        country: 'Kenya',
        coordinates: { latitude: -1.3197, longitude: 36.8312 }
      }
    },
    employmentInfo: {
      role: StaffRoles.DRIVER,
      department: Departments.OPERATIONS,
      employmentType: EmploymentType.FULL_TIME,
      hireDate: '2021-06-01T00:00:00.000Z',
      probationEndDate: '2021-09-01T00:00:00.000Z',
      contractEndDate: null,
      reportingManager: 'staff_1703123456789_abc123def',
      workLocation: 'Field Operations',
      jobDescription: 'Drive company vehicles, transport moving teams and equipment, ensure safe delivery',
      responsibilities: [
        'Drive company trucks safely',
        'Transport moving teams to job sites',
        'Assist with loading and unloading',
        'Maintain vehicle cleanliness',
        'Report vehicle issues promptly'
      ],
      skills: ['Professional Driving', 'Vehicle Maintenance', 'Safety Compliance', 'Customer Service'],
      certifications: ['Commercial Driving License', 'Defensive Driving Certificate']
    },
    payrollInfo: {
      basicSalary: 38000,
      currency: 'KSH',
      payrollFrequency: PayrollFrequency.MONTHLY,
      paymentMethod: PaymentMethods.MPESA,
      mpesaNumber: '+254734567890',
      bankDetails: {
        bankName: 'Cooperative Bank',
        accountNumber: '5432167890',
        branchCode: '011',
        swiftCode: 'KCOOKENA'
      },
      taxNumber: 'A456789123P',
      nhifNumber: 'NH456789',
      nssfNumber: 'NS456789',
      allowances: [
        {
          id: 'allow_5',
          name: 'Transport Allowance',
          amount: 10000,
          frequency: 'monthly',
          taxable: true
        },
        {
          id: 'allow_6',
          name: 'Fuel Allowance',
          amount: 5000,
          frequency: 'monthly',
          taxable: true
        }
      ],
      deductions: []
    },
    scheduleInfo: {
      shiftType: ShiftTypes.FLEXIBLE,
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      startTime: '07:00',
      endTime: '18:00',
      breakDuration: 60,
      overtimeRate: 1.5,
      weeklyHours: 48,
      flexibleSchedule: true
    },
    performanceInfo: {
      currentRating: 4.5,
      lastReviewDate: '2023-06-01T00:00:00.000Z',
      nextReviewDate: '2024-06-01T00:00:00.000Z',
      goals: [
        {
          id: 'goal_3',
          title: 'Zero Accidents',
          description: 'Maintain perfect safety record for the year',
          targetDate: '2024-12-31T00:00:00.000Z',
          status: 'in_progress',
          progress: 90
        }
      ],
      achievements: [
        {
          id: 'ach_2',
          title: 'Safe Driver Award',
          description: '3 years without accidents',
          date: '2024-01-01T00:00:00.000Z',
          category: 'award'
        }
      ],
      disciplinaryActions: []
    },
    attendanceInfo: {
      totalWorkingDays: 26,
      daysPresent: 25,
      daysAbsent: 1,
      lateArrivals: 0,
      earlyDepartures: 0,
      overtimeHours: 12,
      attendanceRate: 96.2,
      punctualityRate: 100
    },
    leaveInfo: {
      annualLeaveEntitlement: 21,
      annualLeaveUsed: 7,
      annualLeaveBalance: 14,
      sickLeaveUsed: 1,
      otherLeaveUsed: 0,
      leaveHistory: []
    },
    trainingInfo: {
      completedTrainings: [
        {
          id: 'train_3',
          name: 'Defensive Driving Course',
          provider: 'AA Kenya',
          completionDate: '2023-08-15T00:00:00.000Z',
          certificateUrl: '',
          expiryDate: '2025-08-15T00:00:00.000Z',
          score: 95
        }
      ],
      ongoingTrainings: [],
      requiredTrainings: []
    },
    documents: [],
    accessControl: {
      permissions: ['access_assigned_moves', 'update_move_status', 'view_schedule'],
      canAccessCustomers: false,
      canAccessFinance: false,
      canAccessReports: false,
      canManageStaff: false,
      canProcessPayroll: false,
      lastLoginAt: '2024-02-15T07:30:00.000Z',
      loginAttempts: 0,
      accountLocked: false,
      passwordLastChanged: '2023-11-01T00:00:00.000Z',
      twoFactorEnabled: false
    },
    emergencyInfo: {
      medicalConditions: '',
      allergies: '',
      medications: '',
      bloodType: 'B+',
      emergencyContact: {
        name: 'Susan Otieno',
        relationship: 'spouse',
        phone: '+254744567890',
        email: 'susan.otieno@email.com',
        address: 'Kisumu, Kenya'
      },
      hospitalPreference: 'Aga Khan Hospital',
      insuranceProvider: 'Jubilee Insurance',
      insuranceNumber: 'JUB456789'
    },
    systemInfo: {
      createdAt: '2021-06-01T00:00:00.000Z',
      createdBy: 'HR System',
      updatedAt: '2024-02-15T00:00:00.000Z',
      updatedBy: 'HR System',
      onboardingCompleted: true,
      onboardingDate: '2021-06-05T00:00:00.000Z',
      offboardingDate: null,
      offboardingReason: '',
      notes: [
        {
          id: 'note_2',
          content: 'Reliable driver with excellent safety record',
          type: 'general',
          createdBy: 'Operations Manager',
          createdAt: '2024-01-01T00:00:00.000Z',
          isPrivate: true
        }
      ]
    }
  }
];

// Function to load sample staff data into localStorage
export const loadSampleStaff = () => {
  try {
    const existingStaff = localStorage.getItem('moveease_staff');
    if (!existingStaff || JSON.parse(existingStaff).length === 0) {
      localStorage.setItem('moveease_staff', JSON.stringify(sampleStaff));
      console.log('Sample staff data loaded successfully');
      return true;
    }
    console.log('Staff data already exists');
    return false;
  } catch (error) {
    console.error('Error loading sample staff:', error);
    return false;
  }
};

export default sampleStaff;
